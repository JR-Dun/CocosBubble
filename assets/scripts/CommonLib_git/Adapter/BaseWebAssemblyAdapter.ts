import { BaseWebAssemblyCommand } from "../Base/BaseWebAssemblyCommand";

export abstract class BaseWebAssemblyAdapter  {

   abstract sendCommand(command:BaseWebAssemblyCommand);

   protected abstract receviceCommand(command:string,data:string,code);
}
