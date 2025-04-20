import { Game } from './game/Game.js';
import { Position } from './game/Position.js';
const game = new Game();

const boardEl = document.getElementById('board')!;
let selectedPos: Position | null = null;

function renderBoard() {
    boardEl.innerHTML = '';
    for (let y = 1; y <= 5; y++) {
        for (let x = 1; x <= 5; x++) {
            const square = document.createElement('div');
            square.classList.add('square');
            const piece = game.board.getPiece(new Position(y, x));
            if (piece) {
                const img = document.createElement('img');
                img.src = `./assets/${piece.color.toLowerCase()}-${piece.pieceType.toLowerCase()}.svg`;
                img.classList.add('piece-icon');
                square.appendChild(img);
            }

            square.addEventListener('click', () => {
                if (!selectedPos && piece && piece.color === game.teamTurn) {
                    selectedPos = new Position(y, x);
                    highlightMoves(selectedPos);
                } else if (selectedPos) {
                    const move = { startPos: selectedPos, endPos: new Position(y, x) };
                    game.makeMove(move);
                    selectedPos = null;
                    renderBoard();
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
        square.classList.remove('highlight');
    }

    if (validMoves) {
        for (const move of validMoves) {
            const index = move.endPos.col * 5 + move.endPos.row;
            const square = squares[index];
            square.classList.add('highlight');
        }
    }
}

renderBoard();