import { _decorator, Component, Label, math, Node, Animation, find } from 'cc';
import { Constants } from '../Data/Constants';
import { LoadingController } from '../Loading/LoadingController';
import { DataUser } from '../Loading/DataUser';
import { StoreAPI } from '../Loading/StoreAPI';
const { ccclass, property } = _decorator;

@ccclass('ResultController')
export class ResultController extends Component {
    
    @property({type: Label})
    private labelScore: Label;

    @property({type: Label})
    private labelMaxScore: Label;
    
    private currentScore: number = 0;

    private gameClient: any;
    private userID: string

    //-----GET / SET -----//
    public get CurrentScore() : number {
        return this.currentScore;
    }

    public get LabelScore() : Label {
        return this.labelScore;
    }
    
    public set LabelScore(v : Label) {
        this.labelScore = v;
    }
    
    //---------------------

    protected onLoad(): void {
        let parameters = find("GameClient");
        let gameClientParams = parameters.getComponent(StoreAPI);
        this.gameClient = gameClientParams.gameClient;
        this.userID = this.gameClient.user.citizen.getCitizenId()
        
    }

    protected updateScore(number: number): void {
        this.currentScore = number;
        this.labelScore.string = Math.floor(this.currentScore).toString();
    }
    
    public addScore(deltaTime: number): void {
        this.updateScore(this.currentScore += 1 * deltaTime);
    }

    public async showResults(): Promise<void> {
        let score = Math.floor(this.currentScore);
        if (score > DataUser.dataUser.data.highScore) {
            DataUser.dataUser.data.highScore = score;
            this.scheduleOnce(()=> {
                this.labelMaxScore.getComponent(Animation).play('MaxScore');
            },0.5)
            // this.labelMaxScore.getComponent(Animation).play('MaxScore');
            await this.gameClient.user.data.setGameData( {[this.userID]: DataUser.dataUser}, false).then((response: any) => {

            })
        }
        // await this.gameClient.user.data.getGameData().then((response) => {
        //     //Save data
        //     DataUser.dataUser.data.highScore = response.data[`${this.userID}`].data.highScore;
        // }).catch(async (e) => {
        //     console.log('Error at get game data: ', e);
        // })
        this.labelMaxScore.string = DataUser.dataUser.data.highScore.toString();
    }
}