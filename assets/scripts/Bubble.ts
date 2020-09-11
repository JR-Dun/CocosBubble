const {ccclass, property} = cc._decorator;

@ccclass
export default class Bubble extends cc.Component {

    /** 初始化 */
    public init (parent: cc.Node, position: cc.Vec2, spriteFrame: cc.SpriteFrame): void {
        parent.addChild(this.node);
        this.node.position = position;
        this.setSpriteFrame(spriteFrame);
    }

    /** 设置纹理 */
    public setSpriteFrame (spriteFrame: cc.SpriteFrame): void {
        this.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    }

    /** 死亡动画 */
    public playDeathAnimation (index: cc.Vec2, finishCallback: Function = null): void {
        this.node.runAction(
            cc.sequence(
                // 膨胀后消除自己
                cc.scaleTo(0.1, 1.2),
                cc.scaleTo(0.1, 1.0),
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
