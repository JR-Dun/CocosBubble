export class RegExpHelper {
    constructor(parameters) {
        
    }

    // public static searchAccessTokenParam(str:string):string {

    //     if (!str) throw new Error("searchParam: the string is required !");
    //     let reg =/.*\?access_token=(\w+)&?.*/ig; 
    //     let r = str.replace(reg,"$1");
    //     return str.replace(reg,"$1");
    // }

    public static searchAccessTokenParam(str:string):string {

        if (!str) throw new Error("searchParam: the string is required !");
        let reg =/.*\?key=(\w+)&?.*/ig; 
        let r = str.replace(reg,"$1");
        return str.replace(reg,"$1");
    }

    public static getQueryVariable(variable):string
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return null;
}
}