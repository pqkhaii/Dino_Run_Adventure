import { _decorator, Collider2D, Component, instantiate, Node, Prefab, random, randomRangeInt, sp, v2, v3 } from 'cc';
import { GameModel } from './GameModel';
const { ccclass, property } = _decorator;

@ccclass('ObstacleController')
export class ObstacleController extends Component {

    @property({type: GameModel})
    private GameModel: GameModel;

    @property({type: Prefab})
    private smallCactusPrefab: Prefab;

    @property({type: Prefab})
    private largeCactusPrefab: Prefab;

    @property({type: Prefab})
    private doubleCactusPrefab: Prefab;

    @property({type: Prefab})
    private angryBirdPrefab: Prefab;

    @property({type: Prefab})
    private angryBirdDownPrefab: Prefab;

    private smallCactus: Node = null;
    private largeCactus: Node = null;
    private doubleCactus: Node = null;
    private angryBird: Node = null;
    private angryBirdDown: Node = null;

    private obstaclePool: Node[] = []

    public get ObstaclePool() : Node[] {
        return this.obstaclePool;
    }
    
    public set ObstaclePool(v : [Node]) {
        this.obstaclePool = v;
    }

    protected start(): void {
        this.createObstacles();
    }

    protected update(deltaTime: number): void {
        if(this.GameModel.PlayGame === true){
            if(this.smallCactus.active === true){
                this.moveSmallCactus(deltaTime);
                // this.smallCactus.getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
            }
            if(this.largeCactus.active === true){
                this.moveLargeCactus(deltaTime);
                // this.largeCactus.getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
            }
            if(this.doubleCactus.active === true){
                this.moveDoubleCactus(deltaTime);
                // this.doubleCactus.getComponent(sp.Skeleton).setAnimation(0, 'animation', true);
            }
            if(this.angryBird.active === true){
                this.moveAngryBird(deltaTime);
            }
            if(this.angryBirdDown.active === true){
                this.moveAngryBirdDown(deltaTime);
            }
    
            this.updateStatusObstacles();
        }
        // else{
        //     this.smallCactus.getComponent(sp.Skeleton).clearTrack(0);
        //     this.doubleCactus.getComponent(sp.Skeleton).clearTrack(0);
        //     this.largeCactus.getComponent(sp.Skeleton).clearTrack(0);
        // }
    }

    protected createObstacles(): void {
        //Small Cactus
        this.smallCactus = instantiate(this.smallCactusPrefab);
        this.smallCactus.parent = this.node;
        this.smallCactus.position = v3(600, -175, 0.0)
        this.obstaclePool.push(this.smallCactus);
        this.smallCactus.getComponent(Collider2D).apply();

        //Large Cactus
        this.largeCactus = instantiate(this.largeCactusPrefab);
        this.largeCactus.parent = this.node;
        this.largeCactus.position = v3(1100, -175, 0.0)
        this.obstaclePool.push(this.largeCactus);
        this.largeCactus.getComponent(Collider2D).apply();

        //Double Cactus
        this.doubleCactus = instantiate(this.doubleCactusPrefab);
        this.doubleCactus.parent = this.node;
        this.doubleCactus.position = v3(2100, -175, 0.0) //y: -170
        this.obstaclePool.push(this.doubleCactus);
        this.doubleCactus.getComponent(Collider2D).apply();

        //Angry Bird
        this.angryBird = instantiate(this.angryBirdPrefab);
        this.angryBird.parent = this.node;
        this.angryBird.position = v3(2600, -70, 0.0) //100
        this.obstaclePool.push(this.angryBird);
        this.angryBird.getComponent(Collider2D).apply();

        //Angry Bird Down
        this.angryBirdDown = instantiate(this.angryBirdDownPrefab);
        this.angryBirdDown.parent = this.node;
        this.angryBirdDown.position = v3(1500, -175, 0.0)
        this.obstaclePool.push(this.angryBirdDown);
        this.angryBirdDown.getComponent(Collider2D).apply();
    }

    //Small Cactus
    protected moveSmallCactus(deltaTime: number): void {
        var posX = this.smallCactus.position.x;
        var posY = this.smallCactus.position.y;

        posX -= this.GameModel.SpeedGame * deltaTime;
        
        if(posX <= -650){
            this.smallCactus.active = false;
        }
        
        this.smallCactus.setPosition(posX, posY, 0.0);
        this.smallCactus.getComponent(Collider2D).apply();
    }

