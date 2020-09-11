
export abstract class BaseWebAssemblyCommand {

    public commandKey;
    public commandAckKey;
    public data: string = "";

    public errorCode:number;
    public recevicerData:any;

    public abstract setRecevicerData(data?:string, code?);



    public staticStrToList(str:string, sign = "|") : Array<string>
    {
        let result = new Array<string>();
        if(str.indexOf(sign)==-1)
        {
            result.push(str);
        }
        else
        {
            result = str.split(sign);

        }

        return result;
    }
}
