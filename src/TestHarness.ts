import { Agent } from "./Agent.js";
import { EasyDifficulty, HardDifficulty, ImpossibleDifficulty, MediumDifficulty } from "./DifficultySelector.js";
import { Color } from "./game/enums/Color.js";
import { Game } from "./game/Game.js";
import { Player } from "./Player.js";

async function runTest(white: Player, black: Player, rounds: number) {
    let whiteWins = 0;
    let blackWins = 0;
    let ties = 0;

    for (let i = 0; i < rounds; ++i) {
        const game = new Game(white, black, undefined, undefined, true);
        const winner = await game.play(() => {});
        if (winner == Color.WHITE) whiteWins++;
        else if (winner == Color.BLACK) blackWins++;
        else ties++;

        if ((i + 1) % 10 == 0) {
            console.log(`Completed ${i+1} games...`);
        }
    }

    console.log(`\nRESULTS (${rounds} games):`);
    console.log(`White Wins: ${whiteWins}`);
    console.log(`Black Wins: ${blackWins}`);
    console.log(`Ties:       ${ties}`);
    console.log(`White Win %: ${(whiteWins / rounds * 100).toFixed(1)}%`);
    console.log(`Black Win %: ${(blackWins / rounds * 100).toFixed(1)}%`);
}

const configs = [EasyDifficulty, MediumDifficulty, HardDifficulty, ImpossibleDifficulty];
const labels = ["Easy", "Medium", "Hard", "Impossible"];

for (let i = 0; i < configs.length; ++i) {
    for (let j = 0; j < configs.length; ++j) {
        if (i != j) {
            console.log(`\n--- ${labels[i]} vs ${labels[j]} ---`);
            await runTest(
                new Agent(Color.WHITE, new configs[i]()),
                new Agent(Color.BLACK, new configs[j]()),
                100
            );
        }
    }
}