import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Constants')
export class Constants extends Component {
    public static readonly keyScore: string = 'scoreDinoRun';
    public static readonly keyVolume: string = 'volumeDinoRun';

    public static readonly sceneEntry: string = 'Entry';
    public static readonly sceneGame: string = 'Game';
    public static readonly sceneMenu: string = 'Menu';

    public static readonly MyNode: string = 'MyNode';

    public static readonly numOfBullet: number = 3;

    public static readonly numOfCoin: number = 6;

    public static readonly numOfEnemy1: number = 3;
    public static readonly numOfEnemy2: number = 2;
    public static readonly numOfEnemy3: number = 1;

    public static readonly numOfExplosion: number = 20;
    public static readonly numOfCoinCollect: number = 20;

    public static volumeGameStatic: boolean = true;
    public static scoreGameStatic: number[] = [0];

    public static isDoneTutorial: boolean = false;

    //------------------ALL TAG----------------------//
    // - tag = 1 : Ground
    // - tag = 2 : Obstacles
    // - tag = 3 : 
    // - tag = 4 : 
    // - tag = 5 : 
    // - tag = 6 : 
    // - tag = 7 : 
    // - tag = 8 : 
    //-----------------------------------------------//

}


