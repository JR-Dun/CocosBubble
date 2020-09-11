import { HttpResponseHandler } from './HttpResponseHandler';
import { LogHelper } from "../Helper/LogHelper";
import { CommandEnum } from "./CommandEnum";

export class HttpHelper {

    _host: string = "";
    _clientSecret: string = "Y2xpZW50aWQ6c2VjcmV0";
    _authorization: string = "";
    _isMock: boolean = false;
    _isNative: boolean = false;
    _timeOut: number = 20 * 1000;

    
  
    private static _instance: HttpHelper;
    public static instance(): HttpHelper {
        if(!this._instance)
        {
            this._instance = new HttpHelper();
        }

        return this._instance;
    }

    public configHost(host: string) {
        this._host = host;
    }

    public configGetBindXptUrl(userId : string) : string{
        let url = "api/xpt/authorize/bind?userId=" + userId;
        return url;
    }

    public configMock(isMock: boolean) {
        this._isMock = isMock;
    }

    public configClientSecret(clientSecret: string) {
        this._clientSecret = clientSecret;
    }

    public configAuthorization(authorization: string) {
        this._authorization = authorization;
    }

    public configNative(isNative: boolean) {
        this._isNative = isNative;
    }

    public request(url, httpType, requestData?, callback?, sign?)
    {

        if(httpType == 0)
        {
            this.get(url, callback,sign);
        }
        else
        {
            this.post(url, requestData, callback,sign);
        }
    }

    private get(url, callback,sign) {
       
        let requestUrl = this.getRequestUrl(url);
        let request = new XMLHttpRequest();
        
        let handler = new HttpResponseHandler();
        handler.callback = callback;
        handler.isNative = this._isNative;
        handler.request = request;
        handler.sign = sign;
        request.ontimeout = handler.timeOut.bind(handler);
        request.onreadystatechange = handler.response.bind(handler);
        request.open("GET", requestUrl, true);
        request.timeout = this._timeOut;
        
        request.setRequestHeader("authorization" , this.getAuthorization()); 
        request.send();
      
    }

    private post(url, requestData, callback,sign) {
        
        let requestUrl = this.getRequestUrl(url);
        let request = new XMLHttpRequest();
       
        let handler = new HttpResponseHandler();
        handler.callback = callback;
        handler.isNative = this._isNative;
        handler.request = request;
        handler.sign = sign;
        request.ontimeout = handler.timeOut.bind(handler);
        request.onreadystatechange = handler.response.bind(handler);
        request.open("POST", requestUrl, true);
        request.timeout = this._timeOut;
        request.setRequestHeader("Content-Type" , "application/json"); 
        request.setRequestHeader("authorization" , this.getAuthorization()); 
        request.send(requestData);
      
    }

    private getAuthorization(): string
    {
        if(this._authorization && this._authorization.length > 0)
        {
            return "Bearer " + this._authorization;
        }
        else
        {
            return "Basic " + this._clientSecret;
        }
    }


    private getRequestUrl(url: string): string {
       
        if(url.toLowerCase().indexOf("http") >= 0) return url;

        // if(this._host.toLowerCase().indexOf("http") < 0)
        // {
        //     this._host = "http://" + this._host;
        // }

        let result;
        if(this._isMock)
        {
            result = this._host + "/mock/" + url;
        }
        else
        {
            result = this._host + "/" + url;
        }
        return result;
    }


    // private responseCallback() {
    //     if(!this._isNative && this.getRequest().responseURL.length <= 0) return;
    //     if(this.getRequest().readyState != 4) return;

    //     clearTimeout(this._timer);
    //     this._isBusy = false;
    //     let response = this.getRequest().responseText;
    //     LogHelper.log("response " + response);
    //     LogHelper.log("****************  end  ****************");
    //     if(this.getRequest().status == 200)
    //     {
    //         if(this._isNative) {
    //             this._request = null;
    //         }
    //         this.callback(0, response, this._sign);
    //     }
    //     else 
    //     {
    //         this.callback(this.getRequest().status, response, this._sign);
    //         if(this._isNative) {
    //             this._request = null;
    //         }
    //     }
    // }
}