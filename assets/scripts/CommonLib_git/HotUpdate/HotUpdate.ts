const hotResDir = "AllGame/Hall"; //更新的资源目�?

export class HotUpdate {

    private static am;
    private static isUpdating = false;
    private static manifestUrl;

    private static checkNewVersionListener: Function;
    private static updateProgressListener: Function;
    private static updateErrorListener: Function;
    private static updateFinishListener: Function;

    public static init(manifestUrl: cc.Asset) {

        if (!cc.sys.isNative) return;

        this.manifestUrl = manifestUrl;
        let storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + hotResDir);
        this.am = new jsb.AssetsManager("", storagePath, this.versionCompareHandle);

    
        this.am.setVerifyCallback(function (path, asset) {

            var compressed = asset.compressed;
            var expectedMD5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            if (compressed) {
                cc.log("Verification passed : " + relativePath);
                return true;
            }
            else {
                cc.log("Verification passed : " + relativePath + ' (' + expectedMD5 + ')');
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this.am.setMaxConcurrentTask(2);
            cc.log("Max concurrent tasks count have been limited to 2");
        }
    }

    //版本对比
    private static versionCompareHandle(versionA, versionB): number {

        var vA = versionA.split('.');
        var vB = versionB.split('.');
        for (var i = 0; i < vA.length; ++i) {
            var a = parseInt(vA[i]);
            var b = parseInt(vB[i] || 0);
            if (a === b) {
                continue;
            }
            else {
                return a - b;
            }
        }
        if (vB.length > vA.length) {
            return -1;
        }
        else {
            return 0;
        }

    }

    public static checkUpdate(checkNewVersionCallback?:Function) {

        if (this.isUpdating) {
            cc.log("正在更新�?...");
            return;
        }

        this.checkNewVersionListener = checkNewVersionCallback;

        if (this.am.getState() === jsb.AssetsManager.State.UNINITED) {
            var url = this.manifestUrl;
            cc.log(url);
            if (cc.loader.md5Pipe) {
                url = cc.loader.md5Pipe.transformURL(url);
            }
            this.am.loadLocalManifest(url);
        }

        if (!this.am.getLocalManifest() || !this.am.getLocalManifest().isLoaded()) {
            cc.log('Failed to load local manifest ...');
            return;
        }
        this.am.setEventCallback(this.checkCallback.bind(this));

        this.am.checkUpdate();
        this.isUpdating = true;
    }

    private static checkCallback(event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                cc.log('New version found, please try to update.');
                if (this.checkNewVersionListener) {
                    this.checkNewVersionListener();
                }
                break;
            default:
                return;
        }
        this.am.setEventCallback(null);
        this.isUpdating = false;
    }

    public static update(updateProgressListener?:Function,updateErrorListener?:Function,updateFinishListener?:Function) {

        if (this.am && !this.isUpdating) {

            this.updateProgressListener = updateProgressListener;
            this.updateErrorListener = updateErrorListener;
            this.updateFinishListener = updateFinishListener;

            this.am.setEventCallback(this.updateCallback.bind(this));

            if (this.am.getState() === jsb.AssetsManager.State.UNINITED) {
                // Resolve md5 url
                var url = this.manifestUrl;
                if (cc.loader.md5Pipe) {
                    url = cc.loader.md5Pipe.transformURL(url);
                }
                this.am.loadLocalManifest(url);
            }

            this.am.update();
            this.isUpdating = true;
        }
    }


    private static updateCallback(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
              
                if(this.updateProgressListener){
                    this.updateProgressListener(event.getPercentByFile());
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('Fail to download manifest file, hot update skipped.');
                if(this.updateErrorListener){
                    this.updateFinishListener('Fail to download manifest file, hot update skipped.');
                }
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('Update finished. ' + event.getMessage());
                needRestart = true;
                if(this.updateFinishListener){
                    this.updateFinishListener();
                }
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('Update failed. ' + event.getMessage());
                if(this.updateErrorListener){
                    this.updateErrorListener('Update failed. ' + event.getMessage());
                }
                this.isUpdating = false;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                if(this.updateErrorListener){
                    this.updateErrorListener('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                }
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this.am.setEventCallback(null);
            this.isUpdating = false;
        }

        if (needRestart) {
            this.am.setEventCallback(null);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this.am.getLocalManifest().getSearchPaths();
            cc.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
     
        }
    }
}