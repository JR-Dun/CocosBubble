
import { BaseHttpAdapter } from "./BaseHttpAdapter";
import { BaseProtobufAdapter } from "./BaseProtobufAdapter";
import { BaseWebAssemblyAdapter } from "./BaseWebAssemblyAdapter";




export class AdapterFactory {

    private static protobufAdapter: BaseProtobufAdapter;
    private static httpAdapter: BaseHttpAdapter;
    private static webAssemblyAdapter : BaseWebAssemblyAdapter;


    public static setProtobufAdapter(adapter: BaseProtobufAdapter) {
        this.protobufAdapter = adapter;
    }

    public static setHttpAdapter(adapter: BaseHttpAdapter) {
        this.httpAdapter = adapter;
    }

    public static setWebAssemblyAdapter(adapter: BaseWebAssemblyAdapter) {
        this.webAssemblyAdapter = adapter;
    }

    public static getProtobufAdapter(): BaseProtobufAdapter {

        return this.protobufAdapter;
    }

    public static getHttpAdapter(): BaseHttpAdapter {

        return this.httpAdapter;
    }

    public static getWebAssemblyAdapter(): BaseWebAssemblyAdapter{
        return this.webAssemblyAdapter;
    }
}
