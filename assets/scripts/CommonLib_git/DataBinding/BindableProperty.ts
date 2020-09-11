

// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html


export  class BindableProperty<T>  {

    private t:T;
    private onValueChange:Function;
 

    constructor(t?:T){
      this.value = t;
    
    }

    public set ValueChangedHandler(onValueChange:Function){
        this.onValueChange = onValueChange;
       
    }


   public set value(newValue : T) {
      
       this.t = newValue;

       if(this.onValueChange != undefined){            
        this.onValueChange(newValue);
    }
   }

   public get value() : T {
       return this.t;
   }
   
   


   
}
