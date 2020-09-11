
const {ccclass, property} = cc._decorator;

@ccclass
export default class LabelEffect extends cc.Component {

    @property(cc.Boolean)
    private cutContent = false;
    
    private moveContent = false;
    private replaceStr = "..";
    private isMoving = false;

    start () {

    }

    update (dt) {

    }

    lateUpdate() {
        if(this.cutContent && this.parentWidth() < this.selfWidth()) {
            let str = this.node.getComponent(cc.Label).string;
            str = str.substr(0, str.length - this.cutLength()) + this.replaceStr;
            this.node.getComponent(cc.Label).string = str;
        }
        else if(this.moveContent && !this.isMoving && this.parentWidth() < this.selfWidth()) {
            let moveX = this.selfWidth();
            this.isMoving = true;

            this.schedule(()=>{
                this.node.runAction(cc.sequence(
                    cc.moveTo(0.01, 0, this.node.y),
                    cc.moveTo(this.selfWidth() / 50, -this.selfWidth(), this.node.y),
                    cc.fadeTo(0.01, 0),
                    cc.moveTo(0.01, this.parentWidth(), this.node.y),
                    cc.fadeTo(0.01, 255),
                    cc.moveTo(this.parentWidth() / 50, 0, this.node.y),
                ));
            }, (this.selfWidth() + this.parentWidth()) / 50 + 4, cc.macro.REPEAT_FOREVER, 3);
        }
    }

    onDisable() {
        this.stopAll();
        this.cutContent = false;
    }

    public startMoveContent() {
        this.moveContent = true;
    }

    public stopAll() {
        this.moveContent = false;
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
        this.node.x = 0;
        this.node.opacity = 255;
    }

    public cutContentAndReplaceToPoint() {
        this.cutContent = true;
    }

    private selfWidth(): number {
        return this.node.width;
    }

    private parentWidth(): number {
        return this.node.parent.width;
    }

    private cutLength(): number {
        let result = 0;
        let str = this.node.getComponent(cc.Label).string;
        if(str.indexOf(this.replaceStr) >= 0) {
            result = this.replaceStr.length + 1;
        }
        else {
            result = 1;
        }

        return result;
    }

}
