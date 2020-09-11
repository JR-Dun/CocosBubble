import { WSAEACCES } from "constants";
import { WebSocketEnum } from "./WebSocketEnum";
import { BytesHelper } from "../Helper/BytesHelper";

export interface OnDataReceived {
    (buffer: any): void;
}

export interface OnReconnect {
    (isConnecting: boolean, times: number): void;
}

export class WebSocketManager {

    _ws: WebSocket = null;
    _url: string = "";
    _lastHeartBeat: number = 0;
    _heartBeatTime: number = 30;
    _protocols: string[] = ["binary"];
    _dataBuffer: ArrayBuffer = new ArrayBuffer(0);
    _onDataReceived: OnDataReceived;
    _onReconnect: OnReconnect;

    _sleep: boolean = false;
    _reconnecting: boolean = false;
    _reconnectTimes: number = 0;

    _isReading: boolean = false;
    _dataArray: Array<ArrayBuffer> = [];

    public isDisable: boolean = false;

    private static _instance: WebSocketManager;
    public static instance(): WebSocketManager {
        if(!this._instance)
        {
            this._instance = new WebSocketManager();
        }

        return this._instance;
    }

    public connect(url: string) {
        this._url = url;

        this._ws = new WebSocket(this._url, this._protocols);
        this._ws.binaryType = "arraybuffer";
        this._ws.onopen = this.onOpenCallback.bind(this);
        this._ws.onmessage = this.onMessageCallback.bind(this);
        this._ws.onerror = this.onErrorCallback.bind(this);
        this._ws.onclose = this.onCloseCallback.bind(this);
    }

    public close() {
        if(this._ws)
        {
            this._ws.close();
        }
    }

    public setSleep(isSleep: boolean) {
        this._sleep = isSleep;

        if(this._sleep)
        {
            if(this._onReconnect)
            {
                this._onReconnect(true, this._reconnectTimes);
            }
            this._ws.close();
        }
        else
        {
            this.reconnect();
        }
    }

    public setCallback(dataReceived: OnDataReceived) {
        this._onDataReceived = dataReceived;
    }

   
    public setReconnectCallback(onReconnect: OnReconnect) {
        this._onReconnect = onReconnect;
    }


    public sendProtoData(data: Uint8Array)
    {
        //log
        // console.log("WS send. *************************");
        // let decoded = fish.FishGame.decode(data);
        // console.log(decoded);
        // console.log("**********************************");

        this.send(this.packageData(WebSocketEnum.normalMessage, data));
    }


    private async timer() {
        setTimeout(() => {
            if(Date.now() - this._lastHeartBeat >= this._heartBeatTime * 1000)
            {
                this.heartbeat();
            }

            if(this._ws && this._ws.readyState === WebSocket.OPEN) {
                this.timer();
            }
        }, this._heartBeatTime * 1000);
    }

    private async reconnect() {
        if(this.isDisable) return;
        if(this._reconnecting) return;

        this._reconnecting = true;

        setTimeout(() => {
            this._reconnecting = false;
            if(this._ws && this._ws.readyState === WebSocket.OPEN) {
                // if(this._onReconnect)
                // {
                //     this._onReconnect(false);
                // }
            }
            else
            {
                if(this._onReconnect)
                {
                    this._onReconnect(true, this._reconnectTimes);
                }
                if(!this._sleep)
                {
                    this.connect(this._url);
                }
                this.reconnect();
            }
        }, 5000);
    }

    private send(msg: string | ArrayBufferLike | Blob | ArrayBufferView) {
        if(this._ws && this._ws.readyState === WebSocket.OPEN) {
            // console.log("WS send. =========================");
            // console.log(msg);
            this._ws.send(msg);
            // console.log("==================================");
        }

        this._lastHeartBeat = Date.now();
    }

    private heartbeat(received?: boolean) {
        if(received)
        {            
            console.log("WS send heartbeatAck.");
            this.send(this.packageData(WebSocketEnum.heartbeatReceived, new Uint8Array(0)));
        }
        else
        {            
            console.log("WS send heartbeat.");
            this.send(this.packageData(WebSocketEnum.heartbeatSend, new Uint8Array(0)));
        }
    }

