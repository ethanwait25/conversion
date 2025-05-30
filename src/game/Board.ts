import type { Piece } from "./Piece.js"
import { Position } from "./Position.js";
import { Color } from "./enums/Color.js";
import { createPiece } from "./pieces/PieceFactory.js";
import { PositionTracker } from "./PositionTracker.js";
import { PieceType } from "./enums/PieceType.js";
import { Move } from "./Move.js";

export class Board {
    public board: (Piece | null)[][];
    private positionTracker: PositionTracker;

    public constructor(board?: (Piece | null)[][], tracker?: PositionTracker) {
        this.positionTracker = tracker ?? new PositionTracker();
        this.board = board ?? [];

        if (!board) {
            this.clearBoard();
            this.addDefaultTrackedPositions();
            this.setupBoard();
        }
    }

    public getPiece(pos: Position): Piece | null {
        return this.board[pos.row-1][pos.col-1];
    }

    public setPiece(pos: Position, piece: Piece | null) {
        this.board[pos.row-1][pos.col-1] = piece;
    }

    public getAllMovesForColor(color: Color): Move[] {
        const moves: Move[] = []
        for (let row = 1; row <= 5; ++row) {
            for (let col = 1; col <= 5; ++col) {
                const pos = new Position(row, col);
                const piece = this.getPiece(pos);

                if (piece && piece.color == color) {
                    const pieceMoves = piece.getMoves(this, pos);
                    moves.push(...pieceMoves);
                }
            }
        }

        return moves;
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
            this.positionTracker.setPresPos(color, pos);
        } else if (pieceType == PieceType.DL) {
            this.positionTracker.setDLPos(color, pos);
        } else if (pieceType == PieceType.MISSIONARY) {
            this.positionTracker.addMissionaryPos(color, pos);
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

    public getHash(): string {
        return this.board.flat().map(piece =>
          piece ? `${piece.color[0]}-${piece.pieceType[0]}` : '0'
        ).join('');
    }

    public clone(): Board {
        const board: (Piece | null)[][] = this.board.map(row =>
          row.map((piece) => piece ? createPiece(piece.pieceType, piece.color) : null)
        );
        const newBoard = new Board(board, this.positionTracker.clone());
        return newBoard;
    }
}