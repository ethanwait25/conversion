import { Player } from "../Player.js";
import { Board } from "./Board.js";
import { Color } from "./enums/Color.js";
import { PieceType } from "./enums/PieceType.js";
import { Move } from "./Move.js";
import type { Piece } from "./Piece.js";
import { Position } from "./Position.js";

export class Game {
    public board: Board;
    public teamTurn: Color;
    public remaining: {[C in Color]: number};
    public players: {[C in Color]: Player};
    public winner: Color | null;
    
    public constructor(whitePlayer: Player, blackPlayer: Player) {
        this.board = new Board();
        this.teamTurn = Color.WHITE;
        this.remaining = {[Color.WHITE]: 8, [Color.BLACK]: 8}
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