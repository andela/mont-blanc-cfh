import mongoose from 'mongoose';
import Game from '../models/game';

/**
 * Saves game log when game session ends
 * @returns {object} description
 * @export { function }
 * @param {object} req
 * @param {object} res
 */
export const createGameLogs = (req, res) => {
  // save game if user is authenticated
  if (req.decoded && req.params.id) {
    const game = new Game(req.body);
    game.userID = req.decoded._id;
    game.gameID = req.params.id;
    game.save((error) => {
      if (error) {
        return res.status(400).send({
          message: 'Fail... game logs not saved'
        });
      }
      return res.status(201).send({
        message: 'Success... game logs saved'
      });
    });
  }
};

/**
 * Sorted winners function
 * @returns {Object} array showing the winners and the frequency of wins
 * @param {Object} gameWinners
 */
const sortWinners = (gameWinners) => {
  const sortedWinners = {};
  gameWinners.forEach((index) => {
    sortedWinners[index] = (sortedWinners[index] || 0) + 1;
  });
  return sortedWinners;
};

/**
 * getGameWinners function
 * @returns {Object} array of the individual game winners
 * @param {Object} gameResults
 */
const getGameWinners = (gameResults) => {
  const gameWinners = [];
  gameResults.forEach((gameResult) => {
    gameWinners.push(gameResult.gameWinner);
  });
  return gameWinners;
};

/**
 * getLeaderBoard function
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} game response
 */
export const getLeaderboard = (req, res) => {
  Game.aggregate([{
    $group: {
      _id: '$gameID',
      gameID: {
        $first: '$gameID'
      },
      gameWinner: {
        $first: '$gameWinner'
      },
      gamePlayers: {
        $first: '$gamePlayers'
      }
    }
  }], (error, gameResults) => {
    if (error) {
      res.json({
        message: 'Game leaderboard not successfully retrieved',
        success: false,
        error
      });
      return;
    }
    if (gameResults.length === 0) {
      res.json({
        message: 'No leaderboard available',
        success: true
      });
      return;
    }
    const gameWinners = getGameWinners(gameResults);
    const leaderboard = sortWinners(gameWinners);
    res.send(200, {
      message: 'Game leaderboard successfully retrieved',
      success: true,
      leaderboard
    });
  });
};
