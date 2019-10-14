import { gql } from 'apollo-server';

export const typedefs = gql`
    type Board {
        id: String!
        playerIds: [String!]!
        boardState: [Int!]!
        turnId: String!
        winner: String
    }

    type Query {
        getPlayerIds: [String]!
        getAllBoards: [Board]!
        getBoard(id: String!): Board
        impersonate(playerId: String!): String
    }

    type Mutation {
        flipTile(playerId: String!, boardId: String!, index: Int!): Board
        makePlayer: String!
        makeGame(player1Id: String!, player2Id: String!): Board
    }

    type Subscription {
        boardMutated(boardId: String!): Board
    }
`;
