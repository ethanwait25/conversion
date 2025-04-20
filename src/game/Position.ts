export class Position {
    public constructor(public row: number, public col: number) {}

    toString(): string {
        return `${this.row},${this.col}`;
    }

    static fromString(posString: string): Position {
        const [row, col] = posString.split(',').map(Number);
        return new Position(row, col);
    }
}