const Ship = require('../classes/ship');
const Fleet = require('../classes/fleet');
const Grid = require('../classes/grid');
const { TestWatcher } = require('jest');

/**
 * test datas
 */
const shipData = [
  { id: 0, name: 'Scout', length: 2 },
  { id: 1, name: 'Cruiser', length: 3 },
  { id: 2, name: 'Battleship', length: 4 },
  { id: 3, name: 'Carrier', length: 5 },
  { id: 4, name: 'Aircraft', length: 6 },
];

/**
 * ship class test
 */

describe('ship test', () => {
  const ship = new Ship(shipData[4].id, shipData[4].name, shipData[4].length);
  test('creates instance of ship', () => {
    expect(ship).toBeDefined;
  });

  test('returns false if partno not valid', () => {
    expect(ship.hit(-2)).toBeFalsy;
    expect(ship.hit(6)).toBeFalsy;
  });

  test('returns false if not hit yet', () => {
    expect(ship.isHit()).toBeFalsy;
  });

  test('hit returns true if the PART of ship not hit before', () => {
    expect(ship.hit(0)).toBeTruthy;
    expect(ship.hit(4)).toBeTruthy;
  });

  test('hit returns false if the PART of ship was hit before', () => {
    expect(ship.hit(4)).toBeFalsy;
  });

  test('returns false if not hit yet', () => {
    expect(ship.isHit()).toBeTruthy;
  });

  test('hit returns percentage of destroyed parts', () => {
    let result = ship.percentageHit();
    expect(result).toBeDefined;
    expect(result.percent).toBe('2/6');
    expect(result.msj).toContain('% 33');
  });

  test('returns false if not sunk', () => {
    expect(ship.isSunk()).toBeFalsy;
  });

  test('returns true if sunk', () => {
    ship.hit(1);
    ship.hit(2);
    ship.hit(3);
    ship.hit(5);
    ship.hit(6);
    expect(ship.isSunk()).toBeTruthy;
  });
});

/**
 *  fleet class test
 */

describe('fleet test', () => {
  const fleet = new Fleet();
  let ship;

  test('creates instance of fleet', () => {
    expect(fleet).toBeDefined;
  });

  test('number of ship must be 3 in fleet', () => {
    ship = new Ship(shipData[1].id, shipData[1].name, shipData[1].length);
    fleet.addShip(ship);
    ship = new Ship(shipData[3].id, shipData[3].name, shipData[3].length);
    fleet.addShip(ship);
    ship = new Ship(shipData[4].id, shipData[4].name, shipData[4].length);
    fleet.addShip(ship);

    expect(fleet.totalShips).toBe(3);
  });
});

/**
 *  grid class test
 */

describe('Grid test', () => {
  const fleet = new Fleet();
  let ship;

  for (let i in shipData) {
    ship = new Ship(shipData[i].id, shipData[i].name, shipData[i].length);
    fleet.addShip(ship);
  }
  const grid = new Grid(5, 7, fleet);

  // set the ship one by one
  // rows and cols are 0 indexed
  test('throw error if ship not added to grid.fleet', () => {
    expect(() => grid.setShipOnArea(7, { row: 1, col: 1 }, 'h')).toThrow(Error);
  });

  test('throw error if start location out of grid', () => {
    expect(() => grid.setShipOnArea(4, { row: -1, col: 1 }, 'h')).toThrow(Error);
    expect(() => grid.setShipOnArea(4, { row: 1, col: -1 }, 'h')).toThrow(Error);
    expect(() => grid.setShipOnArea(4, { row: 5, col: 1 }, 'h')).toThrow(Error);
    expect(() => grid.setShipOnArea(4, { row: 1, col: 10 }, 'h')).toThrow(Error);
  });

  test('throw error if direction not v or h', () => {
    expect(() => grid.setShipOnArea(0, { row: 1, col: 1 }, '')).toThrow(Error);
    expect(() => grid.setShipOnArea(0, { row: 1, col: 1 }, 'a')).toThrow(Error);
  });

  test('throw error if ship not fit horizantialy', () => {
    expect(() => grid.setShipOnArea(4, { row: 1, col: 2 }, 'h')).toThrow(Error);
    expect(() => grid.setShipOnArea(0, { row: 1, col: 6 }, 'h')).toThrow(Error);
  });

  test('throw error if ship not fit vertically', () => {
    expect(() => grid.setShipOnArea(3, { row: 1, col: 2 }, 'v')).toThrow(Error);
    expect(() => grid.setShipOnArea(0, { row: 4, col: 6 }, 'v')).toThrow(Error);
  });

  test('return true if ship set up successfully', () => {
    expect(grid.setShipOnArea(4, { row: 1, col: 1 }, 'h')).toBeTruthy;
    expect(grid.setShipOnArea(3, { row: 0, col: 0 }, 'v')).toBeTruthy;
    expect(grid.setShipOnArea(2, { row: 3, col: 2 }, 'h')).toBeTruthy;
  });

  test('throw error if ship overlapped', () => {
    expect(() => grid.setShipOnArea(1, { row: 3, col: 3 }, 'h')).toThrow('overlapped');
    expect(() => grid.setShipOnArea(1, { row: 0, col: 1 }, 'v')).toThrow('overlapped');
  });
});

describe('Shoot test', () => {
  const fleet = new Fleet();
  let ship;

  for (let i in shipData) {
    ship = new Ship(shipData[i].id, shipData[i].name, shipData[i].length);
    fleet.addShip(ship);
  }
  const grid = new Grid(5, 7, fleet);

  // set the ship one by one
  // rows and cols are 0 indexed
  grid.setShipOnArea(4, { row: 1, col: 1 }, 'h');
  grid.setShipOnArea(3, { row: 0, col: 0 }, 'v');
  grid.setShipOnArea(2, { row: 3, col: 2 }, 'h');

  test('return isHit:true if shot hit, false if it is miss', () => {
    expect(grid.shooted({ row: 3, col: 2 })).toMatchObject({ isHit: true });
    expect(grid.shooted({ row: 4, col: 0 })).toMatchObject({ isHit: true });
    expect(grid.shooted({ row: 2, col: 3 })).toMatchObject({ isHit: false });
    expect(grid.shooted({ row: 3, col: 1 })).toMatchObject({ isHit: false });
  });

  test('return sunkShip with id if ship sunk', () => {
    expect(grid.shooted({ row: 3, col: 3 })).toMatchObject({ isHit: true });
    expect(grid.shooted({ row: 3, col: 4 })).toMatchObject({ isHit: true });
    expect(grid.shooted({ row: 3, col: 5 }).shipSunk.id).toEqual(expect.any(Number));
  });
});
