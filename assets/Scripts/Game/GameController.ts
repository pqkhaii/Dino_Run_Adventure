import { _decorator, Button, Component, director, Node, sys, find, Animation, RigidBody2D, input, Input, Collider2D, Contact2DType, v3, IPhysics2DContact, UITransform, BoxCollider2D, size, EventKeyboard, KeyCode, Vec2, tween, Vec3, sp, Label, color, Color, Tween, Skeleton, v2, log, Sprite } from 'cc';
import { ResultController } from './ResultController';
import { Constants } from '../Data/Constants';
import { GameModel } from './GameModel';
import { GameView } from './GameView';
import { AudioController } from './AudioController';
import { StoreAPI } from '../Loading/StoreAPI';
import { ObstacleController } from './ObstacleController';
import { DataUser } from '../Loading/DataUser';
import { LeaderboardHandle } from '../../Leaderboard/Scripts/LeaderboardHandle';

const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: GameView})
    private GameView: GameView;

    @property({type: ObstacleController})
    private ObstacleController: ObstacleController;

    @property({type: ResultController})
    private ResultController: ResultController;

    @property({type: AudioController})
    private AudioController: AudioController;

    @property({type: Button})
    private BtnJump: Button;

    @property({type: Button})
    private BtnDown: Button;

    @property({type: Button})
    private btnTryAgain: Button;

    @property({type: Node})
    private dinoHead: Node;

    @property({type: Node})
    private dinoPlayer: Node;

    //leaderboard
    @property({type: LeaderboardHandle})
    private LeaderboardHandle: LeaderboardHandle;

    //dino status
    private checkDownHead: boolean = false;
    private isJump: boolean = false;

    private isTryAgain: boolean = false;

    //API
    private gameClient;
    private userID: string
    private matchData: any;

    protected async onLoad(): Promise <void> {
        this.GameView.hideGameOver();
        this.GameView.NodeLoading.active = false;

        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.matchData = gameClientParams.matchData;
        this.userID = this.gameClient.user.citizen.getCitizenId();

        this.startMatchLog();
    }

    protected start(): void {
        this.HandleAudio();
        this.playerPhysics();

        if(Constants.isDoneTutorial === false){
            this.GameModel.PlayGame = false;
        }
        else{
            this.GameModel.PlayGame = true;
        }

        this.BtnDown.node.on(Node.EventType.TOUCH_START, this.onButtonStart, this);
        this.BtnDown.node.on(Node.EventType.TOUCH_END, this.onButtonEnd, this);

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected async update(deltaTime: number): Promise<void> {
        let _this = this;
        if(this.GameModel.PlayGame){
            //Check GameOver
            if(this.GameModel.IsOver === true){
                //Game over
                this.pauseGame();
                this.GameModel.IsPauseChecklog = false;
    
                //show loading
                this.GameView.NodeLoading.active = true;
                this.GameView.AnimLoading.getComponent(Animation).play();
                
                //show UI Over Game
                this.AudioController.onAudio(1);
                this.GameView.showGameOver();

                //Save Score API
                var getCurrentScore = Math.floor(_this.ResultController.CurrentScore);
                this.logMatch({score: getCurrentScore});
                await _this.gameClient.match
                    .completeMatch(this.matchData, {score: getCurrentScore})
                    .then((data) => {
                    })
                    .catch((error) => console.log(error));
                    this.LeaderboardHandle.show(this.gameClient, this.userID);
                this.btnTryAgain.node.active = true;
                this.GameView.TryAgain.active = true;
                this.GameView.NodeLoading.active = false;
                this.isTryAgain = true;

                // await this.gameClient.user.data.getGameData().then((response) => {
                //     var logGame  = DataUser.dataUser.data.logGame;
                //     console.log(logGame)
                //     })
                //     .catch(async (e) => {
                //         console.log('Error at get game data: ', e);
                //     })
            }
            else{

                // if(this.dinoPlayer.position.y <= -200){
                //     this.dinoPlayer.getComponent(BoxCollider2D).offset = v2(-16, 200);
                //     this.dinoPlayer.getComponent(BoxCollider2D).apply();
                // }
                // else{
                //     this.dinoPlayer.getComponent(BoxCollider2D).offset = v2(-16, 250);//515
                //     this.dinoPlayer.getComponent(BoxCollider2D).apply();
                // }
                this.checkJump();
                this.positionDinoHead();
                this.animationScore();
                
                this.ResultController.addScore(deltaTime * 20);
                
                //Update speed game
                if(this.GameModel.SpeedGame >= 950){ //1000
                    this.GameModel.SpeedGame = 950;
                }
                else{
                    this.GameModel.SpeedGame += deltaTime * 5; // x5
                }
            }
        }
    }

    //checklog
    protected logMatch(data: Object): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.gameClient.match.logMatch(this.matchData.matchId, data).catch((e) => console.log(e));
    }

    protected startMatchLog(): void {
        let id = setInterval(() => {
            if(this.GameModel.IsPauseChecklog === false){
                clearInterval(id);
                return;
            }
            this.logMatch({score: Math.floor(this.ResultController.CurrentScore)});
        }, 1000);
    }

    protected animationScore(): void {
        const milestones = [100, 200, 300, 500, 1000, 1500, 2000, 3000, 5000, 7000, 10000];
        var result = Math.floor(this.ResultController.CurrentScore);
        const animFlash = this.ResultController.LabelScore.getComponent(Animation);
        for (let i = 0; i < milestones.length; i++) {
            if (result === milestones[i]) {
                animFlash.play('LabelScoreFlash');

                if(result <= 500){
                    this.AudioController.onAudio(3);
                }
                else if(result > 500 && result <= 1000){
                    this.AudioController.onAudio(4);
                }
                else if(result > 1000 && result <= 2000){
                    this.AudioController.onAudio(5);
                }
                else{
                    this.AudioController.onAudio(6);
                }

                tween(this.ResultController.LabelScore.node).to(0.2, { scale: new Vec3(1.5, 1.5)})
                .to(0.1, { scale: new Vec3(1, 1)})
                .start();
            }
        }

        if(this.ResultController.CurrentScore >= 1000){
            this.ResultController.LabelScore.getComponent(Label).color = new Color('#FF0000')
        }
    }

    protected playerPhysics(): void {
        //Player collision
        const colliderPlayer = this.dinoPlayer.getComponent(Collider2D);
        if(colliderPlayer){
            colliderPlayer.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        }

        const colliderHeadPlayer = this.dinoHead.getComponent(Collider2D);
        if(colliderHeadPlayer){
            colliderHeadPlayer.on(Contact2DType.BEGIN_CONTACT, this.onBeginContactHead, this)
        }
    }

    protected pauseGame(): void {
        // this.stopAnim();
        
        this.GameModel.PlayGame = false;
        this.GameModel.SpeedGame = 0;

        this.dinoPlayer.getComponent(sp.Skeleton).timeScale = 0;
        this.dinoPlayer.getComponent(RigidBody2D).enabled = false;
        this.BtnDown.node.active = false;
        this.BtnJump.node.active = false;
        for(let i =0; i < this.ObstacleController.ObstaclePool.length; i++){
            this.ObstacleController.node.getChildByName('AngryBirdDown').getComponent(Animation).enabled = false;
            this.ObstacleController.node.getChildByName('AngryBird').getComponent(Animation).enabled = false;
        }
    }

    protected onButtonEnd(): void {
        this.upHeadPlayer();
    }

    protected onButtonStart(): void {
        this.downHeadPlayer();
    }

    protected onKeyDown (event: EventKeyboard): void {
        switch(event.keyCode) {
            case KeyCode.ARROW_UP:
                this.isJump = true;
                this.jumpPlayer();
                tween(this.BtnJump.node).to(0.1, { scale: new Vec3(1.2, 1.2)})
                .to(0.125, { scale: new Vec3(1, 1)})
                .start();
                break;
            case KeyCode.ARROW_DOWN:
                if(this.isJump === false){
                    this.downHeadPlayer();
                    tween(this.BtnDown.node).to(0.1, { scale: new Vec3(1.2, 1.2)})
                    .to(0.125, { scale: new Vec3(1, 1)})
                    .start();
                }
                break;
            case KeyCode.SPACE: 
                if(this.isTryAgain === true){
                    this.onTouchTryAgain();
                    this.isTryAgain = false;
                }
                break;
        }
    }

    protected onKeyUp (event: EventKeyboard): void {
        switch(event.keyCode) {
            case KeyCode.ARROW_DOWN:
                this.upHeadPlayer();
                break;
            case KeyCode.ARROW_UP:
                this.isJump = false;
                break;
        }
    }

    public jumpPlayer(): void {
        if(this.checkDownHead === false && this.GameModel.IsOver === false && this.GameModel.PlayGame === true){
            if(this.dinoPlayer.position.y <= -222){
                this.dinoPlayer.getComponent(RigidBody2D).linearVelocity = new Vec2(0,25) //gravity = 7; (0,25)
                this.animationDino(2);
                this.AudioController.onAudio(0);
            }
        }
    }

    public downHeadPlayer(): void {
        if(this.GameModel.IsOver === false){ // this.isJump === false &&
            // if(this.dinoPlayer.position.y <= -222){
                this.dinoHead.active = false;
                this.checkDownHead = true;
                this.animationDino(3);
            // }
        }
    }

    public upHeadPlayer(): void {
        if(this.GameModel.IsOver === false){
            this.dinoHead.active = true;
            this.checkDownHead = false;
            this.animationDino(1);
        }
    }

    protected checkJump(): void {
        // console.log(this.dinoPlayer.position.y)
        // if(this.dinoPlayer.position.y <= -220){
        //     this.isJump === false;
        // }

        // else{
        //     this.isJump === false;
        // }
    }

    protected animationDino(number: number): void {
        const skeleton = this.dinoPlayer.getComponent(sp.Skeleton);
        
        switch(number){
            case 1:
                // skeleton.clearTrack(3);
                skeleton.setAnimation(0, 'run', true);
                skeleton.timeScale = 1;
                break;
            case 2:
                // skeleton.clearTrack(0);
                skeleton.setAnimation(0, 'jump2', true);
                skeleton.timeScale = 1.1;
                skeleton.loop = false;   
                break;
            case 3:
                // skeleton.clearTrack(0);
                skeleton.setAnimation(0, 'crouch', true);
                skeleton.timeScale = 1;
                break;
        }
    }

    protected onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null ): void {
        //Contact ground
        if(otherCollider.tag === 1){
            this.AudioController.onAudio(2);
            if(this.checkDownHead === false){
                this.animationDino(1);
            }
            else{
                this.animationDino(3);
            }
        }
        //Contact obstacles
        if(otherCollider.tag === 2){
            this.GameModel.IsOver = true;
            // this.AudioController.onAudio(1);
        }
    }

    protected onBeginContactHead(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null ): void {
        //Contact obstacles
        if(otherCollider.tag === 2){
            this.GameModel.IsOver = true;
        }
    }

    protected positionDinoHead(): void{
        if(this.dinoHead.active === true){
            this.dinoHead.position = v3(this.dinoPlayer.position.x + 20, this.dinoPlayer.position.y + 120, 0.0) //y = 75 / 95
        }
    }

    public stopAnim(): void {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    protected HandleAudio(): void {
        if(Constants.volumeGameStatic === true){
            this.AudioController.AudioSource.play();
            this.AudioController.settingAudio(1);
        }
        else{
            this.AudioController.settingAudio(0);
        }
    }

    /**=============================== HANDLE BUTTON ===============================*/
    protected onTouchJump(): void {
        this.jumpPlayer();
    }

    protected async onTouchTryAgain(): Promise<void> {
        this.btnTryAgain.interactable = false;
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);

        this.GameModel.IsOver = false;

        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

                //Create array log
                if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
                DataUser.dataUser.data.logGame[data.matchId] = [];
            })
            .catch((error) => console.log(error));
        director.loadScene(Constants.sceneGame)
    }

    protected onTouchHome(): void {
        director.loadScene(Constants.sceneEntry);
    }
    
    protected async onTouchConfirm(): Promise<void> {
        this.GameModel.PlayGame = true;
        Constants.isDoneTutorial = true;
        this.GameView.showTutorial(false);
        DataUser.dataUser.data.tutorial = false;
        
        await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false)
        .then((response: any) => {});
    }
}
