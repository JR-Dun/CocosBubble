import { PoolManager } from "../Pool/PoolManager";

export class LoadingManager {

    private static loadingNode: cc.Node;
    private static isLoading: boolean = false;

    public static show(finish?:Function) {
        if(this.isLoading) return;

        this.isLoading = true;
        PoolManager.Get("Loading", null, (result: boolean, node: cc.Node) => {
            if (result) {
                if(this.isLoading) {
                    this.loadingNode = node;
                    let scene = cc.director.getScene();
                    scene.addChild(this.loadingNode);                       
                    this.loadingNode.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
                    if(finish){
                        finish();
                    }
                }
                else {
                    PoolManager.Put("Loading", null, node);
                }
            }
        });
    }

    public static hide() {
        this.isLoading = false;
        if (this.loadingNode) {
            PoolManager.Put("Loading", null, this.loadingNode);
        }
    }


}
