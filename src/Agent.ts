import { DifficultySelector } from "./DifficultySelector.js";
import { Board } from "./game/Board.js";
import { Color } from "./game/enums/Color.js";
import { PieceType } from "./game/enums/PieceType.js";
import { Game } from "./game/Game.js";
import { Move } from "./game/Move.js";
import { Piece } from "./game/Piece.js";
import { Position } from "./game/Position.js";
import { Player } from "./Player.js";

type Metrics = {
  states: [number, number];
  leaves: [number, number];
  pruned: [number, number];
  pulled: [number, number];
};

export class Agent extends Player {
  private maxDepth: number = 0;
  private cache: Map<string, { value: number; move: Move | null }> = new Map();

  private metrics: Metrics = {
    states: [0, 0],
    leaves: [0, 0],
    pruned: [0, 0],
    pulled: [0, 0],
  };

  private count = 0;
  private testedStates = 0;
  private leafNodes = 0;
  private pruned = 0;
  private pulled = 0;
  private playerColor;
  private params;

  public constructor(color: Color, params: DifficultySelector) {
    super(color);
    this.playerColor = color;
    this.params = params;
  }

  public async getMove(game: Game): Promise<Move> {
    var move: Move = this.chooseBestMove(game);
    return move;
  }

  public chooseBestMove(game: Game): Move {
    this.maxDepth = game.getPieceCount(this.playerColor) < 5 ? this.params.earlyDepth : this.params.lateDepth
    this.testedStates = 0;
    this.leafNodes = 0;
    this.pruned = 0;
    this.pulled = 0;

    const [v, bestAction] = this.maxValue(game, -Infinity, Infinity, 0);
    this.count += 1;

    // console.log("returning:", bestAction);
    // console.log("move value:", v);
    // console.log(
    //   `Ave: [ ${this.metrics.states[0].toFixed(
    //     2
    //   )}, ${this.metrics.leaves[0].toFixed(
    //     2
    //   )}, ${this.metrics.pruned[0].toFixed(
    //     2
    //   )}, ${this.metrics.pulled[0].toFixed(2)} ]`
    // );
    // console.log(
    //   `Max: [ ${this.metrics.states[1].toFixed(
    //     2
    //   )}, ${this.metrics.leaves[1].toFixed(
    //     2
    //   )}, ${this.metrics.pruned[1].toFixed(
    //     2
    //   )}, ${this.metrics.pulled[1].toFixed(2)} ]`
    // );

    this.updateMetrics();
    return bestAction!;
  }

  maxValue(
    game: Game,
    a: number,
    b: number,
    depth: number
  ): [number, Move | null] {
    if (depth >= this.maxDepth) return [this.eval(game), null];

    const validMoves = game.board.getAllMovesForColor(game.teamTurn);
    if (validMoves.length === 0) return [this.utilify(game), null];

    const stateHash = this.getStateHash(game);
    if (this.cache.has(stateHash)) {
      this.pulled += 1;
      const cached = this.cache.get(stateHash)!;
      return [cached.value, cached.move];
    }

    let v = -Infinity;
    let bestAction: Move | null = null;
    for (const move of validMoves) {
      const newState = this.simulateMove(game, move);
      const [minVal] = this.minValue(newState, a, b, depth + 1);
      if (minVal > v) {
        v = minVal;
        bestAction = move;
      }
      if (v >= b) {
        this.pruned += 1;
        this.cache.set(stateHash, { value: v, move: bestAction });
        return [v, bestAction];
      }
      a = Math.max(a, v);
    }
    this.cache.set(stateHash, { value: v, move: bestAction });
    return [v, bestAction];
  }

  minValue(
    game: Game,
    a: number,
    b: number,
    depth: number
  ): [number, Move | null] {
    if (depth >= this.maxDepth) return [this.eval(game), null];

    const validMoves = game.board.getAllMovesForColor(game.teamTurn);
    if (validMoves.length === 0 || game.winner != null) return [this.utilify(game), null];

    const stateHash = this.getStateHash(game);
    if (this.cache.has(stateHash)) {
      this.pulled += 1;
      const cached = this.cache.get(stateHash)!;
      return [cached.value, cached.move];
    }

    let v = Infinity;
    let bestAction: Move | null = null;
    for (const move of validMoves) {
      const newState = this.simulateMove(game, move);
      const [maxVal] = this.maxValue(newState, a, b, depth + 1);
      if (maxVal < v) {
        v = maxVal;
        bestAction = move;
      }
      if (v <= a) {
        this.pruned += 1;
        this.cache.set(stateHash, { value: v, move: bestAction });
        return [v, bestAction];
      }
      b = Math.min(b, v);
    }
    this.cache.set(stateHash, { value: v, move: bestAction });
    return [v, bestAction];
  }

  getStateHash(game: Game): string {
    return `${game.teamTurn}-${game.board.getHash()}`;
  }

