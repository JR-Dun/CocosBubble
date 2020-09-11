
export class HttpResponseHandler{

    public request:XMLHttpRequest;
    public sign;
    public isNative;
    public callback:Function;

   
    public response(){
        if(!this.isNative && this.request.responseURL && this.request.responseURL.length <= 0) return;


        if(this.request.readyState != 4 ) return;
        
       
        let response = this.request.responseText;
        
        if(this.request.status == 200)
        {
            
            this.callback(0, response, this.sign);
        }
        else 
        {
            this.callback(this.request.status, response, this.sign);
           
        }
    
    }

    public timeOut(){
       
        this.callback(-1, null, this.sign);
    }

}