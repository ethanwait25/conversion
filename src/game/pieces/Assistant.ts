import { Move } from "../Move.js";
import type { Board } from "../Board.js";
import { Color } from "../enums/Color.js";
import { PieceType } from "../enums/PieceType.js";
import { Piece } from "../Piece.js"
import { Position } from "../Position.js";

export class Assistant extends Piece {
    public constructor(color: Color) {
        super(color, PieceType.ASSISTANT);
    }
    
    public getMoves(board: Board, pos: Position): Move[] {
        var moves: Move[] = [];
        const presPos = board.getTrackedPiece(this.color, PieceType.PRESIDENT);

        if (presPos != null) {
            var curRow = presPos.row;
            var curCol = presPos.col;
            
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
                    if (targetPiece == null || this.isEnemyPiece(targetPiece)) {
                        moves.push(new Move(pos, newPos));
                    }
                }
            }
        }

        return moves;
    }
}