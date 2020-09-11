
export class PointHelper {

    public static rotate(x, y, angle): Point {
        let radian = Math.PI / 180 * angle;
        let xNew = x * Math.cos(radian) - y * Math.sin(radian);
        let yNew = x * Math.sin(radian) + y * Math.cos(radian);

        return new Point(~~xNew, ~~yNew);
    }

    public static distance(x1,y1,x2,y2): number {
        let dx:number = x2 - x1;
        let dy:number = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy); 
    }
}

export class Point {
    x:number = 0;
    y:number = 0;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}
