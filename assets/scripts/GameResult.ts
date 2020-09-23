
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameResult extends cc.Component {

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Label)
    maxScoreLabel: cc.Label = null;

    private isDisplay: Boolean = false;
    private closeCallback: Function = null;

    start () {

    }

    onEnable () {
        this.hide();
    }

    public show (score: number, maxScore: number = 0, closeCallback: Function) {
        if(this.isDisplay) return;

        this.closeCallback = closeCallback;

        this.isDisplay = true;
        this.scoreLabel.string = score.toString();
        this.maxScoreLabel.string = maxScore.toString();

        this.node.runAction(cc.spawn(cc.scaleTo(0.25, 1), cc.fadeIn(0.25)));
    }

    public hide () {
        this.node.opacity = 0;
        this.isDisplay = false;

        this.node.runAction(cc.scaleTo(0.25, 0));

        if(this.closeCallback) {
            this.closeCallback();
        }
    }
}
