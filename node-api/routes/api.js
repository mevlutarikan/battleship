var express = require('express');
var router = express.Router();
const Game = require('../classes/game');
const { gameList } = require('../utils/config');

router.get('/create-game', function (req, res, next) {
  // simple way to create nonsecure short id
  // use npm package "uuid" or "short-uuid" to produce secure unique id
  const gameID = new Date().getTime().toString(36);
  const game = new Game(gameID);
  req.session.gameID = gameID;
  game.checkInPlayer(req.sessionID);
  gameList[gameID] = game;
  res.json({ gameID: gameID, ...game.player[0].grid });
});

router.get('/join-game/:gameID', function (req, res, next) {
  if (!gameList[req.params.gameID]) {
    res.status(400).json({ err: `There is no game with a ID of <${req.params.gameID}>` });
    return;
  }
  try {
    gameList[req.params.gameID].checkInPlayer(req.sessionID);
    req.session.gameID = req.params.gameID;
    res.json({ msj: 'Game Ready to set up ships' });
  } catch (e) {
    res.sta;

    tus(400).json({ err: e.message });
  }
});

router.get('/get-grid', function (req, res, next) {
  if (!req.session.gameID && !gameList[req.session.gameID]) {
    res.status(400).json({ err: `No Game Session` });
    return;
  }

  const player = gameList[req.session.gameID].player.find((pl) => pl.sessionID == req.sessionID);
  res.json(player.grid);
});

/**
 * set up the ship to grid
 *
 * request {
 * shipIndex:number- index of ship int the fleet.ships[],
 * location: {row:number,col:number} row and col are 0 indexed
 * direction:{'v'|'h'}ship way- h for horizantal, v for vertical
 * }
 * response {player.grid}
 */
router.post('/set-ship', function (req, res, next) {
  if (!req.session.gameID && !gameList[req.session.gameID]) {
    res.status(400).json({ err: `No Game Session` });
    return;
  }
  const game = gameList[req.session.gameID];
  const player = game.player.find((pl) => pl.sessionID == req.sessionID);
  const { shipIndex, location, direction } = req.body;

  try {
    player.grid.setShipOnArea(shipIndex, location, direction);
    res.json(player.grid);
  } catch (e) {
    res.status(400).json({ err: e.message });
  }
});

router.post('/set-socked-id-to-session', function (req, res, next) {
  req.session.socketID = req.body.socketID;
});

router.get('/get-games', function (req, res, next) {
  let response = [];
  Object.keys(gameList).forEach((key) => {
    if (!gameList[key].player[1].sessionID) {
      response.push({ gameID: key, player1: gameList[key].player[0].sessionID });
    }
  });
  res.json(response);
});

module.exports = router;
