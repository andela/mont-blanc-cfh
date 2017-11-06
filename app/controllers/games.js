import mongoose from 'mongoose';
import Game from '../models/game';

/**
 * Saves game log when game session ends
 * @returns {object} description
 * @export { function }
 * @param {object} req
 * @param {object} res
 */
const createGameLogs = (req, res) => {
// save game if user is authenticated
  if (req.decoded && req.params.id) {
    const game = new Game(req.body);
    game.userID = req.decoded._id;
    game.gameID = req.params.id;
    game.save((error) => {
      if (error) return res.status(400).send({ message: 'Fail... game logs not saved' });
      return res.status(201).send({ message: 'Success... game logs saved' });
    });
  }
};

export default createGameLogs;
