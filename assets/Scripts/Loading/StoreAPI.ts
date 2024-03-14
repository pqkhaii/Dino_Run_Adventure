import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StoreAPI')
export class StoreAPI extends Component {
    public gameClient: any;
    public matchData: any;
}

