import { Player } from "../Player.js";
import { Board } from "./Board.js";
import { Color } from "./enums/Color.js";
import { PieceType } from "./enums/PieceType.js";
import { Move } from "./Move.js";
import { Piece } from "./Piece.js";
import { Position } from "./Position.js";

export class Game {
    public board: Board;
    public teamTurn: Color;
    public remaining: {[C in Color]: number};
    public players: {[C in Color]: Player};
    public winner: Color | null;
    
    public constructor(whitePlayer: Player, blackPlayer: Player, board?: Board, turn?: Color) {
        this.board = board ?? new Board();
        this.teamTurn = turn ?? Color.WHITE;

        this.remaining = {
            [Color.WHITE]: this.countPiecesOnBoard(Color.WHITE),
            [Color.BLACK]: this.countPiecesOnBoard(Color.BLACK)
        };

        this.players = {
            [Color.WHITE]: whitePlayer,
            [Color.BLACK]: blackPlayer
        }
        this.winner = null;
    }

    public async play(onUpdate?: () => void): Promise<Color | null> {
        while (!(this.winner = this.checkWinner())) {
            const currentPlayer = this.players[this.teamTurn];
            const move = await currentPlayer.getMove(this);
            this.makeMove(move);
            if (onUpdate) {
                onUpdate();
            }
            await new Promise(resolve => setTimeout(resolve, 0));
            this.teamTurn = this.teamTurn === Color.WHITE ? Color.BLACK : Color.WHITE;
        }
        return this.winner;
    }

    public makeMove(move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;
        const piece = this.board.getPiece(startPos);
        const endPiece = this.board.getPiece(endPos);

        if (piece && endPiece && piece.color == endPiece.color) {
            this.doExchange(piece, endPiece, move);
        } else {
            if (piece) {
                this.doMovement(piece, endPiece, move);
            }
        }
    }

    private doExchange(first: Piece, second: Piece, move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;

        this.board.setPiece(startPos, second);
        this.board.setPiece(endPos, first);

        this.updateIfTrackedPiece(first, endPos, startPos);
        this.updateIfTrackedPiece(second, startPos, endPos);
    }

    private doMovement(piece: Piece, captured: Piece | null, move: Move) {
        const startPos = move.startPos;
        const endPos = move.endPos;

        this.board.setPiece(startPos, null);
        this.board.setPiece(endPos, piece);

        this.updateIfTrackedPiece(piece!, endPos, startPos);
        if (captured) {
            this.updateIfTrackedPiece(captured, null, endPos);
            this.remaining[captured.color] -= 1;
        }
    }

    private updateIfTrackedPiece(piece: Piece, pos: Position | null, oldPos: Position) {
        if (piece.pieceType == PieceType.PRESIDENT || piece.pieceType == PieceType.DL || piece.pieceType == PieceType.MISSIONARY) {
            this.board.setTrackedPiece(piece.color, piece.pieceType, pos);

            if (piece.pieceType == PieceType.MISSIONARY) {
                this.board.removeTrackedMissionary(piece.color, oldPos);
            }
        }

    }

    public getPieceCount(color: Color): number {
        return this.remaining[color];
    }

    private countPiecesOnBoard(color: Color): number {
        var count = 0;
        for (var row = 1; row <= 5; ++row) {
            for (var col = 1; col <= 5; ++col) {
                const pos = new Position(row, col);
                const piece = this.board.getPiece(pos);
                if (piece && piece.color == color) {
                    count += 1;
                }
            }
        }
        return count;
    }

    public getPieceValueScore(color: Color) {
        const values: {[T in PieceType]: number} = {
            [PieceType.PRESIDENT]: 15,
            [PieceType.ASSISTANT]: 4,
            [PieceType.ZL]: 6,
            [PieceType.STL]: 7,
            [PieceType.DL]: 8,
            [PieceType.MISSIONARY]: 2
        }

        var value = 0;
        for (var row = 1; row <= 5; ++row) {
            for (var col = 1; col <= 5; ++col) {
                const pos = new Position(row, col);
                const piece = this.board.getPiece(pos);
                if (piece && piece.color == color) {
                    value += values[piece.getPieceType()];
                }
            }
        }
        return value;
    }

    private checkWinner(): Color | null {
        if (this.remaining[Color.BLACK] === 0 || this.board.getAllMovesForColor(Color.BLACK).length === 0) {
            return Color.WHITE
        } else if (this.remaining[Color.WHITE] === 0 || this.board.getAllMovesForColor(Color.WHITE).length === 0) {
            return Color.BLACK
        } else {
            return null;
        }
    }
}