    private packageData(dataType:WebSocketEnum, protoArray:Uint8Array): ArrayBuffer {

        let protoArrayLength = protoArray.byteLength;

        let result = new ArrayBuffer(protoArrayLength + 5);
        //长度
        let length = new Uint8Array(result, 0, 4);
        length.set(BytesHelper.intToBytes(protoArray.byteLength));
        //类型
        let type = new Uint8Array(result, 4, 1);
        type[0] = dataType;

        if(result.byteLength > 5)
        {
            //protobuf数据
            let data = new Uint8Array(result, 5, protoArray.byteLength);
            data.set(protoArray);
        }

        return result;
    }

    private callback(bufferAck:Uint8Array)
    {
        if(this._sleep) {
            console.log("!!! 过滤数据了！ ");
            return;
        } 
        
        //log
        // console.log("WS response msg: *****************");
        // let decoded = fishAck.FishGameAck.decode(bufferAck);
        // console.log(decoded);
        // console.log("**********************************");

        //回调出去
        if(this._onDataReceived)
        {
            this._onDataReceived(bufferAck);
        }
    }

    private onOpenCallback(event: Event) {
        console.log("WS was opened.");
        this._reconnectTimes++;
        this._sleep = false;
        
        if(this._onReconnect)
        {
            this._onReconnect(false, this._reconnectTimes);
        }

        this.timer();
    }

    private onMessageCallback(event: MessageEvent) {
        // console.log("WS response msg: =================");
        // console.log(event.data);
        // console.log("==================================");

        if(event.data != null)
        {
            this.receivedBuffers(event.data);
        }
    }

    private onErrorCallback(event: Event) {
        console.log("WS error.");
        console.log(event);
       // this.reconnect();
    }

    private onCloseCallback(event: CloseEvent) {
        console.log("WS closed.");
        console.log(event);
        this.reconnect();
    }
    

    private combineBuffer(buffer: ArrayBuffer): ArrayBuffer
    {
        let result = new ArrayBuffer(this._dataBuffer.byteLength + buffer.byteLength);
        let cache = new Uint8Array(result, 0, this._dataBuffer.byteLength);
        let add = new Uint8Array(result, 0, buffer.byteLength);
        cache.set(new Uint8Array(this._dataBuffer, 0, this._dataBuffer.byteLength));
        add.set(new Uint8Array(buffer, 0, buffer.byteLength));

        return result;
    }

    private async receivedBuffers(buffer: ArrayBuffer)
    {
        if(this._isReading)
        {
            this._dataArray.push(buffer);
            return;
        }

        this._isReading = true;
        // console.log(buffer);
        let newBuffer = this.combineBuffer(buffer);
        let lengthArray = new Uint8Array(newBuffer, 0, 4);
        let type = new Uint8Array(newBuffer, 4, 1);

        while(true)
        {
            let length = BytesHelper.bytesToInt(lengthArray);
            let newLength = newBuffer.byteLength - (length + 5);
            // console.log(length);
            // console.log(newLength);
            // console.log(type[0]);
            if(length >= 0 && newLength >= 0)
            {        
                if(newLength > 0) {                
                    console.log("WS length = " + length + " remain Length = " + newLength);
                }        

                let data = new Uint8Array(newBuffer, 5, length);
                this.completeBuffer(type[0], data);

                this._dataBuffer = new ArrayBuffer(newLength);
                if(newLength > 0)
                {
                    let cache = new Uint8Array(this._dataBuffer, 0, newLength);
                    cache.set(new Uint8Array(newBuffer, length + 5, newLength));
                }
                
                if(newLength <= 5)
                {
                    break;
                }
                else
                {
                    newBuffer = this._dataBuffer;
                    lengthArray = new Uint8Array(newBuffer, 0, 4);
                    type = new Uint8Array(newBuffer, 4, 1);
                }
            }
            else
            {                
                console.log("WS data need combine. target length = " + length + ", but now length = " + (length + newLength));
                this._dataBuffer = newBuffer;
                break;
            }
        }

        newBuffer = new ArrayBuffer(0);

        this._isReading = false;
        if(this._dataArray.length > 0)
        {
            this.receivedBuffers(this._dataArray[0]);
            this._dataArray.shift();
        }
    }

    private completeBuffer(type, data)
    {
        switch(type)
        {
            case WebSocketEnum.rsaPublicKey:
            case WebSocketEnum.aesDecodeKey:
            {
                break;
            }

            case WebSocketEnum.heartbeatSend:
            {
                this.heartbeat(true);
                break;
            }

            case WebSocketEnum.heartbeatReceived:
            {
                break;
            }

            case WebSocketEnum.normalMessage:
            {                
                // console.log("WS data length = " + data.byteLength);
                this.callback(data);
                break;
            }
            default:
            {
                break;
            }
        }
    }
}
