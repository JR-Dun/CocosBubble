export enum TimeTypeEnum {
    YY_MM_DD,
    YY_MM_DD_HH_mm_ss,
}


export class TimeHelper {


    public static getCurrentTime(): number {

        return Date.now();

    }

    public static getDateFormat(timeStamp: number, type: TimeTypeEnum = TimeTypeEnum.YY_MM_DD_HH_mm_ss): string {
        let date = new Date(timeStamp);
        let month: string | number = date.getMonth() + 1;
        let day: string | number = date.getDate();
        let hour: string | number = date.getHours();
        let minute: string | number = date.getMinutes();

        let result = "";
        if (month <= 9) {
            month = "0" + month;
        }

        if (day <= 9) {
            day = "0" + day;
        }

        if (hour <= 9) {
            hour = "0" + hour;
        }

        if (minute <= 9) {
            minute = "0" + minute;
        }

        switch (type) {
            case TimeTypeEnum.YY_MM_DD_HH_mm_ss:
                result = date.getFullYear() + "-" + month + "-" + day + " " + hour + ":" + minute;
                break;
            case TimeTypeEnum.YY_MM_DD:
                result = date.getFullYear() + "-" + month + "-" + day;
                break;
        }


        return result;
    }




}
