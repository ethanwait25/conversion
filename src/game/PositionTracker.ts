import { Color } from "./enums/Color.js"
import { Position } from "./Position.js"

export class PositionTracker {
    private presTracker: {[C in Color]: Position | null};
    private distLeaderTracker: {[C in Color]: Position | null};
    private missionaryTracker: {[C in Color]: Set<Position> | null};

    public constructor() {
        this.presTracker = {
            [Color.WHITE]: null,
            [Color.BLACK]: null
        }

        this.distLeaderTracker = {
            [Color.WHITE]: null,
            [Color.BLACK]: null
        }

        this.missionaryTracker = {
            [Color.WHITE]: new Set(),
            [Color.BLACK]: new Set()
        }
    }

    public setPresPos(color: Color, pos: Position | null) {
        this.presTracker[color] = pos;
    }

    public getPresPos(color: Color): Position | null {
        return this.presTracker[color];
    }

    public setDLPos(color: Color, pos: Position | null) {
        this.distLeaderTracker[color] = pos;
    }

    public getDLPos(color: Color): Position | null {
        return this.distLeaderTracker[color];
    }

    public addMissionaryPos(color: Color, pos: Position | null) {
        if (pos) {
            this.missionaryTracker[color]?.add(pos);
        }
    }

    public removeMissionaryPos(color: Color, pos: Position) {
        this.missionaryTracker[color]?.delete(pos);
    }

    public getMissionaryPos(color: Color): Set<Position> | null {
        return this.missionaryTracker[color];
    }
}