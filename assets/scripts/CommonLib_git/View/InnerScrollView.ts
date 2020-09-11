import OuterScrollView from "./OuterScrollView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class InnerScrollView extends cc.ScrollView {

    @property(OuterScrollView)
    outerScrollView:OuterScrollView = null;


    setOuterScrollView(outer) {
        this.outerScrollView = outer;
    }

    _onTouchMoved(event, captureListeners){
        if (!this.enabledInHierarchy) return;
        if (this._hasNestedViewGroup(event, captureListeners)) return;

        var touch = event.touch;
        var deltaMove = touch.getLocation().sub(touch.getStartLocation());
        
        if (this.content) {
            // if (!this.outerScrollView.isDifferentBetweenSettingAndPlan(this)) {
            //     this._handleMoveLogic(touch);
            // }
            let planDir = Math.abs(deltaMove.x) > Math.abs(deltaMove.y) ? 1 : -1;
            if((this.vertical && planDir == -1) || (this.horizontal&& planDir == 1)){
                this._handleMoveLogic(touch);
            }
        }

        if (!this.cancelInnerEvents) {
            return;
        }

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
