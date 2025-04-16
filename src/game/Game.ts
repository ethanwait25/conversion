import { Board } from "./Board.js";
import { Position } from "./Position.js";

export class Game {
    public board: Board;
    
    public constructor() {
        this.board = new Board();
    }
}

var game = new Game();

for (var i = 1; i <= 5; ++i) {
    for (var j = 1; j <= 5; ++j) {
        var piece = game.board.getPiece(new Position(i, j));
        var moves = piece?.getMoves(game.board, new Position(i, j));
        console.log(piece?.getPieceType().toString());
        console.log(moves);
        console.log();
    }
}