class Grid {
  constructor(rows, columns, fleet) {
    this.lastRow = rows - 1; // area rows are 0 indexed
    this.lastColumn = columns - 1; // area columns are 0 indexed
    this.fleet = fleet;
    this.totalShot = 0;
    this.totalMiss = 0;
    this.area = [];
  }

  /**
   * sets the ship to area
   *
   * @param {number} shipIndex- index of ship in fleet.ships[] array
   * @param {object} startLocation - row and column number of start coordinates of ship
   * {row:number,col:number} row and col are 0 indexed
   * @param {'v'|'h'} direction ship way- h for horizantal, v for vertical
   * @result {boolean} - if ship set successfully returns true othervise throw error
   */
  setShipOnArea(shipIndex, startLocation, direction) {
    let ship;
    if (!this.fleet.ships[shipIndex]) {
      throw new Error(`There is not a ship in fleet with the index ${shipIndex}`);
    } else {
      ship = this.fleet.ships[shipIndex];
    }
    if (
      startLocation.row < 0 ||
      startLocation.row > this.lastRow ||
      startLocation.col < 0 ||
      startLocation.col > this.lastColumn
    ) {
      throw new Error(`Row or Column number is not in grid area`);
    }

    if (direction == 'h') {
      //if ship not fit the area horizantal way throw error
      if (startLocation.col + ship.length - 1 > this.lastColumn) {
        throw new Error(`Ship can not fit horizontally`);
      } else {
        // setup ship horizantal way part by part
        for (let i = 0; i < ship.length; i++) {
          if (this.area[startLocation.row] && this.area[startLocation.row][startLocation.col + i]) {
            throw new Error('Ships can not be overlapped');
          }
        }

        if (!this.area[startLocation.row]) this.area[startLocation.row] = [];
        ship.parts.forEach((part) => {
          this.area[startLocation.row][startLocation.col + part.partNo] = {
            ship: ship,
            partNo: part.partNo,
          };
        });
        return true;
      }
    } else if (direction == 'v')
      if (startLocation.row + ship.length - 1 > this.lastRow) {
        //if ship not fit the area vertical way throw error
        throw new Error(`Ship can not fit vertically`);
      } else {
        // setup ship vertical way part by part
        for (let i = 0; i < ship.length; i++) {
          if (
            this.area[startLocation.row + i] &&
            this.area[startLocation.row + i][startLocation.col]
          ) {
            throw new Error('Ships can not be overlapped');
          }
        }
        ship.parts.forEach((part) => {
          if (!this.area[startLocation.row + part.partNo])
            this.area[startLocation.row + part.partNo] = [];
          this.area[startLocation.row + part.partNo][startLocation.col] = {
            ship: ship,
            partNo: part.partNo,
          };
        });
        return true;
      }
    else {
      //direction neither v or h
      throw new Error(`Direction should be v or h`);
    }
  }

  /**
   * grid is shooted
   *
   * @param {object} target - row and column number of start coordinates of ship
   * {row:number,colRow:number} row and col are 0 indexed
   * @result {isHit:boolean, shipSunk{id:num,name:str,length:num}
   * isHit - true if shot hit, false if it is miss,
   * shipSunk - if there is not, no ship sunk by this hit,
   * if there it is, {id:num,name:str,length:num} ship is sunk by this shot
   */

  shooted(target) {
    //target format {row:..., col:...}
    this.totalShot += 1;
    const resp = { isHit: false };

    if (
      target.row < 0 ||
      target.row > this.lastRow ||
      target.col < 0 ||
      target.col > this.lastColumn
    ) {
      // shot is missed even if it is not in grid
      this.totalMiss += 1;
      return resp;
    }

    let cell = this.area[target.row] && this.area[target.row][target.col]; // cell of area grid may be empty or not
    if (!cell) {
      if (!this.area[target.row]) this.area[target.row] = [];
      cell = this.area[target.row][target.col] = 'm'; // sign point as missed
    }

    if (cell == 'm') {
      // shot is missed before at this point
      this.totalMiss += 1;
      return resp;
    }

    if (cell.ship.hit(cell.partNo)) {
      // returns true if the part has not hit before
      this.fleet.totalHits += 1;
      resp.isHit = true;

      if (cell.ship.isSunk()) {
        this.fleet.totalSunkShips += 1;
        resp.shipSunk = { id: cell.ship.shipID, name: cell.ship.name, length: cell.ship.length };
      } else {
        // there is a ship on target but has hit before
        this.totalMiss += 1;
      }
    }
    return resp;
  }
}

module.exports = Grid;
