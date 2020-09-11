
export class Localizable {

    public static keyEnum;
    public static currentEnum;
    private static localizations: { [key: string]: string } = {};


    public static init(keyEnum, currentsEnum) {
        this.keyEnum = keyEnum;
        this.currentEnum = currentsEnum;
        for (var key in this.keyEnum) {
            this.localizations[this.keyEnum[key]] = key;
        }

    }

    public static switchString(index:number): string {
        let result = "";
        if (this.currentEnum) {

            result = this.currentEnum[this.localizations[index]];
        }

        return result;
    }

    public static switchStringByKey(key): string {
        let result = "";
        if (this.currentEnum) {

            result = this.currentEnum[key];

        }

        return result;
    }



}
