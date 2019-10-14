export class Board {
    public static readonly PLAYER_1_SYMBOL: number = 1;
    public static readonly PLAYER_2_SYMBOL: number = 2;

    private id: string;
    private board: number[];
    private turn: string;
    private playerIds: string[];

    public constructor(id: string, playerIds: string[]) {
        if (playerIds.length !== 2) {
            throw Error('Number of players must exactly be 2.');
        }
        this.id = id;
        this.board = [
            0, 0, 0,
            0, 0, 0,
            0, 0, 0,
        ];
        this.playerIds = playerIds;
        this.turn = playerIds[0];
    }

    public getId(): string {
        return this.id;
    }

    public getCurrentTurnId(): string {
        return this.turn;
    }

    public getBoard(): number[] {
        return this.board;
    }

    public getPlayerIds(): string[] {
        return this.playerIds;
    }

    public countEmptySpace(): number {
        let count = 0;
        for (let i = 0; i < this.board.length; ++i) {
            if (this.board[i] === 0) {
                count += 1;
            }
        }
        return count;
    }

    public hasEmptySpace(): boolean {
        return this.countEmptySpace() > 0;
    }

    public flipTile(playerId: string, location: number): void {
        if (this.hasWinner()) {
            throw Error('This board already has a winner.');
        }
        if (!this.playerIds.includes(playerId)) {
            throw Error('Player not recognized.');
        }
        if (playerId !== this.turn) {
            throw Error('Not the player\'s turn.');
        }
        if (location < 0 || location >= 9) {
            throw Error('Index too big, must be between 0 and 8 inclusive.');
        }
        if (this.board[location] === Board.PLAYER_1_SYMBOL ||
            this.board[location] === Board.PLAYER_2_SYMBOL) {
            throw Error('Board has been set. Pick another block.');
        }

        this.board[location] = this.playerIds.indexOf(playerId) === 0
            ? Board.PLAYER_1_SYMBOL
            : Board.PLAYER_2_SYMBOL;
        this.flipTurn(playerId);
    }

    public getWinner(): string | undefined {
        let board = this.board;
        if (this.hasWinner()) {
            // Horizontal
            if (board[0] === board[1] && board[1] === board[2] && board[0] !== 0) return this.playerIds[board[0] - 1];
            if (board[3] === board[4] && board[4] === board[5] && board[3] !== 0) return this.playerIds[board[3] - 1];
            if (board[6] === board[7] && board[7] === board[8] && board[6] !== 0) return this.playerIds[board[6] - 1];
            // Vertical
            if (board[0] === board[3] && board[3] === board[6] && board[0] !== 0) return this.playerIds[board[0] - 1];
            if (board[1] === board[4] && board[4] === board[7] && board[1] !== 0) return this.playerIds[board[1] - 1];
            if (board[2] === board[5] && board[5] === board[8] && board[2] !== 0) return this.playerIds[board[2] - 1];
            // Diagonal
            if (board[0] === board[4] && board[4] === board[8] && board[0] !== 0) return this.playerIds[board[0] - 1];
            if (board[2] === board[4] && board[4] === board[6] && board[2] !== 0) return this.playerIds[board[2] - 1];
        }
        return undefined;
    }

    private hasWinner(): boolean {
        let board = this.board;
        return (
            // Horizontal
            board[0] === board[1] && board[1] === board[2] && board[0] !== 0 ||
            board[3] === board[4] && board[4] === board[5] && board[3] !== 0 ||
            board[6] === board[7] && board[7] === board[8] && board[6] !== 0 ||
            // Vertical
            board[0] === board[3] && board[3] === board[6] && board[0] !== 0 ||
            board[1] === board[4] && board[4] === board[7] && board[1] !== 0 ||
            board[2] === board[5] && board[5] === board[8] && board[2] !== 0 ||
            // Diagonal
            board[0] === board[4] && board[4] === board[8] && board[0] !== 0 ||
            board[2] === board[4] && board[4] === board[6] && board[2] !== 0
        );
    }

    private flipTurn(playerId: string): void {
        this.turn = playerId === this.playerIds[0]
            ? this.playerIds[1]
            : this.playerIds[0];
    }
}
