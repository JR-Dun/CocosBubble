
const { ccclass, property } = cc._decorator;

@ccclass
export default class PanelAnim extends cc.Component {


    @property
    isParent:boolean = false;

    private initScaleX;
    private initScaleY;


    onLoad() {
        this.initScaleX = this.node.scaleX;
        this.initScaleY = this.node.scaleY;
    }

    onEnable() {
    
        this.node.runAction(cc.scaleTo(0.25, this.initScaleX, this.initScaleY));
        this.node.runAction(cc.fadeIn(0.25));
    }

    onDisable() {
        
        this.node.scaleX = 0;
        this.node.scaleY = 0;
        this.node.opacity = 0;
    }

    close(){
        this.node.runAction(cc.scaleTo(0.25, 0, 0));
        this.node.runAction(cc.fadeOut(0.25));

        this.scheduleOnce(()=>{

            if(this.isParent){
                this.node.parent.active = false;
            }else{
                this.node.active = false;
            }
          
        },0.25)
       
    }




}
