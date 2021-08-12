const gameList = {};
module.exports = {
  shipTypes: {
    Scout: { length: 2 },
    Cruiser: { length: 3 },
    Battleship: { length: 4 },
    Carrier: { length: 5 },
    Aircraft: { length: 6 },
  },
  fleet: ['Aircraft', 'Carrier', 'Battleship', 'Battleship', 'Cruiser', 'Scout', 'Scout'],
  grid: { rows: 6, columns: 8 },
  gameList: gameList,
};
