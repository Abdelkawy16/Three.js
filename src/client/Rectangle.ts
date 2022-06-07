import { Vector2 } from "three"
import { Line } from "./Line"

export class Rectangle {
    StartPt: Vector2
    EndPt: Vector2 = new Vector2()
    Slices: Line[] = []
    constructor(startPt: Vector2) {
        this.StartPt = startPt
    }
    updateEndPt(endPt: Vector2): void {
        this.EndPt = endPt
    }
}