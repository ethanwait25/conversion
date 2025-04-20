import { Board } from "./Board.js";
import { Color } from "./enums/Color.js";
import { PieceType } from "./enums/PieceType.js";
import { Move } from "./Move.js";
import type { Piece } from "./Piece.js";
import { Position } from "./Position.js";

export class Game {
    public board: Board;
    public teamTurn: Color;
    public remaining: {[C in Color]: number};
    
    public constructor() {
        this.board = new Board();
        this.teamTurn = Color.WHITE;
        this.remaining = {
            [Color.WHITE]: 8,
            [Color.BLACK]: 8
        }
    }

    public play() {
        while (this.remaining[this.teamTurn] > 0) {
            
        }

    }

    public makeMove(move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;
        const piece = this.board.getPiece(startPos);
        const endPiece = this.board.getPiece(endPos);

        if (piece && endPiece && piece.color == endPiece.color) {
            this.doExchange(piece, endPiece, move);
        } else {
            if (piece) {
                this.doMovement(piece, endPiece, move);
            }
        }
    }

    private doExchange(first: Piece, second: Piece, move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;

        this.board.setPiece(startPos, second);
        this.board.setPiece(endPos, first);

        this.updateIfTrackedPiece(first, endPos, startPos);
        this.updateIfTrackedPiece(second, startPos, endPos);
    }

    private doMovement(piece: Piece, captured: Piece | null, move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;

        this.board.setPiece(startPos, null);
        this.board.setPiece(endPos, piece);

        this.updateIfTrackedPiece(piece!, endPos, startPos);
        if (captured) {
            this.updateIfTrackedPiece(captured, null, endPos);
            this.remaining[captured.color] -= 1;
        }
    }

    private updateIfTrackedPiece(piece: Piece, pos: Position | null, oldPos: Position) {
        if (piece.pieceType == PieceType.PRESIDENT || piece.pieceType == PieceType.DL || piece.pieceType == PieceType.MISSIONARY) {
            this.board.setTrackedPiece(piece.color, piece.pieceType, pos);

            if (piece.pieceType == PieceType.MISSIONARY) {
                console.log("removing missionary at " + oldPos?.row + oldPos?.col);
                this.board.removeTrackedMissionary(piece.color, oldPos);
                console.log(this.board.getTrackedMissionaries(piece.color));
            }
        }

    }

}