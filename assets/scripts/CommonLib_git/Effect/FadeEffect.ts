import { BaseActionEffect } from "./BaseActionEffect";


const {ccclass, property} = cc._decorator;

@ccclass
export default class FadeEffect extends BaseActionEffect {

    @property
    fromOpacity: number = 0;

    @property
    toOpacity: number = 0;

    @property
    delayTime: number = 0;


    public actionIn() {
        this.node.opacity = this.fromOpacity;
        this.scheduleOnce(function() {
            this.node.runAction(
                cc.fadeTo(0.2, this.toOpacity),
            );
        }, this.delayTime);
    }

    public actionOut() {
        
    }
}
