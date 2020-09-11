import { SubgameManager } from "./SubgameManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    private subgame = "Niuniu"

    onLoad(){


        SubgameManager.init("http://192.168.0.136:8000");

        if(SubgameManager.isSubgameDownload(this.subgame)){

            SubgameManager.isNeedUpdateSubgame(this.subgame,(isSuccess)=>{
                this.label.string = isSuccess ? "子游戏需要更新" : "子游戏不需要更新";
            });

        }else{
            this.label.string = "子游戏未下载";
        }

    }

    click(){

        if(this.label.string === "子游戏不需要更新"){
            SubgameManager.enterSubgame(this.subgame);
            return;
        }

        SubgameManager.downloadSubgame(this.subgame,(progress)=>{
            if (isNaN(progress)) {
                progress = 0;
            }
            this.label.string = "资源下载中   " + ~~(progress * 100) + "%";
        },(success)=>{
            if (success) {
                SubgameManager.enterSubgame(this.subgame);
            } 
        })
    }
}
