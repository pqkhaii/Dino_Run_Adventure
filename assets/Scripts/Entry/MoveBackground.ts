import { _decorator, Component, Node, Sprite, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MoveBackground')
export class MoveBackground extends Component {

    private bgStartPositionX: number;

    private bgOffsetX: number = 0.0;

    private spriteWidthBackground: number;

    protected onLoad(): void {
        this.spriteWidthBackground = this.node.getComponent(Sprite).spriteFrame.width;
    }

    protected start(): void {
        this.bgStartPositionX = this.node.position.x;
    }

    protected update(dt: number): void {
        this.bgOffsetX += 400 * dt;

        let offset: number = 0.0;

        if (this.bgOffsetX > this.spriteWidthBackground){
            offset = this.bgOffsetX - this.spriteWidthBackground;
            this.bgOffsetX = 0.0;
        }

        this.node.position = v3(this.bgStartPositionX - this.bgOffsetX - offset, this.node.position.y, this.node.position.z);
    }
}

