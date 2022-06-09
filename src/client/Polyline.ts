import { Vector2 } from "three"
import { Line } from "./Line"

export class Polyline {
    StartPt: Vector2
    EndPt: Vector2
    Points: Vector2[] = []
    Slices: Line[] = []
    constructor(startPt: Vector2, endPt: Vector2) {
        this.StartPt = startPt
        this.EndPt = endPt
        this.Points.push(startPt)
        this.Points.push(endPt)
    }
    addPoint(pt: Vector2) {
        this.Points.push(pt)
    }
    updateLastPoint(pt: Vector2){
        this.Points[this.Points.length - 1] = pt
    }
    addSlice(slice:Line): void{
        this.Slices.push(slice)
    }
    changeEndPoint(endPt: Vector2): void {
        this.EndPt = endPt
    }
    getpoints(): Vector2[]{
        return this.Points/*.concat([this.Points[0]]);*/
    }
}