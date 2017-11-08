export default {
  port: 3001,
  app: {
    name: 'Cards for Humanity - Development'
  },
  facebook: {
    clientID: process.env.facebookID,
    clientSecret: process.env.facebookSecret,
    callbackURL: process.env.facebookCallback
  },
  twitter: {
    clientID: process.env.twitterID,
    clientSecret: process.env.twitterSecret,
    callbackURL: process.env.twitterCallback
  },
  github: {
    clientID: process.env.githubID,
    clientSecret: process.env.githubSecret,
    callbackURL: process.env.githubCallback
  },
  google: {
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: process.env.googleCallback
  }
};
