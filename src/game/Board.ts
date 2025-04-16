import { Piece } from "./Piece.js"
import { Position } from "./Position.js";
import { Color } from "./enums/Color.js";
import { President } from "./pieces/President.js"
import { Assistant } from "./pieces/Assistant.js"
import { ZL } from "./pieces/ZL.js"
import { DL } from "./pieces/DL.js"
import { STL } from "./pieces/STL.js"
import { Missionary } from "./pieces/Missionary.js"
import { PositionTracker } from "./PositionTracker.js";
import { PieceType } from "./enums/PieceType.js";

export class Board {
    public board: Piece[][] | null[][];
    private positionTracker: PositionTracker;

    public constructor() {
        this.positionTracker = new PositionTracker();

        this.board = [];
        this.clearBoard();
        this.setupBoard();
    }

    public getPiece(pos: Position): Piece | null {
        return this.board[pos.row-1][pos.col-1];
    }

    private addPiece(pos: Position, piece: Piece) {
        this.board[pos.row-1][pos.col-1] = piece;
    }

    private setupBoard() {
        this.addPiece(new Position(1, 1), new Assistant(Color.BLACK));
        this.addPiece(new Position(1, 2), new President(Color.BLACK));
        this.addPiece(new Position(1, 3), new ZL(Color.BLACK));
        this.addPiece(new Position(1, 4), new STL(Color.BLACK));   
        this.addPiece(new Position(1, 5), new DL(Color.BLACK));

        this.addPiece(new Position(2, 2), new Missionary(Color.BLACK));
        this.addPiece(new Position(2, 3), new Missionary(Color.BLACK));
        this.addPiece(new Position(2, 4), new Missionary(Color.BLACK));

        this.addPiece(new Position(4, 2), new Missionary(Color.WHITE));
        this.addPiece(new Position(4, 3), new Missionary(Color.WHITE));
        this.addPiece(new Position(4, 4), new Missionary(Color.WHITE));

        this.addPiece(new Position(5, 1), new DL(Color.WHITE));
        this.addPiece(new Position(5, 2), new STL(Color.WHITE));
        this.addPiece(new Position(5, 3), new ZL(Color.WHITE));
        this.addPiece(new Position(5, 4), new President(Color.WHITE));   
        this.addPiece(new Position(5, 5), new Assistant(Color.WHITE));

        this.addDefaultTrackedPositions();
    }

    private addDefaultTrackedPositions() {
        this.positionTracker.setPresPos(Color.WHITE, new Position(5, 4));
        this.positionTracker.setPresPos(Color.BLACK, new Position(1, 2));

        this.positionTracker.setDLPos(Color.WHITE, new Position(5, 1));
        this.positionTracker.setDLPos(Color.BLACK, new Position(1, 5));

        this.positionTracker.addMissionaryPos(Color.WHITE, new Position(4, 2));
        this.positionTracker.addMissionaryPos(Color.WHITE, new Position(4, 3));
        this.positionTracker.addMissionaryPos(Color.WHITE, new Position(4, 4));
        this.positionTracker.addMissionaryPos(Color.BLACK, new Position(2, 2));
        this.positionTracker.addMissionaryPos(Color.BLACK, new Position(2, 3));
        this.positionTracker.addMissionaryPos(Color.BLACK, new Position(2, 4));
    }

    private clearBoard() {
        this.board = Array.from({ length: 8 }, () => Array(8).fill(null));
    }

    public setTrackedPiece(color: Color, pieceType: PieceType, pos: Position | null) {
        if (pieceType == PieceType.PRESIDENT) {
            return this.positionTracker.setPresPos(color, pos);
        } else if (pieceType == PieceType.DL) {
            return this.positionTracker.setDLPos(color, pos);
        } else if (pieceType == PieceType.MISSIONARY) {
            return this.positionTracker.addMissionaryPos(color, pos);
        } else {
            return null;
        }
    }

    public getTrackedPiece(color: Color, pieceType: PieceType): Position | null {
        if (pieceType == PieceType.PRESIDENT) {
            return this.positionTracker.getPresPos(color);
        } else if (pieceType == PieceType.DL) {
            return this.positionTracker.getDLPos(color);
        } else {
            return null;
        }
    }

    public getTrackedMissionaries(color: Color): Set<Position> | null {
        return this.positionTracker.getMissionaryPos(color);
    }

    public removeTrackedMissionary(color: Color, pos: Position) {
        this.positionTracker.removeMissionaryPos(color, pos);
    }
}