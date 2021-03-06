import mongoose from 'mongoose';
import firebase from 'firebase';
import consoleStamp from 'console-stamp';
import Game from './game';
import Player from './player';
import {
  all
} from '../../app/controllers/avatars';
import config from '../fireBaseConfig';

consoleStamp(console, 'm/dd HH:MM:ss');
const User = mongoose.model('User');
const avatars = all();

// Valid characters to use to generate random private game IDs
const chars = process.env.RANDOM_CHARACTERS;
// Initialize firebase
firebase.initializeApp(config);

const database = firebase.database();

export default (io) => {
  const allGames = {};
  const allPlayers = {};
  const gamesNeedingPlayers = [];
  let gameID = 0;

  const createGameWithFriends = (player, socket) => {
    let isUniqueRoom = false;
    let uniqueRoom = '';
    // Generate a random 6-character game ID
    while (!isUniqueRoom) {
      uniqueRoom = '';
      for (let i = 0; i < 6; i += 1) {
        uniqueRoom += chars[Math.floor(Math.random() * chars.length)];
      }
      if (!allGames[uniqueRoom] && !(/^\d+$/).test(uniqueRoom)) {
        isUniqueRoom = true;
      }
    }
    const game = new Game(uniqueRoom, io);
    allPlayers[socket.id] = true;
    game.players.push(player);
    allGames[uniqueRoom] = game;
    socket.join(game.gameID);
    socket.gameID = game.gameID;
    game.assignPlayerColors();
    game.assignGuestNames();
    game.sendUpdate();
  };

  const fireGame = (player, socket) => {
    let game;
    if (gamesNeedingPlayers.length <= 0) {
      gameID += 1;
      const gameIDStr = gameID.toString();
      game = new Game(gameIDStr, io);
      allPlayers[socket.id] = true;
      game.players.push(player);
      allGames[gameID] = game;
      gamesNeedingPlayers.push(game);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
    } else {
      [game] = gamesNeedingPlayers;
      allPlayers[socket.id] = true;
      game.players.push(player);
      socket.join(game.gameID);
      socket.gameID = game.gameID;
      game.assignPlayerColors();
      game.assignGuestNames();
      game.sendUpdate();
      game.sendNotification(`${player.username} has joined the game!`);
      if (game.players.length >= game.playerMaxLimit) {
        gamesNeedingPlayers.shift();
      }
    }
  };

  const getGame = (player, socket, requestedGameId, createPrivate) => {
    requestedGameId = requestedGameId || '';
    createPrivate = createPrivate || false;
    if (requestedGameId.length && allGames[requestedGameId]) {
      const game = allGames[requestedGameId];
      // Ensure that the same socket doesn't try to join the same game
      // This can happen because we rewrite the browser's URL to reflect
      // the new game ID, causing the view to reload.
      // Also checking the number of players, so node doesn't crash when
      // no one is in this custom room.
      if (game.state === 'awaiting players' && (!game.players.length ||
        game.players[0].socket.id !== socket.id) && (game.players.length < game.playerMaxLimit)) {
        // Put player into the requested game
        allPlayers[socket.id] = true;
        game.players.push(player);
        socket.join(game.gameID);
        socket.gameID = game.gameID;
        game.assignPlayerColors();
        game.assignGuestNames();
        game.sendUpdate();
        game.sendNotification(`${player.username} has joined the game!`);
        if (game.players.length >= game.playerMaxLimit) {
          gamesNeedingPlayers.shift();
        }
      } else {
        // TODO: Send an error message back to this user saying the game has already started
        socket.emit('roomFilled');
      }
    } else {
      // Put players into the general queue
      if (createPrivate) {
        createGameWithFriends(player, socket);
      } else {
        fireGame(player, socket);
      }
      return 'Redirecting player';
    }
  };

  const joinGame = (socket, data) => {
    const player = new Player(socket);
    data = data || {};
    player.userID = data.userID || 'unauthenticated';
    if (data.userID !== 'unauthenticated') {
      User.findOne({
        _id: data.userID
      }).exec((err, user) => {
        if (err) {
          return err; // Hopefully this never happens.
        }
        if (!user) {
          // If the user's ID isn't found (rare)
          player.username = 'Guest';
          player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
        } else {
          player.username = user.name;
          player.premium = user.premium || 0;
          player.avatar = user.avatar || avatars[Math.floor(Math.random() * 4) + 12];
        }
        getGame(player, socket, data.room, data.createPrivate);
      });
    } else {
      // If the user isn't authenticated (guest)
      player.username = 'Guest';
      player.avatar = avatars[Math.floor(Math.random() * 4) + 12];
      getGame(player, socket, data.room, data.createPrivate);
    }
  };

  const exitGame = (socket) => {
    if (allGames[socket.gameID]) { // Make sure game exists
      const game = allGames[socket.gameID];
      delete allPlayers[socket.id];
      // it removes stored messages when number of players online is less than two
      if (game.players.length < 2) {
        database.ref(`chatStore/${socket.gameID}/`).remove();
      }
      if (game.state === 'awaiting players' ||
        game.players.length - 1 >= game.playerMinLimit) {
        game.removePlayer(socket.id);
      } else {
        game.stateDissolveGame();
        for (let j = 0; j < game.players.length; j += 1) {
          game.players[j].socket.leave(socket.gameID);
        }
        game.killGame();
        // it removes stored messages if game session is ended
        database.ref(`chatStore/${socket.gameID}/`).remove();
        delete allGames[socket.gameID];
      }
    }
    socket.leave(socket.gameID);
  };

  io.sockets.on('connection', (socket) => {
    socket.emit('id', {
      id: socket.id
    });
    // loads snapshot of messages stored in for a particular game session
    setTimeout(() => database.ref(`chatStore/${socket.gameID}/`).once('value', (snapshot) => {
      const savedMessages = [];

      snapshot.forEach((message) => {
        savedMessages.push(message.toJSON());
      });
      socket.emit('loadChat', savedMessages);
    }), 300);

    // Emit message to other players and push message to firbase database
    socket.on('new message', (message) => {
      socket.broadcast.to(socket.gameID).emit('add message', message);

      database.ref(`chatStore/${socket.gameID}/`).push(message);
    });

    socket.on('pickCards', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickCards(data.cards, socket.id);
      } else {
        return ('Received pickCard from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('pickWinning', (data) => {
      if (allGames[socket.gameID]) {
        allGames[socket.gameID].pickWinning(data.card, socket.id);
      } else {
        return ('Received pickWinning from', socket.id, 'but game does not appear to exist!');
      }
    });

    socket.on('joinGame', (data) => {
      if (!allPlayers[socket.id]) {
        joinGame(socket, data);
      }
    });

    socket.on('joinNewGame', (data) => {
      exitGame(socket);
      joinGame(socket, data);
    });

    socket.on('startGame', (data) => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        thisGame.locationId = data.locationId;
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach((game, index) => {
            if (game.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.prepareGame();
          thisGame.sendNotification('The game has begun!');
        }
      }
    });

    socket.on('drawCard', () => {
      if (allGames[socket.gameID]) {
        const thisGame = allGames[socket.gameID];
        if (thisGame.players.length >= thisGame.playerMinLimit) {
          // Remove this game from gamesNeedingPlayers so new players can't join it.
          gamesNeedingPlayers.forEach((game, index) => {
            if (game.gameID === socket.gameID) {
              return gamesNeedingPlayers.splice(index, 1);
            }
          });
          thisGame.drawCard();
          thisGame.sendNotification('Players should select their answers!');
        }
      }
    });

    socket.on('leaveGame', () => {
      exitGame(socket);
    });

    socket.on('disconnect', () => {
      exitGame(socket);
    });
  });
};
