import { Move } from "../Move.js";
import type { Board } from "../Board.js";
import { Color } from "../enums/Color.js";
import { PieceType } from "../enums/PieceType.js";
import { Piece } from "../Piece.js"
import { Position } from "../Position.js";

export class ZL extends Piece {
    public constructor(color: Color) {
        super(color, PieceType.ZL);
    }

    public getMoves(board: Board, pos: Position): Move[] {
        var moves: Move[] = [];
        this.addCardinals(moves, board, pos);

        var distLeaderPos = board.getTrackedPiece(this.color, PieceType.DL);
        if (distLeaderPos) {
            moves.push(new Move(pos, distLeaderPos));
        }
        
        return moves;
    }
}