import { PoolManager } from "../CommonLib_git/Pool/PoolManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SingleSceneManager extends cc.Component {

    private gobackList: Array<string> = [];
    private currentScene: cc.Node = null;

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    public loadScene (scenePrefabName) {
        if (this.currentScene) {
            this.currentScene.destroy();
        }
        PoolManager.Get("scene", scenePrefabName, (success:boolean, node:cc.Node) => {
            if(!success) return;

            node.name = scenePrefabName;
            node.parent = cc.director.getScene();
            node.setPosition(0,0);
            this.currentScene = node;
            this.gobackList.push(scenePrefabName);
        });
    }

    public backSence () {
        var last = this.gobackList.pop();
        this.loadScene(this.gobackList.pop());
    }

    public showView (prefabName, callback) {
        PoolManager.Get("plug-in", prefabName, (success:boolean, node:cc.Node) => {
            if(!success) return;

            let windowSize = cc.winSize;
            node.name = prefabName;
            node.parent = cc.director.getScene();
            node.setPosition(windowSize.width / 2, windowSize.height / 2);
            if (callback) {
                callback(node);
            }
        });
    }

    public close (prefabName) {
        var scene = cc.director.getScene();
        var children = scene.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.name !== null && child.name === prefabName) {
                child.destroy();
                return;
            }
        }
    }
}
