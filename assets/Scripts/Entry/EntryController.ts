import { _decorator, Button, Color, Component, director, EventKeyboard, find, input, Input, KeyCode, Label, Node, Sprite, sys } from 'cc';
import { Constants } from '../Data/Constants';
import { AudioEntryController } from './AudioEntryController';
import { StoreAPI } from '../Loading/StoreAPI';
import { DataUser } from '../Loading/DataUser';
const { ccclass, property } = _decorator;

@ccclass('EntryController')
export class EntryController extends Component {

    @property({type: AudioEntryController})
    private AudioEntryController: AudioEntryController;

    @property({type: Button})
    private btnOnAudio: Button;

    @property({type: Button})
    private btnOffAudio: Button;

    @property({type: Button})
    private btnPlay: Button;

    @property({type: Node})
    private nodeLoading: Node;

    @property({type: Node})
    private nodeTutorial: Node;

    protected start(): void {
        this.nodeTutorial.active = false;
        this.nodeLoading.active = false;

        this.HandleAudio();
        this.handleTutorial();

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    protected handleTutorial(): void {
        if(DataUser.dataUser.data.tutorial === true || DataUser.dataUser.data.tutorial === undefined){
            Constants.isDoneTutorial = false;
        }
        else{
            Constants.isDoneTutorial = true;
        }
    }

    protected onKeyDown(event: EventKeyboard): void {
        switch(event.keyCode) {
            case KeyCode.SPACE: 
                this.onTouchPlay();       
                break;
        }
    }

    protected async onTouchPlay(): Promise<void> {
        this.btnPlay.interactable = false;
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);

        this.nodeLoading.active = true;
        await gameClientParams.gameClient.match.startMatch()
            .then((data) => {
                gameClientParams.matchData = data;

            //Create array log
            if (!DataUser.dataUser.data.logGame) DataUser.dataUser.data.logGame = {};
            DataUser.dataUser.data.logGame[data.matchId] = [];
            
            })
            .catch((error) => console.log(error));

        director.loadScene(Constants.sceneGame);
    }

    protected onTouchOnAudio(): void {
        Constants.volumeGameStatic = true;
        

        this.AudioEntryController.AudioSource.play();
        this.AudioEntryController.settingAudio(1);

        this.btnOffAudio.node.active = false;
        this.btnOnAudio.node.active = true;
    }

    protected onTouchOffAudio(): void {
        Constants.volumeGameStatic = false;

        this.AudioEntryController.settingAudio(0);

        this.btnOffAudio.node.active = true;
        this.btnOnAudio.node.active = false;
    }

    protected HandleAudio(): void {
        //handle audio
        if(Constants.volumeGameStatic === true){
            this.btnOffAudio.node.active = false;
            this.btnOnAudio.node.active = true;
            this.AudioEntryController.AudioSource.play();
            this.AudioEntryController.settingAudio(1);
        }
        else{
            this.btnOffAudio.node.active = true;
            this.btnOnAudio.node.active = false;
            this.AudioEntryController.AudioSource.stop();
            this.AudioEntryController.settingAudio(0);
        }
    }

    protected onTouchTutorial(): void {
        this.nodeTutorial.active = true;
    }

    protected onTouchContinue(): void {
        this.nodeTutorial.active = false;
    }

}