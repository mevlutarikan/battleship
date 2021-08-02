const { gameList } = require('./config');
var clients = {};
/**
 * create socket.io server mount express
 */
module.exports = (expServer) => {
  io = require('socket.io')(expServer);

  io.on('connection', (socket) => {
    clients[socket.id] = socket;

    socket.on('disconnect', function () {
      delete clients[socket.id];
    });

    socket.on('start', (gameID, playerIndex) => {
      gameList[gameID].player[playerIndex].hasStarted = true;
      socket.join(gameID);
      socket.to(gameID).emit('start', `Opponent is ready to start`);

      if (gameList[gameID].player[0].hasStarted && gameList[gameID].player[1].hasStarted) {
        socket.to(gameID).emit('start', 'Game Starts');
      }
    });
    /**
     * @param {number} gameID- game id
     * @param {number} playerIndex- what index of player shoots
     * @param {object} target - row and column number of target coordinates
     * {row:number,col:number} row and col are 0 indexed
     * @result { object } - game state or winner
     */
    socket.on('shoot', (gameID, playerIndex, target) => {
      let shootRes = gameList[gameID].shoot(playerIndex, target);
      if (shootRes.msj) socket.to(socket.id).emit('res', result);
      socket.to(gameID).emit('res', shootRes);
      if (shootRes.gameOver) {
        delete gameList[gameID];
      }
    });
  });
};
