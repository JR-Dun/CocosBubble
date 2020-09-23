
const {ccclass, property} = cc._decorator;

@ccclass
export default class ReadyGo extends cc.Component {

    @property([cc.SpriteFrame])
    spriteFrames: Array<cc.SpriteFrame> = [];

    private currentIndex: number = 0;
    private finishCallback: Function = null;

    start () {

    }

    onEnable () {
        this.node.scale = 0;
        this.node.opacity = 0;
        this.currentIndex = 0;
    }

    public playCountdown (finishCallback: Function) {
        this.finishCallback = finishCallback;
        this.schedule(this.countdownAction.bind(this), 1, this.spriteFrames.length - 1);
    }

    countdownAction () {
        if(this.currentIndex >= this.spriteFrames.length) this.currentIndex = 0;
        this.node.getComponent(cc.Sprite).spriteFrame = this.spriteFrames[this.currentIndex++];

        this.node.opacity = 255;
        this.node.scale = 6;
        this.node.runAction(cc.sequence(
            cc.scaleTo(0.15, 1, 1),
            cc.delayTime(0.5),
            cc.spawn(
                cc.scaleTo(0.25, 1.5, 1.5),
                cc.fadeOut(0.25)
            ),
            cc.callFunc(() => {
                if(this.finishCallback && this.currentIndex >= this.spriteFrames.length) {
                    this.finishCallback();
                }
            })
        ));
    }
}
