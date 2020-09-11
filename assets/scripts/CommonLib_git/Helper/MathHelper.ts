export class MathHelper {

    public static randomInt(min, max): number
    {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getLucky(): boolean {
        if(this.randomInt(0, 100) > 50)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    public static getProbability(per:any[]): number
    {
        let result = 0;
        if(per && per.length > 0)
        {
            let num = this.randomInt(0, 100);
            for(let i = 0; i < per.length; i++)
            {
                if(num <= per[i])
                {
                    result = i;
                    break;
                }
            }
        }

        return result;
    }

    public static numberFormat(value: number): number {
        let valueString = Math.abs(value).toString();
        if(valueString.indexOf(".") < 0) {
            return value;
        }
        return Number(valueString.match(/^\d+(?:\.\d{0,1})?/)) * (value >= 0 ? 1 : -1);
    }

    public static numberFixed(value: number, count: number): number {
        return Math.round(value * Math.pow(10, count)) / Math.pow(10, count);
    }
}
