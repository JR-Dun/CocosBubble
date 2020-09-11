

export  class SubgameManager  {

    private static serverUrl;
    private static storagePath:[] = [];


    private static assertsMg;
    private static failCount = 0;

    private static subgameUpdateCallback;
    private static progressCallback;
    private static finishCallback;

    public static init(serverUrl:string){
        this.serverUrl = serverUrl;
    }

    public static isSubgameDownload(name:string):boolean{

        let file = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'AllGame/' + name + '/project.manifest';
        if (jsb.fileUtils.isFileExist(file)) {
            return true;
        } else {
            return false;
        }
    }

    public static isNeedUpdateSubgame(name:string,subgameUpdateCallback?:Function){
        this.prepareJsb(name);
        this.subgameUpdateCallback = subgameUpdateCallback;
        this.assertsMg.setEventCallback(this.needUpdateCallback.bind(this));
        this.assertsMg.checkUpdate();
    }

    private static needUpdateCallback(event){
        let self = this;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('子游戏已经是最新的，不需要更新');
                self.subgameUpdateCallback && self.subgameUpdateCallback(false);
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('子游戏需要更新');
                self.subgameUpdateCallback && self.subgameUpdateCallback(true);
                break;

            // 检查是否更新出错
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
            case jsb.EventAssetsManager.ERROR_UPDATING:
            case jsb.EventAssetsManager.UPDATE_FAILED:
                self.subgameUpdateCallback && self.subgameUpdateCallback(false);
                break;
        }
    }

    public static downloadSubgame(name:string,progressCallback?:Function,finishCallback?:Function){
        this.prepareJsb(name);
        this.progressCallback = progressCallback;
        this.finishCallback = finishCallback;
        this.assertsMg.setEventCallback(this.downloadCallback.bind(this));
        this.assertsMg.update();
    }

    private static downloadCallback(event) {
        var failed = false;
        let self = this;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                /*0 本地没有配置文件*/
                console.log('updateCb本地没有配置文件');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                /*1下载配置文件错误*/
                console.log('updateCb下载配置文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                /*2 解析文件错误*/
                console.log('updateCb解析文件错误');
                failed = true;
                break;

            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                /*3发现新的更新*/
                console.log('updateCb发现新的更新');
              
                break;

            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                /*4 已经是最新的*/
                console.log('updateCb已经是最新的');
                failed = true;
                break;

            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                /*5 最新进展 */
                console.log("event.getPercentByFile()"+event.getPercentByFile());
                self.progressCallback && self.progressCallback(event.getPercentByFile());
                break;


            case jsb.EventAssetsManager.ASSET_UPDATED:
                /*6需要更新*/
                break;

            case jsb.EventAssetsManager.ERROR_UPDATING:
                /*7更新错误*/
                console.log('updateCb更新错误');
                break;

            case jsb.EventAssetsManager.UPDATE_FINISHED:
                /*8更新完成*/
                console.log("UPDATE_FINISHED");
                self.finishCallback && self.finishCallback(true);
                break;

            case jsb.EventAssetsManager.UPDATE_FAILED:
                /*9更新失败*/
                console.log('UPDATE_FAILED');
                self.failCount++;
                if (self.failCount <= 3) {
                    self.assertsMg.downloadFailedAssets();
                    console.log(('updateCb更新失败' + this.failCount + ' 次'));
                } else {
                    console.log(('updateCb失败次数过多'));
                    self.failCount = 0;
                    failed = true;
                   
                }
              
                
                break;

            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                /*10解压失败*/
                console.log('解压失败');
                break;
        }

        if (failed) {
            self.failCount = 0;
         
            this.assertsMg.setEventCallback(null);
            self.finishCallback && self.finishCallback(false);
        }
    }

    public static enterSubgame(name) {
        let subgameSearchPath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/')+'AllGame/'+name+'/src/main.js';
        console.log(subgameSearchPath);
        window.require(subgameSearchPath);
    }


    private static prepareJsb(name:string){
        this.storagePath[name] = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'AllGame/' + name);
      
        var UIRLFILE = this.serverUrl +"/"+ name;
        console.log("UIRLFILE:"+UIRLFILE);
        console.log("storagePath:"+this.storagePath[name]);
        var customManifestStr = JSON.stringify({
            'packageUrl': UIRLFILE,
            'remoteManifestUrl': UIRLFILE + '/project.manifest',
            'remoteVersionUrl': UIRLFILE + '/version.manifest',
            'version': '0.0.1',
            'assets': {},
            'searchPaths': []
        });

        this.assertsMg = new jsb.AssetsManager('', this.storagePath[name], this.versionCompare);

    
        this.assertsMg.setVerifyCallback(function(path, asset) {
            var compressed = asset.compressed;
            if (compressed) {
                return true;
            } else {
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this.assertsMg.setMaxConcurrentTask(2);
        }
        if (this.assertsMg.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this.storagePath[name]);
            this.assertsMg.loadLocalManifest(manifest, this.storagePath[name]);
        }

    }

    private static versionCompare(versionA, versionB):number{

        var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
    }
 
}
