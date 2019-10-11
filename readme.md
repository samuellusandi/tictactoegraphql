# TicTacToe Server

Flow (just follow this):
1. `npm install`
2. `npm run start`
3. Open http://localhost:4000/graphql
4. Run this twice (be sure to take note of the player IDs) or once (depends if you want to "play alone"):
```graphql
mutation makePlayer {
  makePlayer
}
```
5. Run this command (same player ID is allowed!)
```graphql
mutation makeGame {
  makeGame(player1Id: "ID1", player2Id: "ID2") {
    id
    boardState
    turnId
  }
}
```
6. Create the subscription
```graphql
subscription boardSubscription {
  boardMutated(boardId:"BoardID") {
    id
    playerIds
    turnId
    boardState
  }
}
```
7. Open a new tab to start "playing" by invoking the flipTile mutation. The player ID is the current ID whose turn it is (it will throw error if it's not the player's turn). The index is a 0 ~ 8 index that denote the tile that you want to change.
```graphql
mutation flipTile {
  flipTile(playerId:"PlayerID", boardId:"BoardID", index: INDEX) {
    id
    boardState
    turnId
    winner
  }
}
```
8. If there's a winner, `winner` will not be `null`. That's how you check if the game has a winner or not. Also, be sure to check the `boardState` just in case all of the tiles are flipped. If so, and there's no winner, it's a `draw`. 
