import { PoolManager } from './../Pool/PoolManager';




export class ToastManager {

 

    public static show(msg: string) {

    
        PoolManager.Get("Toast",null,(result,node)=>{

            if(result){
                let scene = cc.director.getScene();
                try {
                    scene.addChild(node);
                    node.setPosition(cc.winSize.width/2, cc.winSize.height/2);
                    node.getComponentInChildren(cc.Label).string = msg;
                
                   
                } catch (error) {
                   
                }
            }
              
        });

    }


    


}
