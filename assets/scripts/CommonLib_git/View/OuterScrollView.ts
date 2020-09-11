import InnerScrollView from "./InnerScrollView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class OuterScrollView extends cc.ScrollView {

    @property(InnerScrollView)
    innerScrollViews:Array<InnerScrollView> = [];
 
    planDir = 0;
    scrollingInnerSv;

    onLoad(){
        this.planDir = null;
        this.innerScrollViews.forEach(inner => {
            inner.setOuterScrollView(this);
        });
    }

    _isHisChild(child, undeterminedParent) {
        if (child == undeterminedParent) {
            return true;
        }
        if (child.parent != null) {
            if (child.parent == undeterminedParent) {
                return true;
            } else {
                return this._isHisChild(child.parent, undeterminedParent);
            }
        }
        return false;
    }

    _findScrollingInnerSv(target) {
        for (let i = 0; i < this.innerScrollViews.length; i++) {
            let isHisChild = this._isHisChild(target, this.innerScrollViews[i].node);
            if (isHisChild) {
                return this.innerScrollViews[i];
            }
        }
        return null;
    }

    isDifferentBetweenSettingAndPlan(sv) {
        if (this.planDir == 0) {
            return false;
        }
        if (this.planDir == 1 && sv.horizontal) {
            return false;
        }
        if (this.planDir == -1 && sv.vertical) {
            return false;
        }
        return true;
    }

    _hasNestedViewGroup(event, captureListeners){
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;
        //不阻止out上onTouch事件执行。
        return false;
    }

    _onTouchBegan(event, captureListeners){
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        //重置计划方向
        this.planDir = null;
        this.scrollingInnerSv = null;

        var touch = event.touch;
        if (this.content) {
            this._handlePressLogic(touch);
        }
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
    }

    _onTouchMoved(event, captureListeners){
        // 答疑：为什么确定 m_ScrollingInnerSv, 不用captureListeners, 而要用this._findScrollingInnerSv？
        // 因为，在子ScrollView上拖动时, captureListeners中并不包含该子ScrollView本身。
        // cc.log("----------------------------");
        // captureListeners.forEach((captureListener) => {
        //     cc.log(captureListener.name);
        // });

        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        var touch = event.touch;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        
        //在滑动时, 设置开始时滑动的方向为计划方向
        //为什么在Outer中做这件事？
        //因为Outer的_onTouchMoved比Inner的早执行, 如果在Inner里做, Outer中就得忽略一帧，体验可能会不好。
        if (this.planDir == null && deltaMove.mag() > 1) {
            this.scrollingInnerSv = this._findScrollingInnerSv(event.target);
            if (this.scrollingInnerSv != null) {
                let contentSize = this.scrollingInnerSv.content.getContentSize();
                let scrollViewSize = this.scrollingInnerSv.node.getContentSize();
                if ((this.scrollingInnerSv.vertical && (contentSize.height > scrollViewSize.height)) || (this.m_ScrollingInnerSv.horizontal && (contentSize.width > scrollViewSize.width))) {
                    this.planDir = Math.abs(deltaMove.x) > Math.abs(deltaMove.y) ? 1 : -1;
                } else {
                    this.planDir = 0;
                }
            } else {
                this.planDir = 0;
            }
        }

        if (this.content) {
            this.planDir = Math.abs(deltaMove.x) > Math.abs(deltaMove.y) ? 1 : -1;
            // if (!this.isDifferentBetweenSettingAndPlan(this)) {
               
            //     this._handleMoveLogic(touch);
            // }
            if((this.vertical && this.planDir == -1) || (this.horizontal&& this.planDir == 1)){
                this._handleMoveLogic(touch);
            }

        }

        if (!this.cancelInnerEvents) {
            return;
        }

        //只取消会捕获事件的直接子物体(如Button)上的事件
        if (this.m_ScrollingInnerSv == null) {
            if (deltaMove.mag() > 7) {
                if (!this._touchMoved && event.target !== this.node) {
                    var cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                    cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                    cancelEvent.touch = event.touch;
                    cancelEvent.simulate = true;
                    event.target.dispatchEvent(cancelEvent);
                    this._touchMoved = true;
                }
            }
            this._stopPropagationIfTargetIsMe(event);
        }
    }

}
