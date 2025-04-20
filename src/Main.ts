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
            const pos = new Position(y, x);
            const piece = game.board.getPiece(pos);

            if (piece) {
                const img = document.createElement('img');
                img.src = `./assets/${piece.color.toLowerCase()}-${piece.pieceType.toLowerCase()}.svg`;
                img.classList.add('piece-icon');
                square.appendChild(img);
            }

            square.addEventListener('click', () => {
                if (!selectedPos && piece && piece.color === game.teamTurn) {
                    selectedPos = pos;
                    highlightMoves(selectedPos);
                } else if (selectedPos) {
                    if (selectedPos.row == pos.row && selectedPos.col == pos.col) {
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
                            game.makeMove(move);
                            selectedPos = null;
                            renderBoard();
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

renderBoard();
