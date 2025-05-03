import { Color } from "./game/enums/Color.js";
import { Game } from "./game/Game.js";
import { Move } from "./game/Move.js";
import { Player } from "./Player.js"

export class RandomAgent extends Player {
    public constructor(color: Color) {
        super(color);
    }

    public async getMove(game: Game): Promise<Move> {
        const availableMoves = game.board.getAllMovesForColor(this.color);
        return this.chooseRandomMove(availableMoves);
    }

    public chooseRandomMove(moves: Move[]): Move {
        return moves[Math.floor(Math.random() * moves.length)];
    }
}