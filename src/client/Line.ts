import { Vector2 } from "three"

export class Line {
    StartPt: Vector2
    EndPt: Vector2
    constructor(startPt: Vector2, endPt: Vector2) 
    {
        this.StartPt = startPt
        this.EndPt = endPt
    }
    changeEndPoint(endPt: Vector2):void 
    {
        this.EndPt = endPt
    }
    getPoints(): Vector2[] {
        return new Array(this.StartPt, this.EndPt, this.StartPt)
    }
}