import { Bezier } from "./Bezier";
import BezierPoint from "./BezierPoint";

export class BezierAction extends cc.ActionInterval {
	_startPosition;
	_endPosition;

	_bezier:Bezier;
	lastPosition:cc.Vec2;

	
    public static create(speed, positions:BezierPoint[]): BezierAction {
		let fishBezierAction = new BezierAction();
		fishBezierAction.initWithSpeed(speed, positions[0].getV2(), positions[positions.length - 1].getV2(), ...positions);
		fishBezierAction.getDuration()
		return fishBezierAction;
    }
	

 
    public initWithSpeed(speed, startPosition, endPosition, ...positions:BezierPoint[]):boolean
    {
		cc.ActionInterval.prototype['initWithDuration'].apply(this,arguments);
		this._startPosition = startPosition;
		this._endPosition = endPosition;
		this._bezier = new Bezier(positions.length, ...positions);
		
		this.setDuration(this.getLength() / speed);
		this.repeatForever();

        return true;
    }

 
    public update(time:number):void
    {
		if(this.getTarget())
		{
			var currentPosition = this._bezier.getPoint(time)
			this.getTarget().setPosition(currentPosition);

			if(this.lastPosition)
			{
				this.getTarget().angle = -this.getRotation(currentPosition);
			}

			this.lastPosition = currentPosition;
		}
	}


    private getLength() {
        return this._bezier.getLength();
	}

	private getRotation(currentPosition) {
		if(currentPosition == this.lastPosition) return;

		// 计算角度
		let degree;
		if (currentPosition.x - this.lastPosition.x == 0) {
			// 垂直
			if (currentPosition.y - this.lastPosition.y > 0) {
				degree = 0;
			} else {
				degree = 180;
			}
		} else {
			degree = - Math.atan((currentPosition.y - this.lastPosition.y) / (currentPosition.x - this.lastPosition.x)) * 180 / 3.14;

			if(currentPosition.x - this.lastPosition.x > 0)
			{
				degree += 90;
			}
			else
			{
				degree -= 90;
			}
		}

		return degree;
	}
}