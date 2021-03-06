import expect from 'expect';

import should from 'should';
import io from 'socket.io-client';


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
      setTimeout(disconnect, 10);
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
      setTimeout(disconnect, 10);
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
      setTimeout(disconnect, 10);
    });
  });


  it('Should change game state to waiting for czar to draw card when 3 players are in the game', (done) => {
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
      disconnect();
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
          expectStartGame();
        });
      });
    });
  });

  it('Should change game state to waiting for players to pick card', (done) => {
    let client2, client3;
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };

    const expectDrawCard = () => {
      client1.emit('drawCard');
      client1.on('gameUpdate', (gameData) => {
        gameData.state.should.equal('waiting for players to pick');
      });
      setTimeout(disconnect, 10);
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
          setTimeout(expectDrawCard, 10);
        });
      });
    });
  });


  it('Should change game state to waiting for czar to draw card when 6 players are in the game', (done) => {
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
      client1.emit('startGame', {
        locationId: 1
      });
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
      setTimeout(disconnect, 10);
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
                    setTimeout(expectStartGame, 10);
                  });
                });
              });
            });
          });
        }
      });
    });
  });


  it('Should send message to client 2 when a message is emitted by client 1', (done) => {
    let client2, client3;
    const payLoad = {
      avatar: 'avatar',
      username: 'jack sparrow',
      message: 'hello',
      timeSent: '12:45:09 PM'
    };
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };

    const sendMessage = () => {
      client1.emit('new message', payLoad);
      client2.on('add message', (messageBank) => {
        expect(messageBank).toEqual(payLoad);
        messageBank.avatar.should.equal('avatar');
        messageBank.username.should.equal('jack sparrow');
        messageBank.message.should.equal('hello');
        messageBank.timeSent.should.equal('12:45:09 PM');
      });
      setTimeout(disconnect, 10);
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
          setTimeout(sendMessage, 10);
        });
      });
    });
  });
  it('Should send message to two clients when a message is sent by client 2', (done) => {
    let client2, client3;
    const payLoad = {
      avatar: 'avatar',
      username: 'jack sparrow',
      message: 'hello',
      timeSent: '12:45:09 PM'
    };
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };

    const sendMessage = () => {
      client2.emit('new message', payLoad);
      client1.on('add message', (messageBank) => {
        expect(messageBank).toEqual(payLoad);
        messageBank.avatar.should.equal('avatar');
        messageBank.username.should.equal('jack sparrow');
        messageBank.message.should.equal('hello');
        messageBank.timeSent.should.equal('12:45:09 PM');
      });
      client3.on('add message', (messageBank) => {
        expect(messageBank).toEqual(payLoad);
        messageBank.avatar.should.equal('avatar');
        messageBank.username.should.equal('jack sparrow');
        messageBank.message.should.equal('hello');
        messageBank.timeSent.should.equal('12:45:09 PM');
      });
      setTimeout(disconnect, 10);
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
          setTimeout(sendMessage, 10);
        });
      });
    });
  });

  it('Should not send message to client 1 if not in socket sync with client 2', (done) => {
    let client2, client3;
    const payLoad = {
      avatar: 'avatar',
      username: 'jack sparrow',
      message: 'hello',
      timeSent: '12:45:09 PM'
    };
    const client1 = io.connect(socketURL, options);
    const disconnect = () => {
      client1.disconnect();
      client2.disconnect();
      client3.disconnect();
      done();
    };

    const sendMessage = () => {
      client2.emit('new message', payLoad);
      client1.on('add mes', (messageBank) => {
        const {
          avatar,
          username,
          message,
          timeSent
        } = messageBank;
        expect(messageBank).toEqual(payLoad);
        expect(avatar).toNotBe('avatar');
        expect(username).toNotBe('jac row');
        expect(message).toNotBe('hello');
        expect(timeSent).toNotBe('12:55:09 PM');
      });
      setTimeout(disconnect, 10);
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
          setTimeout(sendMessage, 10);
        });
      });
    });
  });
});
