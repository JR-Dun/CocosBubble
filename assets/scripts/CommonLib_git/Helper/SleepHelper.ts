
export class SleepHelper {

    static async sleep(ms = 0) {
        return new Promise(r => setTimeout(r, ms));
    }

}
