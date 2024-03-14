import { _decorator, Button, Component, director, Label, Node, find } from 'cc';
import { ResultController } from './ResultController';
import { StoreAPI } from '../Loading/StoreAPI';
import { Constants } from '../Data/Constants';
const { ccclass, property } = _decorator;

@ccclass('GameView')
export class GameView extends Component {

    @property({type: ResultController})
    private ResultController: ResultController;
    
    @property({type: Node})
    private nodeShowGameOVer: Node;

    @property({type: Button})
    private btnHome: Button;

    @property({type: Label})
    private labelScore: Label;

    @property({type: Label})
    private labelYourScore: Label;

    @property({type: Node})
    private tryAgain: Node;

    @property({type: Node})
    private nodeLoading: Node;

    @property({type: Node})
    private nodeTutorial: Node;

    @property({type: Node})
    private animLoading: Node;
    
    public get TryAgain() : Node {
        return this.tryAgain;
    }
    
    public set TryAgain(v : Node) {
        this.tryAgain = v;
    }

    public get NodeLoading() : Node {
        return this.nodeLoading;
    }
    
    public set NodeLoading(v : Node) {
        this.nodeLoading = v;
    }

    public get AnimLoading() : Node {
        return this.animLoading;
    }
    
    public set AnimLoading(v : Node) {
        this.animLoading = v;
    }

    protected start(): void {
        if(Constants.isDoneTutorial === false){
            this.showTutorial(true);
        }
        else{
            this.showTutorial(false);
        }
    }

    public async showGameOver(): Promise<void> {
        this.ResultController.showResults();
        this.nodeShowGameOVer.active = true;
        // this.btnHome.node.active = false;
        this.labelScore.node.active = false;
        this.labelYourScore.string = Math.floor(this.ResultController.CurrentScore).toString();
    }

    public hideGameOver(): void {
        this.nodeShowGameOVer.active = false;
        this.btnHome.node.active = true;
        this.labelScore.node.active = true;
        // this.tryAgain.active = false;
        // director.resume();
    }

    public showTutorial(status: boolean): void {
        if(status === true){
            this.nodeTutorial.active = true;
        }
        else{
            this.nodeTutorial.active = false;
        }
    }
}