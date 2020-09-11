
import { Localizable } from "../Localization/Localizable";



export class ErrorCodeManager {

    private static errorMsgDic: { [key: number]: string } = {};

    public static init(errorCodeEnum) {

        for(var desc in errorCodeEnum) {
            this.errorMsgDic[errorCodeEnum[desc]] = desc;
        }
    }


    public static getMsg(key: number): string {

        return Localizable.switchStringByKey(this.errorMsgDic[key]);
    }

}

