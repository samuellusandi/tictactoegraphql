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
5. Run this command (same player ID is allowed!), set the variables as needed.
```graphql
mutation makeGame($player1Id: String!, $player2Id: String!) {
  makeGame(player1Id: $player1Id, player2Id: $player2Id) {
    id
    boardState
    turnId
  }
}
```
6. Create the subscription
```graphql
subscription boardSubscription($boardId: String!) {
  boardMutated(boardId: $boardId) {
    id
    playerIds
    turnId
    boardState
    winner
  }
}
```
7. Open a new tab to start "playing" by invoking the flipTile mutation. The player ID is the current ID whose turn it is (it will throw error if it's not the player's turn). The index is a 0 ~ 8 index that denote the tile that you want to change.
```graphql
mutation flipTile($playerId: String!, $boardId: String!, $index: Int!) {
  flipTile(playerId: $playerId, boardId: $boardId, index: $index){
    id
    boardState
    turnId
    winner
  }
}
```
8. If there's a winner, `winner` will not be `null`. That's how you check if the game has a winner or not. Also, be sure to check the `boardState` just in case all of the tiles are flipped. If so, and there's no winner, it's a `draw`. 
