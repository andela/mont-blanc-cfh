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

    var validation = function(token){
      if(token){
        $window.localStorage.setItem('token', token);
        $http.defaults.headers.common['x-token'] = 'Bearer ' + token;
        $location.path('/#!');
      } else{
        $window.localStorage.removeItem('token');
        $http.defaults.headers.common['x-token'] = '';
      }
    }
    $scope.signUp = function() {
      $http.post('api/auth/signup',JSON.stringify($scope.data)).then( function(user){
        if (user.data.token){
          validation(user.data.token, 'signup')
        } else{
          $scope.showMessage = 'Token not provided';
        }
      }).catch( function(error){
        $scope.showMessage = error;
      }); 
    };

    $scope.signOut = function() {
     validation()
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

}]);