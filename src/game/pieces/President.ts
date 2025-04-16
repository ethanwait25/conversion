import { Board } from "../Board.js";
import { Move } from "../Move.js";
import { Piece } from "../Piece.js"
import { Position } from "../Position.js";
import { Color } from "../enums/Color.js"
import { PieceType } from "../enums/PieceType.js"

export class President extends Piece {
    public constructor(color: Color) {
        super(color, PieceType.PRESIDENT);
    }

    public getMoves(board: Board, pos: Position): Move[] {
        var moves: Move [] = [];
        this.addCardinals(moves, board, pos);
        this.addDiagonals(moves, board, pos);
        return moves;
    }
}