import mongoose from 'mongoose';
import config from '../../config/config';

const Schema = mongoose.Schema;

/**
* Game Schema
*/
const GameSchema = new Schema({
  userID: [],
  gameID: String,
  gamePlayers: [],
  gameRound: Number,
  gameWinner: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Game', GameSchema);
