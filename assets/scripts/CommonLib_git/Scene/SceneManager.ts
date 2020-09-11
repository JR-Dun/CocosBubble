import { SkinManager } from "../Skin/SkinManager";
import { SceneEnum } from "../../Const/SceneEnum";


export  class SceneManager  {

    private static currentScene: string;
    private static loadScene:string;

    public static init(loadScene?:string){
        this.loadScene = loadScene;
    }

    public static clear() {
        this.currentScene = SceneEnum.SPLASH_SCENE;
    }

    public static getScene():string{
        return this.currentScene;
    }

    public static isCurrentScene(sceneName: string): boolean {
        return (this.currentScene == sceneName) ? true : false;
    }

    public static loadingScene(sceneName: string) {
        cc.director.loadScene(SkinManager.switchSceneName(this.loadScene));
        
        this.currentScene = sceneName;
    }

    public static jumpScene(sceneName: string) {
        cc.director.loadScene(SkinManager.switchSceneName(sceneName));
        
        this.currentScene = sceneName;
    }
}
