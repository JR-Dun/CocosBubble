import { BaseActionEffect } from "./BaseActionEffect";
import { LogHelper } from "../Helper/LogHelper";


const {ccclass, property} = cc._decorator;

@ccclass
export default class MoveEffect extends BaseActionEffect {

    @property(cc.Vec2)
    fromPoint: cc.Vec2 = null;

    @property(cc.Vec2)
    toPoint: cc.Vec2  = null;

    @property
    runTime: number = 0.15;


    public actionIn() {
        this.node.runAction(
            cc.moveTo(this.runTime, this.toPoint.x, this.toPoint.y)
        );
    }

    public actionOut() {
        this.node.runAction(
            cc.moveTo(this.actionOutTime, this.fromPoint.x, this.fromPoint.y)
        );
    }
}
