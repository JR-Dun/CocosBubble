import { BaseCommand } from "./BaseCommand";
import { AdapterFactory } from "../Adapter/AdapterFactory";
import { BaseHttpCommand } from "./BaseHttpCommand";
import { BaseWebAssemblyCommand } from "./BaseWebAssemblyCommand";




export abstract class BaseService  {

    public static isInit:boolean = false;

    protected static sendCommand(command:BaseCommand){
       
        AdapterFactory.getProtobufAdapter().sendCommand(command);
        
    }

    protected static sendRequest(command:BaseHttpCommand){
     
        AdapterFactory.getHttpAdapter().sendRequest(command);
        
    }

    protected static sendWebAssemblyCommand(command:BaseWebAssemblyCommand){
        
        AdapterFactory.getWebAssemblyAdapter().sendCommand(command);
    }

    public static init(){
        if(!this.isInit){
            this.onInit();
            this.isInit = true;
        }
    }

    protected static onInit(){

    }

  
}
