import { Move } from "../Move.js";
import type { Board } from "../Board.js";
import { Color } from "../enums/Color.js";
import { PieceType } from "../enums/PieceType.js";
import { Piece } from "../Piece.js";
import { Position } from "../Position.js";

export class STL extends Piece {
    public constructor(color: Color) {
        super(color, PieceType.STL);
    }

    public getMoves(board: Board, pos: Position): Move[] {
        var moves: Move[] = [];
        this.addCardinals(moves, board, pos);
        
        var missionariesPos: Set<Position> | null = board.getTrackedMissionaries(this.color);
        missionariesPos?.forEach(mPos => {
            moves.push(new Move(pos, mPos));
        });

        return moves;
    }
}