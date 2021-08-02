class Ship {
  constructor(shipID, name, lenght) {
    this.shipID = shipID;
    this.name = name;
    this.lenght = lenght;
    this.totalHit = 0;
    this.parts = [];
    // part no 0 indexed
    for (let i = 0; i < lenght; i++) {
      this.parts[i] = { partNo: i, isDestroyed: false };
    }
  }

  /**
   * ship is hit
   * @param {number} partno- index of ship part
   * @result {boelean} true if hit succesful, or false if it was hit before
   */
  hit(partNo) {
    if (partNo < 0 || partNo >= this.lenght) return false;
    if (this.parts[partNo].isDestroyed) return false;
    this.parts[partNo].isDestroyed = true;
    this.totalHit += 1;
    return true;
  }

  /**
   * is ship sunk yet?
   * @result {boelean} true if ship is sunk
   */
  isSunk() {
    return this.totalHit == this.lenght;
  }

  /**
   * is ship hit yet?
   * @result {boelean} true if ship is hit
   */
  isHit() {
    return !!this.totalhit;
  }

  /**
   * how many parts of ship hit
   * @result {string}
   */
  percentageHit() {
    return {
      percent: `${this.totalHit}/${this.lenght}`,
      msj: `${this.totalHit}/${this.lenght} of ship is hit. (% ${parseInt(
        (this.totalHit / this.lenght) * 100
      )}.)`,
    };
  }
}

module.exports = Ship;
