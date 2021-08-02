class Fleet {
  constructor() {
    this.totalShips = 0;
    this.totalSunkShips = 0;
    this.totalHits = 0;
    this.ships = [];
  }

  /**
   * add ship to the fleet
   *
   * @param {object} ship - Ship object
   */
  addShip(ship) {
    this.ships.push(ship);
    this.totalShips += 1;
  }
}

module.exports = Fleet;
