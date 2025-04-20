import { Color } from "./game/enums/Color.js";
import { Game } from "./game/Game.js";
import { Move } from "./game/Move.js";
import { Player } from "./Player.js"

export class Person extends Player {
    private resolveMove!: (move: Move) => void;

    public constructor(color: Color) {
        super(color);
    }

    public async getMove(game: Game): Promise<Move> {
        return new Promise<Move>((resolve) => {
            this.resolveMove = resolve;
        });
    }

    public provideMove(move: Move) {
        if (this.resolveMove) {
            this.resolveMove(move);
        }
    }
}