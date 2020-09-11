import { HttpEnum } from "../Http/HttpEnum";


export abstract class BaseHttpCommand  {

  public url:string;
  public httpType:HttpEnum;
  public commandType: number;
  public errCode:number;

  public abstract setRecevicerData(response);

  
  public getRequestUrl() {

    let result: string = "";
    if(this.httpType == HttpEnum.Get)
    {
      let keyCount = 0;
      let keys = Object.keys(this);
      for(let i = 0; i < keys.length; i++)
      {
        if(keys[i] != "url" && keys[i] != "httpType" && keys[i] != "commandType" && keys[i] != "errCode")
        {
          if(keyCount == 0) { result = "?"; }
          else { result += "&"; }

          if(this[keys[i]]) {
            result += (keys[i].toString() + "=" + this[keys[i]].toString());
            keyCount++;
          }
        }
      }
      result = this.url + result;
    }
    else
    {
      result = this.url;
    }

    return result;
  }

  public getRequestData() {

    let result: string = "";
    if(this.httpType == HttpEnum.Get)
    {

    }
    else
    {
      let keyCount = 0;
      let keys = Object.keys(this);
      for(let i = 0; i < keys.length; i++)
      {
        if(keys[i] != "url" && keys[i] != "httpType" && keys[i] != "commandType" && keys[i] != "errCode")
        {
          if(this[keys[i]]) {
            if(keyCount > 0) { result += ","; }

            result += "\"" + (keys[i].toString() + "\":\"" + this[keys[i]].toString()) + "\"";
            keyCount++;
          }
        }
      }
      result = result.replace(/\n/g,"\\n");
      result = "{" + result + "}";
    }

    return result;
  }
}
