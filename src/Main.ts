import { Agent } from './Agent.js';
import { Color } from './game/enums/Color.js';
import { Game } from './game/Game.js';
import { Position } from './game/Position.js';
import { Person } from './Person.js';
import { RandomAgent } from './RandomAgent.js';

let game: Game;
let selectedPos: Position | null = null;

const boardEl = document.getElementById('board')!;
renderBoard();

const boardOverlay = document.getElementById('board-overlay')!;
const gameOverOverlay = document.getElementById('game-over-overlay')!;
const gameOverMessage = document.getElementById('game-over-message')!;

document.getElementById('start-game')!.addEventListener('click', () => {
    const whiteType = (document.getElementById('white-player') as HTMLSelectElement).value;
    const blackType = (document.getElementById('black-player') as HTMLSelectElement).value;

    const white = createPlayer(whiteType, Color.WHITE);
    const black = createPlayer(blackType, Color.BLACK);

    game = new Game(white, black);
    selectedPos = null;

    gameOverOverlay.style.display = 'none';
    boardEl.classList.remove('disabled');
    boardOverlay.style.display = 'none';

    game.play(() => {
        renderBoard();
    }).then((winner) => {
        if (winner !== null) {
            gameOverMessage.textContent = `${winner.toString()} wins!`;
            gameOverOverlay.style.display = 'flex';
        }
    });

    renderBoard();
});

function createPlayer(type: string, color: Color) {
    switch (type) {
        case 'Person': return new Person(color);
        case 'Agent': return new Agent(color);
        case 'RandomAgent': return new RandomAgent(color);
        default: return new Person(color);
    }
}

function renderBoard() {
    boardEl.innerHTML = '';
    for (let y = 1; y <= 5; y++) {
        for (let x = 1; x <= 5; x++) {
            const square = document.createElement('div');
            square.classList.add('square');
            const pos = new Position(y, x);

            const piece = game?.board.getPiece(pos) ?? null;

            if (piece) {
                const img = document.createElement('img');
                img.src = `./assets/${piece.color.toLowerCase()}-${piece.pieceType.toLowerCase()}.svg`;
                img.classList.add('piece-icon');
                square.appendChild(img);
            }

            square.addEventListener('click', () => {
                if (!game || boardEl.classList.contains('disabled')) return;

                if (!selectedPos && piece && piece.color === game.teamTurn) {
                    selectedPos = pos;
                    highlightMoves(selectedPos);
                } else if (selectedPos) {
                    if (selectedPos.row === pos.row && selectedPos.col === pos.col) {
                        selectedPos = null;
                        renderBoard();
                    } else {
                        const move = { startPos: selectedPos, endPos: pos };
                        const validMoves = game.board.getPiece(selectedPos)?.getMoves(game.board, selectedPos);

                        const isValid = validMoves?.some(
                            (validMove) =>
                                validMove.endPos.row === pos.row && validMove.endPos.col === pos.col
                        );

                        if (isValid) {
                            const player = game.players[game.teamTurn];
                            if (player instanceof Person) {
                                player.provideMove(move);
                            }
                            selectedPos = null;
                        } else {
                            highlightMoves(selectedPos);
                        }
                    }
                }
            });

            boardEl.appendChild(square);
        }
    }
}

function highlightMoves(pos: Position) {
    const validMoves = game.board.getPiece(pos)?.getMoves(game.board, pos);

    const squares = boardEl.querySelectorAll('.square');
    for (const square of squares) {
        square.classList.remove('highlight', 'selected');
    }

    const selectedIndex = (pos.row - 1) * 5 + (pos.col - 1);
    squares[selectedIndex].classList.add('selected');

    if (validMoves) {
        for (const move of validMoves) {
            const index = (move.endPos.row - 1) * 5 + (move.endPos.col - 1);
            squares[index].classList.add('highlight');
        }
    }
}