import jwt from 'jsonwebtoken';
import { token as secret } from '../env/all';

/**
 * Generic require login routing middleware
 * @returns {object} response object
 * @export
 * @param {any} req
 * @param {any} res
 * @param {any} next
 */
export function requiresLogin(req, res, next) {
  const token = req.body.token || req.headers['x-token'] || req.params.token;
  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Expired token' });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({ message: 'Token not provided' });
  }
}


/**
 * User authorizations routing middleware
 */
export const user = {
  hasAuthorization(req, res, next) {
    if (req.profile.id !== req.user.id) {
      return res.status(401).send('User is not authorized');
    }
    next();
  }
};
