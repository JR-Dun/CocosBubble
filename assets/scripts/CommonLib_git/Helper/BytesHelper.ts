export class BytesHelper {

    public static intToBytes(value) {
        let result = new Uint8Array(4);
        result[0] = (value >> 24) & 0xFF;
        result[1] = (value >> 16) & 0xFF;
        result[2] = (value >> 8) & 0xFF;
        result[3] = value & 0xFF;
        return result;
    }

    public static bytesToInt(dataArray: Uint8Array): number
    {
        let result = 0;
        result = ((dataArray[0] & 0xFF) << 24 |
                (dataArray[1] & 0xFF) << 16 |
                (dataArray[2] & 0xFF) << 8 |
                (dataArray[3] & 0xFF));
        return result;
    }

}
