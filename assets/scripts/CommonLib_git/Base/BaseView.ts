import { BaseViewModel } from "./BaseViewModel";
import { ToastManager } from "../Toast/ToastManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default abstract class BaseView<VM extends BaseViewModel> extends cc.Component {

    _time: number = 0;
    _lastTime: number = 0;
    
    private viewModel:VM;
   
   
    public get ViewModel():VM {

        if(this.viewModel == null){
           
            this.viewModel = this.createViewModel();
            //this.viewModel = this.test<VM>();
            
        }
        

        return this.viewModel;
    }

    onLoad () {
        this.ViewLoad();
        this.ViewModel.init();
    }

    onDestroy(){
        this.ViewModel.destroy();
        this.ViewDestroy();
    }

    protected showToast(msg:string){
       // alert(msg);
       ToastManager.show(msg);
    }


    protected abstract createViewModel() : VM;

    protected abstract ViewLoad();

    protected abstract ViewDestroy();
   
}
