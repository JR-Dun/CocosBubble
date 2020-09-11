

export class LogHelper  {


    public static off = true;
    
    public static setDebug(isOn: boolean = false) {
        this.off = isOn;
    }

    public static log(content)
    {    
        if(this.off) {
            console.log("[log][" + Date.now() + "]");   
            console.log(content);    
        }
    }

    public static info(content)
    {
        if(this.off) {
            console.info("[info][" + Date.now() + "]" + content);
        }
    }

    public static warn(content)
    {
        console.warn(content);
    }
    
    public static error(content)
    {
        console.error(content);
    }


}
