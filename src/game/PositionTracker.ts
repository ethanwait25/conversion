import { Color } from "./enums/Color.js"
import { Position } from "./Position.js"

export class PositionTracker {
    private presTracker: {[C in Color]: Position | null};
    private distLeaderTracker: {[C in Color]: Position | null};
    private missionaryTracker: {[C in Color]: Set<string> | null};

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
            this.missionaryTracker[color]?.add(pos.toString());
        }
    }

    public removeMissionaryPos(color: Color, pos: Position) {
        this.missionaryTracker[color]?.delete(pos.toString());
    }

    public getMissionaryPos(color: Color): Set<Position> | null {
        const strSet = this.missionaryTracker[color];
        if (!strSet) return null;

        const posSet = new Set<Position>();
        for (const posString of strSet) {
            posSet.add(Position.fromString(posString));
        }
        
        return posSet;
    }
}