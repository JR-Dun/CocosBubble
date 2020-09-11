import { BindableProperty } from "../DataBinding/BindableProperty";

export  abstract class BaseViewModel  {

    errorCode:BindableProperty<number> = new BindableProperty<number>();

    public abstract init();

    public abstract destroy();

    
}
