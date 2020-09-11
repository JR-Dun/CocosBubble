import { EventDispatcherModule } from "./EventDispatcher";

// export module EventManagerModule
// {
    export class EventManager {

        static eventDispatcherDict: { [key: string]: EventDispatcherModule.EventDispatcher} = { };

        private static Register(type, key, eventFunction: Function, context: any) {
            this.GetEventDispatcher(type).Register(key.toString(), eventFunction, context);
        }

        private static UnRegister(type, key, context: any) { 
            this.GetEventDispatcher(type).UnRegister(key.toString(), context);
        }

        private static Send(type, key,...params:any[]) {
            this.GetEventDispatcher(type).Send(key.toString(), ...params);
        }

        private static GetEventDispatcher(type): EventDispatcherModule.EventDispatcher {
            var dispatcher = new EventDispatcherModule.EventDispatcher();
            if(this.eventDispatcherDict != null) {
                for(var t in this.eventDispatcherDict) {
                    if(t == type.toString()) {
                        dispatcher = this.eventDispatcherDict[t];
                        return dispatcher;
                    }
                }
            }
            this.eventDispatcherDict[type.toString()] = dispatcher;
            return dispatcher;
        }


        public static Recycle() {
            if(this.eventDispatcherDict != null) {
                for(var t in this.eventDispatcherDict) {
                    this.eventDispatcherDict[t].Recycle();
                }
            }
            this.eventDispatcherDict = {};
        }

        public static SendEvent(type, key, ...params:any[]) {
            //log
            // console.log("event send. **********************");
            // console.log("key:" + key);
            // console.log(params);
            // console.log("**********************************");
            
            this.Send(type, key, ...params);
        }

        public static RegisterEvent(type, key, eventFunction: Function, context: any) {
            this.Register(type, key, eventFunction, context);
        }

        public static UnRegisterEvent(type, key, context: any) {
            this.UnRegister(type, key, context);
        }
    }
// }