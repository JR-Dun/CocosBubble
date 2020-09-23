
const {ccclass, property} = cc._decorator;

@ccclass
export default class Combo extends cc.Component {

    @property(cc.Label)
    countLabel: cc.Label = null;


    start () {

    }

    onEnable () {
        this.node.scale = 0;
    }

    public playAnimation (count: number) {
        this.countLabel.string = count.toString();
        this.node.runAction(
            cc.sequence(
                // 膨胀后消除自己
                cc.scaleTo(0.25, 2),
                cc.delayTime(0.6),
                cc.scaleTo(0.15, 0)
            )
        );
    }
}
