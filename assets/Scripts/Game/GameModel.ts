import { _decorator, CCFloat, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameModel')
export class GameModel extends Component {

    @property({type: CCFloat})
    private speedGame: number = 50.0;

    private isOver: boolean = false;
    private playGame: boolean = true;

    private isPauseChecklog: boolean = true;

    /** GET / SET */
    public get SpeedGame() : number {
        return this.speedGame;
    }
    public set SpeedGame(value : number) {
        this.speedGame = value;
    }

    public get IsOver() : boolean {
        return this.isOver;
    }
    public set IsOver(value : boolean) {
        this.isOver = value;
    }

    public get IsPauseChecklog(): boolean {
        return this.isPauseChecklog;
    }
    public set IsPauseChecklog(value : boolean) {
        this.isPauseChecklog = value;
    }


    // public get IsDoneTutorial() : boolean {
    //     return this.isDoneTutorial;
    // }
    // public set IsDoneTutorial(value : boolean) {
    //     this.isDoneTutorial = value;
    // }

    public get PlayGame() : boolean {
        return this.playGame;
    }
    public set PlayGame(value : boolean) {
        this.playGame = value;
    }
}