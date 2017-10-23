angular.module('mean.system')
.controller('IndexController', ['$scope', 'Global', '$location', '$http', '$window', 'socket', 'game', 'AvatarService',
  function ($scope, Global, $location, $http,
    $window, socket, game, AvatarService) {

    $scope.global = Global;
    $scope.data = {};

    $scope.playAsGuest = function() {
      game.joinGame();
      $location.path('/app');
    };

    $scope.showError = function() {
      if ($location.search().error) {
        return $location.search().error;
      } else {
        return false;
      }
    };

    const setTokenHeader = (token) => {
      if(token){
        $window.localStorage.setItem('token', token);
        $http.defaults.headers.common['x-token'] = token;
        $location.path('/#!');
      } else{
        $window.localStorage.removeItem('token');
        $http.defaults.headers.common['x-token'] = '';
      }
    };
    $scope.signUp = () => {
      $http.post('/api/v1/auth/signup', JSON.stringify($scope.data)).then((user) =>{
        if (user.data.token){
          setTokenHeader(user.data.token);
        } else{
          $scope.showMessage = 'Token not provided';
        }
      }).catch((error) => {
        $scope.showMessage = error;
      }); 
    };

    $scope.signOut = () => {
      setTokenHeader();
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

}]);