(function () {
    angular.module('ticTacToeApp', [])
        .controller('TicTacToeController', ['$scope', TicTacToeController]);
    angular.element(document).ready(function () {
        angular.bootstrap(document, ['ticTacToeApp']);
    });
})();
