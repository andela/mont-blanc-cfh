angular.module('mean.system')
  .controller('IndexController', ['$scope', 'Global', '$location', '$http', '$window', 'socket', 'game', 'AvatarService', '$cookies',
    function (
      $scope, Global, $location, $http,
      $window, socket, game, AvatarService, $cookies
    ) {
      $scope.checkCookie = () => {
        if ($cookies.token) {
          $window.localStorage.setItem('token', $cookies.token);
          $http.defaults.headers.common['x-token'] = $cookies.token;
        }
      };
      $scope.checkCookie();
      $scope.global = Global;
      $scope.data = {};

      $scope.playAsGuest = function () {
        game.joinGame();
        $location.path('/app');
      };

      $scope.showError = function () {
        if ($location.search().error) {
          return $location.search().error;
        }
        return false;
      };

      const setTokenHeader = (token) => {
        if (token) {
          $window.localStorage.setItem('token', token);
          $http.defaults.headers.common['x-token'] = token;
          $location.path('/#!');
        } else {
          $window.localStorage.removeItem('token');
          $http.defaults.headers.common['x-token'] = '';
        }
      };
      $scope.signUp = () => {
        fetch('/api/v1/auth/signup', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify($scope.data)
        }).then(user => user.json()).then((res) => {
          if (res.token) {
            setTokenHeader(res.token);
          } else {
            $scope.showMessage = res.message;
          }
        }).catch((error) => {
        });
      };
      $scope.logIn = () => {
        fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify($scope.data)
        }).then(user => user.json()).then((res) => {
          if (res.token) {
            setTokenHeader(res.token);
          } else {
            $scope.showMessage = res.message;
          }
        }).catch((error) => {
        });
      };

      $scope.signOut = () => {
        setTokenHeader();
        $cookies.token = '';
        $location.path('/#!');
      };

      $scope.avatars = [];
      AvatarService.getAvatars()
        .then((data) => {
          $scope.avatars = data;
        });
    }]);
