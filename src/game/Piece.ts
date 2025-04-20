import { Move } from "./Move.js"
import type { Board } from "./Board.js"
import { Position } from "./Position.js"
import { Color } from "./enums/Color.js"
import { PieceType } from "./enums/PieceType.js"

export abstract class Piece {
    public constructor(public color: Color, public pieceType: PieceType) {}

    public abstract getMoves(board: Board, pos: Position): Move[];

    public getColor() {
        return this.color;
    }

    public getPieceType() {
        return this.pieceType;
    }

    protected isInBounds(pos: number) {
        return 1 <= pos && pos <= 5;
    }

    protected isEnemyPiece(piece: Piece | null) {
        return piece != null && piece.color != this.color;
    }

    protected addCardinals(moves: Move[], board: Board, pos: Position) {
        var curRow = pos.row;
        var curCol = pos.col;

        for (var i = 1; this.isInBounds(curRow + i); ++i) {
            const newPos: Position = new Position(curRow + i, curCol);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curRow - i); ++i) {
            const newPos: Position = new Position(curRow - i, curCol);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curCol + i); ++i) {
            const newPos: Position = new Position(curRow, curCol + i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curCol - i); ++i) {
            const newPos: Position = new Position(curRow, curCol - i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        return moves;
    }

    protected addDiagonals(moves: Move[], board: Board, pos: Position) {
        var curRow = pos.row;
        var curCol = pos.col;

        for (var i = 1; this.isInBounds(curRow + i) && this.isInBounds(curCol + i); ++i) {
            const newPos: Position = new Position(curRow + i, curCol + i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curRow - i) && this.isInBounds(curCol - i); ++i) {
            const newPos: Position = new Position(curRow - i, curCol - i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curRow + i) && this.isInBounds(curCol - i); ++i) {
            const newPos: Position = new Position(curRow + i, curCol - i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        for (var i = 1; this.isInBounds(curRow - i) && this.isInBounds(curCol + i); ++i) {
            const newPos: Position = new Position(curRow - i, curCol + i);
            if (board.getPiece(newPos) == null || this.isEnemyPiece(board.getPiece(newPos))) {
                const move: Move = new Move(pos, newPos);
                moves.push(move);
                if (this.isEnemyPiece(board.getPiece(newPos)))
                    break;
            } else break;
        }

        return moves;
    }
}