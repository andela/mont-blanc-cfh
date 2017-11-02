export default [{
  app: {
    name: 'Cards for Humanity - Development'
  },
  facebook: {
    clientID: process.env.facebookID,
    clientSecret: process.env.facebookSecret,
    callbackURL: process.env.callback
  },
  twitter: {
    clientID: process.env.twitterID,
    clientSecret: process.env.twitterSecret,
    callbackURL: process.env.callback
  },
  github: {
    clientID: process.env.githubID,
    clientSecret: process.env.githubSecret,
    callbackURL: process.env.callback
  },
  google: {
    clientID: process.env.googleID,
    clientSecret: process.env.googleSecret,
    callbackURL: process.env.callback
  }
}];
