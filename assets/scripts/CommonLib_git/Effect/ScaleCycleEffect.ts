
const {ccclass, property} = cc._decorator;

@ccclass
export default class ScaleCycleEffect extends cc.Component {

    _action;
    _scale;

    start() {

    }

    onEnable() {
        let scaleX = Math.abs(this.node.scaleX);
        let scaleY = Math.abs(this.node.scaleY);
        let scaleTo = 0;
        if(scaleX > scaleY) {
            scaleTo = scaleY;
        }
        else {
            scaleTo = scaleX;
        }
        this.node.setScale(0, 0);

        this._action = cc.repeatForever(cc.sequence(
            cc.scaleTo(0.3, scaleTo + 0.1),
            cc.scaleTo(0.2, scaleTo - 0.1)
        ));
        this.node.runAction(this._action);
    }

    onDisable() {
        this.node.stopAction(this._action)
    }
}
