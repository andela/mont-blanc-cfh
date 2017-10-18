/**
 * Generic require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    var token = req.body.token || req.headers['x-token'] || req.params.token;
    if (token) {
      jwt.verify(token, config.token, function(err, decoded) {
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
};

/**
 * User authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
            return res.send(401, 'User is not authorized');
        }
        next();
    }
};

/**
 * Article authorizations routing middleware
 */
// exports.article = {
//     hasAuthorization: function(req, res, next) {
//         if (req.article.user.id != req.user.id) {
//             return res.send(401, 'User is not authorized');
//         }
//         next();
//     }
// };