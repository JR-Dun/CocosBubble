
export class SkinManager {

    private static skin:string = "";

    public static init(skin:string){
        this.skin = skin;
    }

    public static switchPrefabName(name: string, isSameWithSkin: boolean = true, isSameWithDirect: boolean = true): string {
        let result = name;
        let skin = this.skin;
        if(!isSameWithSkin)
        {
            result = name + skin;
            if(isSameWithDirect)
            {
                result = result.replace("_V", "");
            }
        }
        return result;
    }

    public static switchSceneName(name: string): string {
        return name + this.skin;
    }
    
    public static isVertical(): boolean {
        return (this.skin.indexOf("_V") >= 0);
    }
    
}
