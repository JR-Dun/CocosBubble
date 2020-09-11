const MUSIC_VOLUME = "music_volume";
const SOUND_VOLUME = "sound_volume";

export  class AudioManager {

    private static audioClips:{[key:string]:cc.AudioClip} = {}
    private static currentMusicName: string = "";
    
    public static canPlayMusic: boolean = true;
    public static canPlayEffect: boolean = true;

    public static initRes(url:string,callback?:Function){
        cc.loader.loadResDir(url,cc.AudioClip,(error: Error, resource: cc.AudioClip[], urls: string[])=>{
            
            if(error){
                cc.log("loadAudioResError:"+error.message);
                return;
            }

            resource.forEach(audio => {
               // console.log(audio.name);
                this.audioClips[audio.name] = audio;
            });
           
            if(callback){
                callback();
            }
        });
    }

    public static playMusic(audioName:string) {
        if(!this.canPlayMusic) return;
        let musicVolum = cc.sys.localStorage.getItem(MUSIC_VOLUME);
       

        this.currentMusicName = audioName;
        let clip = this.audioClips[audioName];
        let id =  cc.audioEngine.playMusic(clip, true);
        if(musicVolum) cc.audioEngine.setVolume(id,musicVolum);
    }

    public static stopMusic() {  
        //this.canPlayMusic = false;
        cc.audioEngine.stopMusic();
    }


    public static setMusicVolume(volume:number) {
        cc.audioEngine.setMusicVolume(volume);
        cc.sys.localStorage.setItem(MUSIC_VOLUME, volume);
    }

    public static getMusicVolume():number{
        let musicVolum = cc.sys.localStorage.getItem(MUSIC_VOLUME);
        return musicVolum ? musicVolum : 1;
    }

    public static playEffect(audioName:string) {
        if(!this.canPlayEffect) return;

        let soundVolum = cc.sys.localStorage.getItem(SOUND_VOLUME);
     
        let clips = this.audioClips[audioName];      
        let id = cc.audioEngine.playEffect(clips,false);
        if(soundVolum) cc.audioEngine.setVolume(id,soundVolum);
    }

   

    public static setEffectVolume(volume:number) {
        cc.audioEngine.setEffectsVolume(volume);
        cc.sys.localStorage.setItem(SOUND_VOLUME, volume);
    }

    public static getEffectVolume():number{
        let soundVolum = cc.sys.localStorage.getItem(SOUND_VOLUME);
        return soundVolum ? soundVolum : 1;
    }



    public static startMusic() {  
        this.canPlayMusic = true;
        this.playMusic(this.currentMusicName);
    }

    public static openEffect()
    {
        this.canPlayEffect = true;
    }

    public static closeEffect()
    {
        this.canPlayEffect = false;
    }
}
