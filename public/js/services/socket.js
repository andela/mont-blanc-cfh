angular.module('mean.system')
  .factory('socket', ['$rootScope', function ($rootScope) {
    const socket = io.connect();
    return {
      on(eventName, callback) {
        socket.on(eventName, (...args) => {
          $rootScope.safeApply(() => {
            callback.apply(socket, args);
          });
        });
      },
      emit(eventName, data, callback, ...args) {
        socket.emit(eventName, data, () => {
        });
        $rootScope.safeApply(() => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      },
      removeAllListeners(eventName, callback) {
        socket.removeAllListeners(eventName, (...args) => {
          $rootScope.safeApply(() => {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }
    };
  }]);
