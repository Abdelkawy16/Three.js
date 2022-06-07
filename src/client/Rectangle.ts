import { Vector2 } from "three"
import { Line } from "./Line"

export class Rectangle {
    StartPt: Vector2
    EndPt: Vector2
    Slices: Line[] = []
    Points: Vector2[] = []
    constructor(startPt: Vector2) {
        this.StartPt = startPt
        this.EndPt = startPt
    }
    updateSlices(endPt: Vector2): void {
        this.EndPt = endPt
        const firstSlice = new Line(this.StartPt, new Vector2(this.EndPt.x, this.StartPt.y))
        const firstShortSlice = new Line(this.StartPt, new Vector2(this.StartPt.x, this.EndPt.y))
        const secondSlice = new Line(this.EndPt, new Vector2(this.StartPt.x, this.EndPt.y))
        const secondShortSlice = new Line(this.EndPt, new Vector2(this.EndPt.x, this.StartPt.y))
        this.Slices = [firstSlice, firstShortSlice, secondSlice, secondShortSlice]
        this.Points = [this.StartPt, firstSlice.EndPt, this.EndPt, secondSlice.EndPt, this.StartPt]
    }
}