const should = require('should');
const io = require('socket.io-client');

const socketURL = 'http://localhost:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};


describe('Game Server', () => {
  it('Should accept requests to joinGame', (done) => {
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', {
        userID: 'unauthenticated',
        room: '',
        createPrivate: false
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should send a game update upon receiving request to joinGame', (done) => {
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', {
        userID: 'unauthenticated',
        room: '',
        createPrivate: false
      });
      client1.on('gameUpdate', (gameData) => {
        gameData.gameID.should.match(/\d+/);
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should announce new user to all users', (done) => {
    const client1 = io.connect(socketURL, options);
    let client2;
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      done();
    };
    client1.on('connect', () => {
      client1.emit('joinGame', {
        userID: 'unauthenticated',
        room: '',
        createPrivate: false
      });
      client2 = io.connect(socketURL, options);
      client2.on('connect', () => {
        client2.emit('joinGame', {
          userID: 'unauthenticated',
          room: '',
          createPrivate: false
        });
        client1.on('notification', (gameData) => {
          gameData.notification.should.match(/ has joined the game!/);
        });
      });
      setTimeout(disconnect, 200);
    });
  });

  it('Should start game when startGame event is sent with 3 players', (done) => {
    let client2, client3;
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };
    const expectStartGame = () => {
      client1.emit('startGame');
      client1.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client2.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client3.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', () => {
      client1.emit('joinGame', {
        userID: 'unauthenticated',
        room: '',
        createPrivate: false
      });
      client2 = io.connect(socketURL, options);
      client2.on('connect', () => {
        client2.emit('joinGame', {
          userID: 'unauthenticated',
          room: '',
          createPrivate: false
        });
        client3 = io.connect(socketURL, options);
        client3.on('connect', () => {
          client3.emit('joinGame', {
            userID: 'unauthenticated',
            room: '',
            createPrivate: false
          });
          setTimeout(expectStartGame, 100);
        });
      });
    });
  });

  it('Should automatically start game when 6 players are in a game', (done) => {
    let client2, client3, client4, client5, client6;
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      client4.disconnect();
      client5.disconnect();
      client6.disconnect();
      done();
    };
    const expectStartGame = () => {
      client1.emit('startGame');
      client1.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client2.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client3.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client4.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client5.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      client6.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for czar to draw a card');
      });
      setTimeout(disconnect, 200);
    };
    client1.on('connect', () => {
      client1.emit('joinGame', {
        userID: 'unauthenticated',
        room: '',
        createPrivate: true
      });
      let connectOthers = true;
      client1.on('gameUpdate', (gameData) => {
        const {
          gameID
        } = gameData;
        if (connectOthers) {
          client2 = io.connect(socketURL, options);
          connectOthers = false;
          client2.on('connect', () => {
            client2.emit('joinGame', {
              userID: 'unauthenticated',
              room: gameID,
              createPrivate: false
            });
            client3 = io.connect(socketURL, options);
            client3.on('connect', () => {
              client3.emit('joinGame', {
                userID: 'unauthenticated',
                room: gameID,
                createPrivate: false
              });
              client4 = io.connect(socketURL, options);
              client4.on('connect', () => {
                client4.emit('joinGame', {
                  userID: 'unauthenticated',
                  room: gameID,
                  createPrivate: false
                });
                client5 = io.connect(socketURL, options);
                client5.on('connect', () => {
                  client5.emit('joinGame', {
                    userID: 'unauthenticated',
                    room: gameID,
                    createPrivate: false
                  });
                  client6 = io.connect(socketURL, options);
                  client6.on('connect', () => {
                    client6.emit('joinGame', {
                      userID: 'unauthenticated',
                      room: gameID,
                      createPrivate: false
                    });
                    setTimeout(expectStartGame, 100);
                  });
                });
              });
            });
          });
        }
      });
    });
  });
});
