const gameList = {};
module.exports = {
  shipTypes: {
    Scout: { lenght: 2 },
    Cruiser: { lenght: 3 },
    Battleship: { lenght: 4 },
    Carrier: { lenght: 5 },
    Aircraft: { lenght: 6 },
  },
  fleet: ['Aircraft', 'Carrier', 'Battleship', 'Battleship', 'Cruiser', 'Scout', 'Scout'],
  grid: { rows: 6, columns: 8 },
  gameList: gameList,
};