  eval(game: Game): number {
    this.leafNodes += 1;
    let myPieces, oppPieces: number;
    myPieces = game.getPieceCount(this.playerColor);
    oppPieces = game.getPieceCount(this.getOppColor(this.playerColor));

    // Number of remaining pieces
    var pieceParity = 0;
    if (myPieces + oppPieces != 0) {
            pieceParity = 100 * (myPieces - oppPieces) / (myPieces + oppPieces);
    }

    let myValue, oppValue: number;
    myValue = game.getPieceValueScore(this.playerColor);
    oppValue = game.getPieceValueScore(this.getOppColor(this.playerColor));

    // Value of remaining pieces
    var valueScore = 0;
    if (myValue + oppValue != 0) {
        valueScore = 100 * (myValue - oppValue) / (myValue + oppValue);
    }

    let myMoves, oppMoves: number;
    myMoves = game.board.getAllMovesForColor(this.playerColor).length;
    oppMoves = game.board.getAllMovesForColor(this.getOppColor(this.playerColor)).length;

    // Number of available moves
    var mobility = 0;
    if (myMoves + oppMoves != 0) {
        mobility = 100 * (myMoves - oppMoves) / (myMoves + oppMoves);
    }

    let myCentralScore, oppCentralScore: number;
    myCentralScore = this.getCentralScore(this.playerColor, game.board);
    oppCentralScore = this.getCentralScore(this.getOppColor(this.playerColor), game.board);

    // Measure of center power
    var centralScore = 0;
    if (myCentralScore + oppCentralScore != 0) {
      centralScore = 100 * (myCentralScore - oppCentralScore) / (myCentralScore + oppCentralScore);
    }

    let myThreats, oppThreats: number;
    myThreats = this.countThreats(this.playerColor, game);
    oppThreats = this.countThreats(this.getOppColor(this.playerColor), game);

    // Threat score
    var threatScore = 0;
    if (myThreats + oppThreats != 0) {
        threatScore = 100 * (myThreats - oppThreats) / (myThreats + oppThreats);
    }

    let phase = (myPieces + oppPieces) / 16;
    let valueWeight = this.params.valueWeight + (0.2 * phase);
    let mobilityWeight = this.params.mobilityWeight - (0.2 * phase);
    let centralScoreWeight = this.params.centralScoreWeight;
    let parityWeight = this.params.parityWeight;
    let threatWeight = this.params.threatWeight;

    let score = (parityWeight * pieceParity) + 
      (mobilityWeight * mobility) + 
      (valueWeight * valueScore) + 
      (centralScoreWeight * centralScore) +
      (threatWeight * threatScore);

    return score + (Math.random() < 0.5 ? -1 : 1) * (Math.random() * this.params.rVariation * score);
  }

  utilify(game: Game): number {
    this.leafNodes += 1;
    const myPieces = game.getPieceCount(this.playerColor);
    const oppPieces = game.getPieceCount(this.getOppColor(this.playerColor));
    if (game.winner === this.playerColor || myPieces > oppPieces) return 1000;
    if (game.winner === this.getOppColor(this.playerColor) || myPieces < oppPieces) return -1000;
    return 0;
  }

  simulateMove(
    game: Game,
    move: Move
  ): Game {
    this.testedStates += 1;
    const newGame: Game = new Game(
      game.players[Color.WHITE],
      game.players[Color.BLACK],
      game.board.clone(),
      game.teamTurn
    );
    newGame.makeMove(move);
    newGame.teamTurn = this.getOppColor(game.teamTurn);
    return newGame;
  }

  updateMetrics(): void {
    const update = (key: keyof Metrics, newValue: number) => {
      const avg =
        (this.metrics[key][0] * (this.count - 1) + newValue) / this.count;
      this.metrics[key][0] = avg;
      this.metrics[key][1] = Math.max(this.metrics[key][1], newValue);
    };

    update("states", this.testedStates);
    update("leaves", this.leafNodes);
    update("pruned", this.pruned);
    update("pulled", this.pulled);
  }

  private getCentralScore(color: Color, board: Board) {
    let score = 0;
    const centerSquares = [
      new Position(2, 2), new Position(2, 3), new Position(2, 4), 
      new Position(3, 2), new Position(3, 3), new Position(3, 4),
      new Position(4, 2), new Position(4, 3), new Position(4, 4)
    ];
    for (const pos of centerSquares) {
      const piece = board.getPiece(pos);
      if (piece && piece.color === color) score += 1;
    }
    return score;
  }

  private countThreats(color: Color, game: Game): number {
    const moves = game.board.getAllMovesForColor(color);
    let threatScore = 0;
  
    for (const move of moves) {
      const targetPiece = game.board.getPiece(move.endPos);
      if (targetPiece && targetPiece.color !== color) {
        threatScore += this.getPieceThreatValue(targetPiece);
      }
    }
  
    return threatScore;
  }

  private getPieceThreatValue(piece: Piece): number {
    switch (piece.pieceType) {
      case PieceType.PRESIDENT: return 15;
      case PieceType.STL: return 7;
      case PieceType.DL: return 8;
      case PieceType.ZL: return 6;
      case PieceType.ASSISTANT: return 4;
      case PieceType.MISSIONARY: return 2;
      default: return 1;
    }
  }

  private getOppColor(color: Color) {
    return this.playerColor === Color.WHITE ? Color.BLACK : Color.WHITE
  }
}