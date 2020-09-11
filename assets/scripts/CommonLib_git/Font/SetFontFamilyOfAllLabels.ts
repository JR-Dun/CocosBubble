const {ccclass, property} = cc._decorator;

@ccclass
export default class SetFontFamilyOfAllLabels extends cc.Component {

    @property(cc.Font)
    public font: cc.Font = null;

    onLoad() {
        if(!this.font) return;

        // parse label
        let labels = this.node.getComponentsInChildren(cc.Label);

        for(let label of labels) {
            if (!label.font) {
                // 沒有指定字型的話，才要設定系統字
                // label.fontFamily = this.fontFamily;
                label.font = this.font;
            }   
        }
    }
}
