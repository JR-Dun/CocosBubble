import { EventModule } from "./Event";

export module EventDispatcherModule
{
    export class EventDispatcher {

        eventDict: { [key: string]: EventModule.Event} = { };

        public Register(key: string, eventFunction: Function, context: any) {
            this.GetEvent(key).Add(new EventModule.Observer(eventFunction, context));
        }

        public UnRegister(key:string, context: any) {
            this.GetEvent(key).Remove(context);
        }

        public UnRegisterAll(key:string) {
            this.GetEvent(key).RemoveAll();
        }

        public Send(key:string, ...params:any[]) {
            this.GetEvent(key).Send(...params);
        }

        public Recycle() {
            if(this.eventDict != null) {
                for(var k in this.eventDict) {
                    this.eventDict[k].RemoveAll();
                }
            }
            this.eventDict = {};
        }


        private GetEvent(key:string): EventModule.Event {
            var event = new EventModule.Event();
            if(this.eventDict != null) {
                for(var k in this.eventDict) {
                    if(k == key) {
                        event = this.eventDict[k];
                        return event;
                    }
                }
            }
            this.eventDict[key] = event;
            return event;
        }
    }
}