    //Large Cactus
    protected moveLargeCactus(deltaTime: number): void {
        var posX = this.largeCactus.position.x;
        var posY = this.largeCactus.position.y;

        posX -= this.GameModel.SpeedGame * deltaTime;
        
        if(posX <= -650){ //-510
            if(this.GameModel.SpeedGame <= 700){
                posX = 650; // 650
            }
            else if(this.GameModel.SpeedGame > 700 && this.GameModel.SpeedGame <= 850){
                posX = 750; 
            }
            else{
                posX = 800; //750
            }   
            this.largeCactus.active = false;
        }
        
        this.largeCactus.setPosition(posX, posY, 0.0);
        this.largeCactus.getComponent(Collider2D).apply();
    }

    //Double Cactus
    protected moveDoubleCactus(deltaTime: number): void {
        var posX = this.doubleCactus.position.x;
        var posY = this.doubleCactus.position.y;

        posX -= this.GameModel.SpeedGame * deltaTime;
        
        if(posX <= -650){
            if(this.GameModel.SpeedGame <= 700){
                posX = 650; //650
            }
            else if(this.GameModel.SpeedGame > 700 && this.GameModel.SpeedGame <= 850){
                posX = 750; 
            }
            else{
                posX = 800; //750
            }    
            this.doubleCactus.active = false;
        }
        
        this.doubleCactus.setPosition(posX, posY, 0.0);
        this.doubleCactus.getComponent(Collider2D).apply();
    }

    //Angry Bird
    protected moveAngryBird(deltaTime: number): void {
        var posX = this.angryBird.position.x;
        var posY = this.angryBird.position.y;

        posX -= this.GameModel.SpeedGame * deltaTime;
        
        if(posX <= -650){
            if(this.GameModel.SpeedGame <= 700){
                posX = 650; //650
            }
            else if(this.GameModel.SpeedGame > 700 && this.GameModel.SpeedGame <= 850){
                posX = 750; 
            }
            else{
                posX = 800; //750
            }     
            this.angryBird.active = false;
        }
        
        this.angryBird.setPosition(posX, posY, 0.0);
        this.angryBird.getComponent(Collider2D).apply();
    }

    //Angry Bird Down
    protected moveAngryBirdDown(deltaTime: number): void {
        var posX = this.angryBirdDown.position.x;
        var posY = this.angryBirdDown.position.y;

        posX -= this.GameModel.SpeedGame * deltaTime;
        
        if(posX <= -650){
            if(this.GameModel.SpeedGame <= 700){
                posX = 650; //650
            }
            else if(this.GameModel.SpeedGame > 700 && this.GameModel.SpeedGame <= 850){
                posX = 750; 
            }
            else{
                posX = 800; //750
            }    
            this.angryBirdDown.active = false;
        }
        
        this.angryBirdDown.setPosition(posX, posY, 0.0);
        this.angryBirdDown.getComponent(Collider2D).apply();
    }

    protected checkStatus(obstacle: Node): Node {
        if(obstacle.active === false){
            return obstacle;
        }
        return null;
    }

    //Update status
    protected updateStatusObstacles(): void {
        var countFalse: number = 0;
        for(let i = 0; i < this.obstaclePool.length; i++){
            if(this.obstaclePool[i].active === false){
                countFalse += 1;
            }

        }

        if(countFalse >= 4){
            var randomObstacles = randomRangeInt(1,5);

            switch(randomObstacles){
                // case 1:
                //     if(this.checkStatus(this.smallCactus) != null){
                //         this.smallCactus.active = true;
                //     }
                //     break;
                case 2:
                    if(this.checkStatus(this.largeCactus) != null){
                        this.largeCactus.active = true;
                        if(this.smallCactus.active === false){
                            var random = randomRangeInt(600, 700) //(525, 600)
                            this.smallCactus.active = true;
                            var getPosLargeCactusX = this.largeCactus.position.x + random;
                            this.smallCactus.setPosition(getPosLargeCactusX, this.smallCactus.position.y, 0.0);
                        }
                    }
                    break;
                case 3:
                    if(this.checkStatus(this.doubleCactus) != null){
                        this.doubleCactus.active = true;
                    }
                    break;
                case 4:
                    if(this.checkStatus(this.angryBird) != null){
                        this.angryBird.active = true;
                    }
                    break;
                case 1:
                    if(this.checkStatus(this.angryBirdDown) != null){
                        this.angryBirdDown.active = true;
                    }
                    break;
            }
        }
    }
}