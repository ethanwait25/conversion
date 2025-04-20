import { Color } from "./game/enums/Color";
import { Game } from "./game/Game";
import { Move } from "./game/Move";

export abstract class Player {
    public constructor(public color: Color) {}

    public abstract getMove(game: Game): Promise<Move>;
}