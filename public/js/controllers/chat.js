angular.module('mean.system')
  .controller('chat', ['$scope', 'socket', 'game', ($scope, socket, game) => {
    $scope.chatLoading = true;
    $scope.messageBank = [];
    $scope.message = '';
    $scope.ChatFlex = false;
    $scope.unreadMessage = '';
    $scope.chatNotificationColor = '#45bf08';
    $scope.chatDisplay = 'none';

    // Toggles chat pane
    $scope.toggleChat = () => {
      $scope.unreadMessage = '';
      if ($scope.chatDisplay === 'none') {
        $scope.ChatFlex = true;
        $scope.chatNotificationColor = '#45bf08';
        $scope.chatDisplay = 'block';
      } else {
        $scope.ChatFlex = false;
        $scope.chatDisplay = 'none';
      }
    };

    // This method makes opens and close the chat screen
    $scope.chatPanelCrtl = () => {
      $scope.unreadMessage = '';
      if ($scope.ChatFlex === false) {
        $scope.chatNotificationColor = '#45bf08';
        $scope.ChatFlex = true;
      } else {
        $scope.chatNotificationColor = '#45bf08';
        $scope.ChatFlex = false;
      }
    };

    // This methopd controls chat slider to scrow down
    $scope.downScrollPane = () => {
      $('.msg_container_base').stop().animate({
        scrollTop: $('.msg_container_base')[0].scrollHeight
      }, 1000);
    };

    // this method listens to enter key event and adds message to messageBank array
    $scope.enterMessage = (keyEvent) => {
      if (keyEvent.which === 13) {
        $scope.player = game.players[game.playerIndex];
        $scope.payLoad = {
          avatar: $scope.player.avatar,
          username: $scope.player.username,
          message: $scope.message,
          timeSent: new Date(Date.now()).toLocaleTimeString({
            hour12: true
          })
        };
        if ($scope.message !== '') {
          $scope.messageBank.push($scope.payLoad);
          socket.emit('new message', $scope.payLoad);
        }
        $scope.downScrollPane();
        $scope.message = '';
      }
    };

    // loads chat when user newly joins room
    socket.on('loadChat', (messages) => {
      $scope.chatLoading = false;
      if (messages.length !== 0) {
        $scope.messageBank = messages;
      }

      if (messages.length === 0) {
        const msg = game.players[game.playerIndex];
        $scope.messageBank.push({
          avatar: '',
          username: '',
          message: '',
          timeSent: ''
        });
      }
    });

    // Listen for newly recieved messages and push new message to the view
    socket.on('add message', (messageBank) => {
      if ($scope.ChatFlex === false) {
        $scope.chatNotificationColor = '#d95450';
        $scope.unreadMessage++;
      }
      $scope.messageBank.push({
        avatar: messageBank.avatar,
        username: messageBank.username,
        message: messageBank.message,
        timeSent: messageBank.timeSent
      });
      setTimeout(() => {
        $scope.downScrollPane();
      }, 200);
    });
  }]);
