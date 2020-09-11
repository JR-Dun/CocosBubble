export module EventModule
{
    export class Observer {
        private callback: Function = null;

        private context: any = null;

        constructor(callback: Function, context: any) {
            this.callback = callback;
            this.context = context;
        }

        notify(...args: any[]): void {
            this.callback.call(this.context, ...args);
        }

        isContext(context: any): boolean {
            return context == this.context;
        }
    } 

    export class Event {

        private eventList: Array<Observer> = null;

        public Send (...params: any[]): boolean {
            if(this.eventList == null || this.eventList.length <= 0) {
                return false;
            }

            for(var i = 0; i < this.eventList.length; i++) {
                this.eventList[i].notify(...params);
            }

            return true;
        }

        public Add (listener: Observer): boolean {
            if(this.eventList == null) {
                this.eventList = new Array<Observer>();
            }

            if(this.eventList.indexOf(listener) >= 0) {
                return false;
            }

            this.eventList.push(listener);
            return true;
        }

        public Remove (context: any): void {
            if(this.eventList == null || this.eventList.length <= 0) {
                return;
            }

            this.eventList.forEach((element, index, array) => {
                if(element.isContext(context))
                {
                    this.eventList.splice(index, 1);
                }
            });
        }

        public RemoveAll () {
            if(this.eventList == null || this.eventList.length <= 0) {
                return;
            }

            this.eventList = new Array<Observer>();
        }

    }
}