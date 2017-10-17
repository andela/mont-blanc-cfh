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
    $scope.signUp = function() {
      $http.post('api/auth/signup',JSON.stringify($scope.data)).then( function(user){
        if (user.data.token){
          $window.localStorage.setItem('token', user.data.token);
          $http.defaults.headers.common['x-token'] = 'Bearer ' + user.data.token;
          $location.path('/#!');
        } else{
          $scope.showMessage = 'Cannot sign up';
        }
      }).catch( function(error){
        $scope.showMessage = error;
      }); 
    };

    $scope.signOut = function() {
      $window.localStorage.removeItem('token');
      $http.defaults.headers.common['x-token'] = '';
    };

    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

}]);