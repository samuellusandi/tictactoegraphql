import crypto from 'crypto';
import { Board } from "./board";
import { PubSub, withFilter } from 'graphql-subscriptions';

const games: Board[] = [];
const players: any[] = [];
const BOARD_STATE_UPDATED = 'board_state_updated';

function generateId(): string {
    const count = 30;
    const arrays = 'abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789';
    const rnd = crypto.randomBytes(count);
    const value = new Array(count);
    const len = Math.min(256, arrays.length);
    const d = 256 / len;

    for (let i = 0; i < count; i++) {
        value[i] = arrays[Math.floor(rnd[i] / d)];
    }

    return value.join('');
}

export const resolvers = {
    Query: {
        getPlayerIds: () => {
            return Object.keys(players);
        },

        getAllBoards: () => {
            let boards: any[] = [];
            let keys = Object.keys(games);
            keys.forEach((key) => {
                let gameBoard = games[key];
                let winner: string | undefined = gameBoard.getWinner();
                boards.push({
                    id: gameBoard.getId(),
                    playerIds: gameBoard.getPlayerIds(),
                    boardState: gameBoard.getBoard(),
                    turnId: gameBoard.getCurrentTurnId(),
                    winner: winner ? winner : null,
                });
            });
            return boards;
        },

        getBoard: (root: any, { id }: { id: string }, context: any) => {
            if (!games[id]) {
                throw Error('Can\'t find game.');
            }
            let board: Board = games[id];
            let winner: string | undefined = board.getWinner();
            return {
                id: board.getId(),
                playerIds: board.getPlayerIds(),
                boardState: board.getBoard(),
                turnId: board.getCurrentTurnId(),
                winner: winner ? winner : null,
            }
        },
    },

    Mutation: {
        flipTile: (root: any, { playerId, boardId, index }: { playerId: string, boardId: string, index: number }, { pubsub }: { pubsub: PubSub }) => {
            if (!games[boardId]) {
                throw Error('No games found with that id.');
            }
            let board = games[boardId];

            let winner: string | undefined = board.getWinner();
            board.flipTile(playerId, index);
            winner = board.getWinner();
            let boardValue = {
                id: boardId,
                playerIds: board.getPlayerIds(),
                boardState: board.getBoard(),
                turnId: board.getCurrentTurnId(),
                winner: winner ? winner : null,
            }
            pubsub.publish(BOARD_STATE_UPDATED, { boardMutated: boardValue });
            return boardValue;
        },

        makePlayer: () => {
            let id: string = generateId();
            players[id] = true;
            return id;
        },

        makeGame: (root: any, { player1Id, player2Id }: { player1Id: string, player2Id: string }) => {
            if (!(players[player1Id] && players[player2Id])) {
                throw Error('At least one player is nonexistent');
            }
            let boardId: string = generateId();
            let board = new Board(boardId, [player1Id, player2Id]);
            games[boardId] = board;
            let winner: string | undefined = board.getWinner();

            return {
                id: boardId,
                playerIds: board.getPlayerIds(),
                boardState: board.getBoard(),
                turnId: board.getCurrentTurnId(),
                winner: winner ? winner : null,
            };
        }
    },

    Subscription: {
        boardMutated: {
            subscribe: withFilter(
                (root: any, args: any, { pubsub }: { pubsub: PubSub }) => pubsub.asyncIterator(BOARD_STATE_UPDATED),
                (payload: any, variables: any) => {
                    return payload.boardMutated.id === variables.boardId;
                }
            ),
        }
    }
}
