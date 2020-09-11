

const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoScale extends cc.Component {

    @property(cc.Vec2)
    startScale:cc.Vec2 = cc.Vec2.ZERO;
    @property(cc.Vec2)
    endScale:cc.Vec2 = cc.Vec2.ZERO;
    @property
    delayTime:number = 0;


  
    onEnable(){
        this.node.setScale(this.startScale.x,this.startScale.y);
        this.node.runAction(cc.scaleTo(this.delayTime,this.endScale.x,this.endScale.y))
    }

    
}
