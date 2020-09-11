import { BaseActionEffect } from "./BaseActionEffect";


const {ccclass, property} = cc._decorator;

@ccclass
export default class ScareEffect extends BaseActionEffect {

    @property
    fromScare: cc.Vec2 = new cc.Vec2(1, 1);

    @property
    toScare: cc.Vec2 = new cc.Vec2(1, 1);

    @property
    delayTime: number = 0;

    @property
    forbitFadeOut: boolean = false;

    @property
    autoFadeOut: boolean = false;



    public actionIn() {
        this.node.scaleX = 0;
        this.node.scaleY = 0;

        if(this.autoFadeOut) {
            this.scheduleOnce(function() {
                this.node.runAction(
                    cc.sequence(
                        cc.scaleTo(0.001, this.fromScare.x, this.fromScare.y),
                        cc.scaleTo(this.delayTime, this.toScare.x, this.toScare.y),
                        cc.scaleTo(0.05, this.toScare.x, this.toScare.y),
                        cc.scaleTo(0.001, 0, 0),
                ));
            }, this.delayTime);
        }
        else {
            this.scheduleOnce(function() {
                this.node.runAction(
                    cc.sequence(
                        cc.scaleTo(0.001, this.fromScare.x, this.fromScare.y),
                        cc.scaleTo(this.delayTime, this.toScare.x, this.toScare.y)
                ));
            }, this.delayTime);
        }
    }    
    
    public actionOut() {
        if(this.forbitFadeOut) 
        {
            cc.scaleTo(this.actionOutTime, this.fromScare.x, this.fromScare.y);
        }
        else
        {
            this.node.runAction(
                cc.scaleTo(this.actionOutTime, 10, 10)
            );
        }
    }


}
