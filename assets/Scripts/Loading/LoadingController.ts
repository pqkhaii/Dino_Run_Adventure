import GameClient from '@onechaintech/gamesdk';
import { _decorator, Component, director, find, Node } from 'cc';
import { StoreAPI } from './StoreAPI';
import { DataUser } from './DataUser';
const { ccclass, property } = _decorator;

@ccclass('LoadingController')
export class LoadingController extends Component {

    public gameClient;

    public async start() : Promise<void> {
        let _this = this;
        let parameters = find("GameClient");
        
        if (parameters === null) {
            let parameters = new Node("GameClient");
            if (this.gameClient === undefined) {
                this.gameClient = new GameClient("6491b5971d76df033edf5c8b", "87876c96-d1f6-4d2f-a4df-a05633db1fa2", window.parent, {dev: true });
                await this.gameClient.initAsync()
                .then(async (data) => {
                    //Get current user id
                    let userID = this.gameClient.user.citizen.getCitizenId();

                    //Get gamedata from server
                    await this.gameClient.user.data.getGameData().then((response) => {
                        //Save data
                        if (response.data[`${userID}`] !== undefined) DataUser.dataUser = response.data[`${userID}`];

                    }).catch(async (e) => {
                        console.log('Error at get game data: ', e);
                    })

                    let gameClientParams = parameters.addComponent(StoreAPI);
                    gameClientParams.gameClient = this.gameClient;
                    director.addPersistRootNode(parameters);

                    director.loadScene("Entry");
                })
                .catch((err) => console.log(err));
            }
        }
    }
}

