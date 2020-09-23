const {ccclass, property} = cc._decorator;

@ccclass
export default class Bubble extends cc.Component {

    /** 背景 */
    @property(cc.Sprite) 
    bubbleSprite: cc.Sprite = null;

    /** 分数 */
    @property(cc.Label) 
    scoreLabel: cc.Label = null;

    onEnable() {
        if(this.bubbleSprite) this.bubbleSprite.node.scale = 1;
        if(this.scoreLabel) this.scoreLabel.node.scale = 0;
    }

    /** 初始化 */
    public init (parent: cc.Node, position: cc.Vec2, spriteFrame: cc.SpriteFrame): void {
        parent.addChild(this.node);
        this.node.position = position;
        this.setSpriteFrame(spriteFrame);
    }

    /** 设置纹理 */
    public setSpriteFrame (spriteFrame: cc.SpriteFrame): void {
        this.bubbleSprite.spriteFrame = spriteFrame;
    }

    /** 死亡动画 */
    public playDeathAnimation (index: cc.Vec2, score: number, finishCallback: Function = null): void {
        if(this.scoreLabel) {
            this.scoreLabel.string = "+" + score.toString();
            if(score > 0) {
                this.scoreLabel.node.runAction(cc.scaleTo(0.2, 1));
            }
        }
        this.node.runAction(
            cc.sequence(
                // 膨胀后消除自己
                cc.scaleTo(0.15, 1.2),
                cc.scaleTo(0.15, 1.0),
                cc.callFunc(() => {
                    if(this.bubbleSprite) this.bubbleSprite.node.runAction(cc.scaleTo(0.05, 0));
                }),
                cc.delayTime(0.15),
                cc.callFunc(() => {
                    if(finishCallback) {
                        finishCallback(index);
                    }
                }, this),
                cc.removeSelf()
            )
        );
    }

    /** 下落动画 */
    public playDownAnimation (index: cc.Vec2, finishCallback: Function = null): void {
        this.node.runAction(
            // 渐隐下落
            cc.sequence(
                cc.spawn(
                    cc.moveBy(0.5, 0, -300),
                    cc.fadeOut(0.5)
                ),
                cc.callFunc(() => {
                    if(finishCallback) {
                        finishCallback(index);
                    }
                }, this),
                cc.removeSelf()
            )
        );
    }
}
