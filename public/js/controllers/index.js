angular.module('mean.system')
.controller('IndexController', 
['$scope', 'Global','$http','$window', '$location', 'socket', 'game', 'AvatarService',
function ($scope, Global,$http, $window, $location, socket, game, AvatarService) {
    $scope.global = Global;
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
    $scope.logIn = function() {
      $http.post('api/auth/login',JSON.stringify($scope.data)).then(function(resp, err) {
        if (resp) {
          $window.localStorage.setItem('token', resp.data.token);
          $http.defaults.headers.common['x-token'] = 'Bearer ' + resp.data.token;
          $location.path('/');
          $window.location.reload();
        }else{
          if(err){
            console.log(err)
          }
        }
      });
    };
    $scope.signOut = function() {
      $window.localStorage.removeItem('token');
      $http.defaults.headers.common['x-token'] = '';
    }
    $scope.avatars = [];
    AvatarService.getAvatars()
      .then(function(data) {
        $scope.avatars = data;
      });

}]);