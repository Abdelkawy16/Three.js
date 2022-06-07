import { Vector2 } from "three"
import { Line } from "./Line"

export class Polyline {
    StartPt: Vector2
    EndPt: Vector2
    AllPoints: Vector2[] = []
    Slices: Line[] = []
    constructor(startPt: Vector2, endPt: Vector2) {
        this.StartPt = startPt
        this.EndPt = endPt
        this.AllPoints.push(startPt)
    }
    addPoint(pt: Vector2) {
        this.AllPoints.push(pt)
    }
    addSlice(slice:Line){
        this.Slices.push(slice)
    }
    changeEndPoint(endPt: Vector2): void {
        this.EndPt = endPt
    }
    getPoints(): Vector2[] {
        return this.AllPoints
    }
}