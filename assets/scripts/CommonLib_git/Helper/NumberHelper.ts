import { LanguageEnum } from "../Localization/LanguageEnum";


export  class NumberHelper  {

   /// <summary>
    /// 转换为以k为单位的格式 并保留一位小数
    /// </summary>
    /// <param name="l"></param>
    /// <returns></returns>
    public static numberFormat(num:number, language:LanguageEnum = LanguageEnum.SimpleChinese):string
    {
        if (num < 1000)
        {
            return num.toString();
        }
        else if(language != LanguageEnum.SimpleChinese)
        {
            if(num < 1000000)
            {   
                if(num%1000==0){
                    return num / 1000 + "K";
                }else{
                    num = this.retainDecimals(num/1000);
                    return num + "K";
                }
                
            }
            else {
                if(num%1000000==0){
                    return num / 1000000 + "M";
                }else{
                    num = this.retainDecimals(num/1000000);
                    return num + "M";
                }
            }
        }
        else
        {
            if(num < 10000)
            {   
                if(num%1000==0){
                    return num / 1000 + "K";
                }else{
                    num = this.retainDecimals(num/1000);
                    return num + "K";
                }
                
            }
            else {
                if(num%10000==0){
                    return num / 10000 + "萬";
                }else{
                    num = this.retainDecimals(num/10000);
                    return num + "萬";
                }
            }
        }
    }

    public static retainDecimals(value: number,count:number = 4): number {
        let valueString = Math.abs(value).toString();
        if(valueString.indexOf(".") < 0) {
            return value;
        }

        let str  = "/^\\d+(?:\\.\\d{0,"+count+"})?/";   
        return Number(valueString.match(eval(str))) * (value >= 0 ? 1 : -1);
    }

    public static retainDoubleDecimals(value: number): number {
        let valueString = Math.abs(value).toString();
        if(valueString.indexOf(".") < 0) {
            return value;
        }
        return Number(valueString.match(/^\d+(?:\.\d{0,2})?/)) * (value >= 0 ? 1 : -1);
    }
  
}
