const { ccclass, property } = cc._decorator;


@ccclass
export default class CanvasView extends cc.Component{

  
    private  canvas:cc.Canvas = null;

    protected onLoad() {
        this.canvas = this.node.getComponent(cc.Canvas);
        cc.view.setResizeCallback(() => {
           
            this.screen();
        });
        
        this.screen();
    }
       
    

 

    public screen() {

        let design = this.canvas.designResolution.width / this.canvas.designResolution.height;
        let current = cc.game.canvas.getBoundingClientRect().width / cc.game.canvas.getBoundingClientRect().height;
       
        if (design < current) {
            this.canvas.fitHeight = true;
            this.canvas.fitWidth = true;
        }
        else {
            this.canvas.fitHeight = false;
            this.canvas.fitWidth = true;
        }
    }

}