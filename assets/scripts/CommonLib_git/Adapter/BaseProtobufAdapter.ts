import { LogHelper } from './../Helper/LogHelper';
import { WebSocketManager } from "../WebSocket/WebSocketManager";
import { BaseCommand } from '../Base/BaseCommand';


const PROTOBUF_TIME_OUT:number = 20; //秒
const PROTOBUF_TIME_OUT_ERROR_CODE:number = 1000000;

export  abstract class BaseProtobufAdapter  {

    protected protobufClass;
    protected protobufAckClass;

    protected sendCmdArray:Array<BaseCommand> = [];
    protected ignoreTypeArray:Array<number> = [];

    constructor(protobufClass,protobufAckClass){
        this.protobufClass = protobufClass;
        this.protobufAckClass = protobufAckClass;
        WebSocketManager.instance().setCallback(this.receviceCommand.bind(this));
        this.timer();
    }

    public sendCommand(command: BaseCommand) {        
        this.pushToSendArray(command);
        WebSocketManager.instance().sendProtoData(this.protobufClass.encode(command.game).finish());
    };
  
    protected receviceCommand(data){
        let gameAck = this.protobufAckClass.decode(data);
        this.onGameAck(gameAck);
        this.removeFromSendArray(gameAck.type);
    };

    protected abstract onGameAck(gameAck);      
    
    public setTimeOutIgnoreTypes(ignoreTypes:Array<number>) {
        if(ignoreTypes) {
            this.ignoreTypeArray = ignoreTypes;
        }
        else {
            this.ignoreTypeArray = [];
        }
    }
    
    private checkTimeOutCommand() {
        this.sendCmdArray.forEach((element, index) => {
            if(element.timePassed() > PROTOBUF_TIME_OUT * 1000) {
                LogHelper.error("protobuf no received type " + element.game.type + " !!");
                
                //从队列移除
                this.sendCmdArray.splice(index, 1);

                //返回错误码
                this.timeOutCommand(element.game.type);
            }
        });
    }

    private timeOutCommand(type) {
        // let gameAck = {"type" : type, "errorCode" : PROTOBUF_TIME_OUT_ERROR_CODE};
        // this.onGameAck(gameAck);
    }

    private pushToSendArray(command: BaseCommand) {  
        if(this.ignoreTypeArray.indexOf(command.game.type) >= 0) return;

        this.sendCmdArray.push(command);
    }

    private removeFromSendArray(type) {
        let index = 0;
        for(index; index < this.sendCmdArray.length; index++) {
            if(this.sendCmdArray[index].game.type == type) {
                this.sendCmdArray.splice(index, 1);
                break;
            }
        }
    }

    private async timer() {
        setTimeout(() => {
            this.checkTimeOutCommand();
            this.timer();
        }, 10000);
    }
}
