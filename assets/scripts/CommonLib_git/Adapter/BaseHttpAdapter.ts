
import { HttpHelper } from "../Http/HttpHelper";
import { BaseHttpCommand } from "../Base/BaseHttpCommand";


export  abstract class BaseHttpAdapter  {

    public sendRequest(command: BaseHttpCommand) {

        HttpHelper.instance().request(command.getRequestUrl(), command.httpType, command.getRequestData(), this.receviceResponse.bind(this), command.commandType);

    };

    protected abstract receviceResponse(result: number, response: string, sign: number);
}