import { PoolManager } from "../Pool/PoolManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ToastView extends cc.Component {

    @property
    delayTime:number = 2.5;
    @property(cc.Node)
    content:cc.Node = null;
    @property(cc.Vec2)
    pos:cc.Vec2 = null;
    @property
    moveOffsetY:number = 50;


    public onDisableCallback:Function;

    private time = 0;

    onEnable(){
        this.anim();
    }
  
    update(dt){
        this.time += dt;
       
        if(this.time >= this.delayTime){
            this.time = 0;
            PoolManager.Put("Toast",null,this.node);
          
        }
    }

    onDisable(){
        if(this.onDisableCallback){
            this.onDisableCallback();
        }
     
    }

    public clean(){
        this.time = 0;
    }

    public anim(){
        this.clean();
        this.content.setPosition(cc.v2(this.pos.x,this.pos.y- this.moveOffsetY));
        this.content.opacity = 0;
        this.content.runAction(cc.moveTo(0.25,this.pos));
        this.content.runAction(cc.fadeIn(0.25));
        this.scheduleOnce(()=>{
            this.content.runAction(cc.moveTo(0.5,cc.v2(this.pos.x,this.pos.y+this.moveOffsetY)));
            this.content.runAction(cc.fadeOut(0.5));
        },1)

    }

}
