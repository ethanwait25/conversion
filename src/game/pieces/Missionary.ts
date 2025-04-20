import { Move } from "../Move.js";
import type { Board } from "../Board.js";
import { Color } from "../enums/Color.js";
import { PieceType } from "../enums/PieceType.js";
import { Piece } from "../Piece.js"
import { Position } from "../Position.js";

export class Missionary extends Piece {
    public constructor(color: Color) {
        super(color, PieceType.MISSIONARY);
    }

    public getMoves(board: Board, pos: Position): Move[] {
        var moves: Move[] = [];
        var curRow = pos.row;
        var curCol = pos.col;
        
        const directions = [
            [-1, -1],
            [-1,  0],
            [-1,  1],
            [ 0, -1],
            [ 0,  1],
            [ 1, -1],
            [ 1,  0],
            [ 1,  1]
        ];
        
        for (const [dRow, dCol] of directions) {
            const newRow = curRow + dRow;
            const newCol = curCol + dCol;
            if (this.isInBounds(newRow) && this.isInBounds(newCol)) {
                const newPos = new Position(newRow, newCol);
                const targetPiece = board.getPiece(newPos);
                if ((targetPiece == null || this.isEnemyPiece(targetPiece)) && this.isConnectedToTeam(newPos, pos, board)) {
                    moves.push(new Move(pos, newPos));
                }
            }
        }

        return moves;
    }

    private isConnectedToTeam(newPos: Position, curPos: Position, board: Board): boolean {
        const directions = [
            [-1, -1],
            [-1,  0],
            [-1,  1],
            [ 0, -1],
            [ 0,  1],
            [ 1, -1],
            [ 1,  0],
            [ 1,  1]
        ];
        
        for (const [dRow, dCol] of directions) {
            const newRow = newPos.row + dRow;
            const newCol = newPos.col + dCol;

            if (newRow == curPos.row && newCol == curPos.col) {
                continue;
            }

            if (this.isInBounds(newRow) && this.isInBounds(newCol)) {
                const targetPiece = board.getPiece(new Position(newRow, newCol));
                if (targetPiece?.color == this.color) {
                    return true;
                }
            }
        }

        return false;
    }
}