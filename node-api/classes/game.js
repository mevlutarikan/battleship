const config = require('../utils/config');
const Ship = require('./ship');
const Fleet = require('./fleet');
const Grid = require('./grid');

class Game {
  constructor(gameID) {
    this.gameID = gameID;
    this.player = [];

    //for(var i = 0; i < 2; i++) only 2 iterations, this may be faster
    //set player 0 board
    let fleet = new Fleet();
    // add ships to the fleet
    let id = 0;
    config.fleet.forEach((shipName) => {
      const ship = new Ship(id, shipName, config.shipTypes[shipName].length);
      fleet.addShip(ship);
      id++;
    });

    this.player[0] = {};
    this.player[0].grid = new Grid(config.grid.rows, config.grid.columns, fleet);
    this.player[0].isMyTurn = true;
    this.player[0].hasStarted = false;

    //set player2 board
    fleet = new Fleet();
    // add ships to the fleet
    config.fleet.forEach((shipName) => {
      const ship = new Ship(shipName, config.shipTypes[shipName].length);
      fleet.addShip(ship);
    });

    this.player[1] = {};
    this.player[1].grid = new Grid(config.grid.rows, config.grid.columns, fleet);
    this.player[1].isMyTurn = false;
    this.player[1].hasStarted = false;
  }

  checkInPlayer(sessionID) {
    if (!this.player[0].sessionID) {
      // assign first player
      this.player[0].sessionID = sessionID;
    } else if (this.player[0].sessionID == sessionID) {
      throw new Error(`You are already assigned to this game`);
    } else if (!this.player[1].sessionID) {
      // second player not assigned
      this.player[1].sessionID = sessionID;
    } else {
      throw new Error(`This game is 2 player game`);
    }
  }

  /**
   * shoot to the enemy grid
   *
   * @param {number} playerIndex- what index of player shoots
   * @param {object} target - row and column number of target coordinates
   * {row:number,col:number} row and col are 0 indexed
   * @result {object} - game state or winner
   */

  shoot(playerIndex, target) {
    let ship,
      enemyArea,
      shootRes = {};

    let enemyIndex = playerIndex ? 0 : 1;
    if (!this.player[playerIndex].isMyTurn) {
      return { msj: 'It is not your turn' };
    }
    isHitSuccess = this.player[enemyIndex].grid.shooted(target).isHit;
    this.player[enemyIndex].isMyTurn = true;
    this.player[playerIndex].isMyTurn = false;

    if (
      this.player[enemyIndex].grid.fleet.totalSunkShips ==
      this.player[enemyIndex].grid.fleet.totalShips
    ) {
      // all ships of fleet is sunk. game over. shooter player win
      return {
        gameOver: 'Game Over',
        winnerSocketID: this.player[playerIndex].socketID,
      };
    }

    // return game status of oponent

    shootRes.isHit = isHitSuccess;
    shootRes.target = target;
    shootRes.enemy.totalSunkShips = player[enemyIndex].grid.fleet.totalSunkShips;
    shootRes.enemy.totalSunkHits = player[enemyIndex].grid.fleet.totalHits;
    shootRes.enemy.totalMiss = player[enemyIndex].grid.totalMiss;

    Object.assign(enemyArea, player[enemyIndex].grid.area);

    for (var row in enemyArea) {
      for (var col in enemyArea[row]) {
        if (enemyArea[row][col] != 'm');
        ship = enemyArea[row][col];
        if (ship.parts[ship.partNo].isDestroyed) enemyArea[row][col] = 'h';
      }
    }
    gameState.enemyArea = enemyArea;
    return gameState;
  }
}
module.exports = Game;
