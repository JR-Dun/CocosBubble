
export class GlobalManager {

    successBindingCallback:Function;
    failBindingCallback:Function;

    private static _instance: GlobalManager;
    public static instance(): GlobalManager {
        if(!this._instance)
        {
            this._instance = new GlobalManager();
        }

        return this._instance;
    }


    XpointBinding = { 
        globalManager : null,
        init(){
            if(this.globalManager == null){
                this.globalManager = GlobalManager.instance();
            }
        },
        XpointBindingCallback(errCode:number,xpt:number){
            if(errCode == 0){
                this.globalManager.bindingSuccessCallback(xpt);
            }else{
                this.globalManager.bindFailCallback(errCode);
            }
        },

    }


    public initGlobal(successBindingCallback:Function,failBindingCallback:Function){
        this.successBindingCallback = successBindingCallback;
        this.failBindingCallback = failBindingCallback;

        (<any>window).XpointBinding = this.XpointBinding;
        (<any>window).XpointBinding.init();
        (<any>window.addEventListener('message',(ev)=>{
            (<any>window).XpointBinding.XpointBindingCallback(ev.data.code,ev.data.xpt);
        },false))
    }


    private bindingSuccessCallback(xpt){
        if(this.successBindingCallback != undefined){
            this.successBindingCallback(xpt);
        }
    }


    private bindFailCallback(errCode:number){
        if(this.failBindingCallback != undefined){
            this.failBindingCallback(errCode);
        }
    }


   
}
