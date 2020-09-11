

export interface OnResourceLoadComplete {
    (result:boolean, node:cc.Node): void;
}

export interface OnResourceLoadGroupComplete {
    (result:boolean, nodeArray:Array<cc.Node>): void;
}

export class PoolManager {
    
    static poolDict: { [key: string]: cc.NodePool} = { };
    static prefabDict: { [key: string]: cc.Prefab} = { };

    public static Get(type:string, name:string, completed:OnResourceLoadComplete): void {
        this.GetPoolAsync(type, name, completed);
    }

    public static GetGroup(type:string, name:string, num: number, completed:OnResourceLoadGroupComplete): void {
        let nodeCount = 0;
        let nodeArray = [];
        
        for(let i = 0; i < num; i++)
        {
            this.GetPoolAsync(type, name, (result:boolean, node:cc.Node) => {
                nodeCount++;

                if(result)
                {
                    nodeArray.push(node);
                }

                if(nodeCount == num)
                {
                    completed(nodeArray.length == num, nodeArray);
                }
            });
        }
    }

    public static Put(type:string, name:string, node: cc.Node) {
        if(this.IsExistPool(type, name))
        {   
            this.GetPool(type, name).put(node);
        }
    }

    public static clean() {
        if(this.poolDict != null) {
            for(let t in this.poolDict) {
                let nodePool = this.poolDict[t];
                nodePool.clear();
            }
        }

        this.poolDict = {};
        this.prefabDict = {};
    }

    private static IsExistPool(type:string, name:string): boolean { 
        let key = this.GetPoolKey(type, name);
        if(this.poolDict != null) {
            for(let t in this.poolDict) {
                if(t == key) {
                    return true;
                }
            }
        }

        return false;
    }

    private static GetPoolKey(type:string, name:string): string { 
        let result = "Prefabs/" + type.toString();
        if(name != null)
        {
            result = result + "/" + name;
        }

        return result;
    }

    private static GetPool(type:string, name:string): cc.NodePool {
        let key = this.GetPoolKey(type, name);
        
        let pool;
        if(this.poolDict != null) {
            for(let t in this.poolDict) {
                if(t == key) {
                    pool = this.poolDict[t];
                    return pool;
                }
            }
        }

        return null;
    }

    private static GetPoolAsync(type:string, name:string, completed:OnResourceLoadComplete)
    {
        let key = this.GetPoolKey(type, name);

        let pool = this.GetPool(type, name);
        if(pool == null)
        {
            pool = new cc.NodePool();
            this.poolDict[key] = pool;
        }

        if(pool.size() > 0)
        {
            // console.log("有空闲的对象, key = " + key);
            completed(true, pool.get());
        }
        else
        {
            if(this.prefabDict[key] == null)
            {
                // console.log("没有有空闲的对象，未加载，key = " + key + "，cc.instantiate");
                cc.loader.loadRes(key, function(err, resource) {
                    this.loadResCallback(key, err, resource, function(result, node) {
                        if(result)
                        {
                            completed(result, node);
                        }
                        else
                        {
                            completed(result, null);
                        }
                    }.bind(this));
                }.bind(this));
            }
            else
            {
                // console.log("没有有空闲的对象，已加载，key = " + key + "，cc.instantiate");
                let node = cc.instantiate(this.prefabDict[key]);
                completed(true, node);
            }
        }

    }

    private static loadResCallback(key, errorMessage, loadedResource, completed:OnResourceLoadComplete) {
        if (errorMessage) {
            cc.log('载入预制资源失败, 原因:' + errorMessage);
            completed(false, null);
            return;
        }

        if (!(loadedResource instanceof cc.Prefab))
        {
            cc.log('你载入的不是预制资源!');
            completed(false, null);
            return;
        }

        this.prefabDict[key] = loadedResource;

        let node = cc.instantiate(this.prefabDict[key]);
        completed(true, node);
    }
}