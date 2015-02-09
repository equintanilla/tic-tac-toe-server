function TicTacToeController($scope) {
    this.$scope = $scope;

    this.$scope.$watch(angular.bind(this, function () {
        return this.game ? this.game.currentPlayerMark : null;
    }), angular.bind(this, function (newVal) {
        this.turn = newVal;
        if (newVal == this.cpuPlayerMark) {
            this.$scope.$emit(TicTacToeController.Events.REQUEST_MOVE_TO_CPU);
        }
    }));

    this.newGame(true);

    this.$scope.$on(TicTacToeController.Events.REQUEST_MOVE_TO_CPU, angular.bind(this, function (event, data) {
        var move = this.cpuPlayer.getMove(this.game.getGameBoard());
        this.$scope.$emit(TicTacToeController.Events.CPU_MOVE_PROVIDED, move.action);
    }));
    this.$scope.$on(TicTacToeController.Events.CPU_MOVE_PROVIDED, angular.bind(this, function (event, moveAction) {
        this.game.makeMove(moveAction.rowNumber, moveAction.columnNumber);
    }));


}

TicTacToeController.prototype.newGame = function (onInit) {
    this.game = null;
    this.game = new ticTacToe.TicTacToeGame();
    this.xPlayerAgent = Math.random() > .5 ? TicTacToeController.CPU : TicTacToeController.HUMAN;
    this.cpuPlayerMark = this.xPlayerAgent == TicTacToeController.CPU ? ticTacToe.TicTacToeBoard.X : ticTacToe.TicTacToeBoard.O;
    this.oPlayerAgent = this.xPlayerAgent == TicTacToeController.HUMAN ? TicTacToeController.CPU : TicTacToeController.HUMAN;
    this.humanPlayerMark = this.oPlayerAgent == TicTacToeController.HUMAN ? ticTacToe.TicTacToeBoard.O : ticTacToe.TicTacToeBoard.X;
    this.boardArray = this.game.getGameBoard().getBoardArray();

    this.cpuPlayer = new ticTacToe.TicTacToeComputerPlayer(this.cpuPlayerMark);
    this.humanPlayer = new ticTacToe.TicTacToeHumanPlayer(this.humanPlayerMark);
    if (!onInit && this.game.currentPlayerMark == this.cpuPlayerMark) {
        this.$scope.$emit(TicTacToeController.Events.REQUEST_MOVE_TO_CPU);

    }


};

TicTacToeController.Events = {
    REQUEST_MOVE_TO_CPU: "requestMoveToCpu",
    CPU_MOVE_PROVIDED: "cpuMoveProvided"
};

TicTacToeController.prototype.onUserClickingCell = function (rowNumber, columnNumber) {
    if (this.turn === this.humanPlayerMark && !this.boardArray[rowNumber][columnNumber]) {
        this.game.makeMove(rowNumber, columnNumber)
    }
};
TicTacToeController.prototype.getStringForCell = function (rowNumber, columnNumber) {
    return this.boardArray[rowNumber][columnNumber] ? this.boardArray[rowNumber][columnNumber] : '_';
};

TicTacToeController.prototype.onClickingNewGame = function () {
    this.newGame();
};


TicTacToeController.HUMAN = 'h';
TicTacToeController.CPU = 'cpu';

