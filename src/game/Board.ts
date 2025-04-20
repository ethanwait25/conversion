import type { Piece } from "./Piece.js"
import { Position } from "./Position.js";
import { Color } from "./enums/Color.js";
import { createPiece } from "./pieces/PieceFactory.js";
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

    public setPiece(pos: Position, piece: Piece | null) {
        this.board[pos.row-1][pos.col-1] = piece;
    }

    private setupBoard() {
        this.setPiece(new Position(1, 1), createPiece(PieceType.ASSISTANT, Color.BLACK));
        this.setPiece(new Position(1, 2), createPiece(PieceType.PRESIDENT, Color.BLACK));
        this.setPiece(new Position(1, 3), createPiece(PieceType.ZL, Color.BLACK));
        this.setPiece(new Position(1, 4), createPiece(PieceType.STL, Color.BLACK));   
        this.setPiece(new Position(1, 5), createPiece(PieceType.DL, Color.BLACK));

        this.setPiece(new Position(2, 2), createPiece(PieceType.MISSIONARY, Color.BLACK));
        this.setPiece(new Position(2, 3), createPiece(PieceType.MISSIONARY, Color.BLACK));
        this.setPiece(new Position(2, 4), createPiece(PieceType.MISSIONARY, Color.BLACK));

        this.setPiece(new Position(4, 2), createPiece(PieceType.MISSIONARY, Color.WHITE));
        this.setPiece(new Position(4, 3), createPiece(PieceType.MISSIONARY, Color.WHITE));
        this.setPiece(new Position(4, 4), createPiece(PieceType.MISSIONARY, Color.WHITE));

        this.setPiece(new Position(5, 1), createPiece(PieceType.DL, Color.WHITE));
        this.setPiece(new Position(5, 2), createPiece(PieceType.STL, Color.WHITE));
        this.setPiece(new Position(5, 3), createPiece(PieceType.ZL, Color.WHITE));
        this.setPiece(new Position(5, 4), createPiece(PieceType.PRESIDENT, Color.WHITE));   
        this.setPiece(new Position(5, 5), createPiece(PieceType.ASSISTANT, Color.WHITE));

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