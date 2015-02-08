/**
 *
 * @param {ticTacToe.TicTacToeBoard.X|ticTacToe.TicTacToeBoard.O} mark
 * @constructor
 */
ticTacToe.TicTacToePlayer = function TicTacToePlayer(mark) {
    this.mark = mark

};

/**
 *
 * @param {ticTacToe.TicTacToeBoard} gameState
 */
ticTacToe.TicTacToePlayer.prototype.getMove = function (gameState) {
    throw 'implement in child';
};

/**
 *
 * @param mark
 * @constructor
 */
ticTacToe.TicTacToeHumanPlayer = function (mark) {
    this.__proto__.mark = mark;
};

/**
 *
 * @param mark
 * @constructor
 */
ticTacToe.TicTacToeComputerPlayer = function (mark) {
    this.__proto__.mark = mark;
};


ticTacToe.TicTacToeComputerPlayer.prototype.getMove = function (gameState) {
    return this.miniMax(gameState, true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
};

ticTacToe.TicTacToeComputerPlayer.prototype.getOpponentMark = function () {
    return this.mark == ticTacToe.TicTacToeBoard.O ? ticTacToe.TicTacToeBoard.X : ticTacToe.TicTacToeBoard.O;
};


ticTacToe.TicTacToeComputerPlayer.Move = function (gameState, action, heuristicScore) {
    this.gameState = gameState;
    this.action = action;
    this.heuristicScore = heuristicScore;
};

ticTacToe.TicTacToeComputerPlayer.Move.prototype.toString = function () {
    return "action:(" + this.action.rowNumber + "," + this.action.columnNumber + "), state:" + this.gameState.toString();
};

/**
 *
 * @param gameState
 * @param maximizingPlayer
 * @param alpha
 * @param beta
 * @returns {*}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.miniMax = function (gameState, maximizingPlayer, alpha, beta) {
    var val = this.maxStep(gameState, alpha, beta, true);
    return val;


};

ticTacToe.TicTacToeComputerPlayer.prototype.maxStep = function (gameState, alpha, beta, topLevel) {
    if (this.isTerminalState(gameState)) {
        var heuristicValue = this.heuristic(gameState);
        return heuristicValue;
    }

    var bestValue = Number.NEGATIVE_INFINITY;
    var bestValueMove;
    var nextStates = this.nextStates(gameState, this.mark, topLevel);
    for (var i = 0; i < nextStates.length; i++) {
        var currentNextState = topLevel ? nextStates[i].gameState : nextStates[i];
        var currentMove = topLevel ? nextStates[i] : null;
        var val = Math.min(this.heuristic(currentNextState), this.minStep(currentNextState, alpha, beta, false));
        var oldValue = bestValue;
        bestValue = Math.max(val, bestValue);
        if (topLevel && oldValue != bestValue) {
            bestValueMove = currentMove;
        }

        if (bestValue >= beta) {
            return topLevel ? currentMove : bestValue;
        }
        alpha = Math.max(alpha, bestValue);
    }
    return topLevel ? bestValueMove : bestValue;
};

ticTacToe.TicTacToeComputerPlayer.prototype.minStep = function (gameState, alpha, beta, topLevel) {

    if (this.isTerminalState(gameState)) {
        var heuristicValue = this.heuristic(gameState);

        return heuristicValue;
    }

    var oppositeMark = this.getOpponentMark();

    var bestValue = Number.POSITIVE_INFINITY;
    var bestValueMove;
    var nextStates = this.nextStates(gameState, oppositeMark, topLevel);
    for (var i = 0; i < nextStates.length; i++) {
        var currentNextState = topLevel ? nextStates[i].gameState : nextStates[i];
        var currentMove = topLevel ? nextStates[i] : null;

        var val = Math.max(this.heuristic(currentNextState), this.maxStep(currentNextState, alpha, beta, false));
        var oldValue = bestValue;
        bestValue = Math.min(val, bestValue);

        if (topLevel && oldValue != bestValue) {
            bestValueMove = currentMove;
        }
        if (bestValue <= alpha) {
            return topLevel ? currentMove : bestValue;
        }
        beta = Math.min(beta, bestValue);


    }
    return topLevel ? bestValueMove : bestValue;
};

/**
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @param {ticTacToe.TicTacToeBoard.X | ticTacToe.TicTacToeBoard.O} mark
 * @param {boolean} returnMoves
 * @return Array.<ticTacToe.TicTacToeComputerPlayer.Move|ticTacToe.TicTacToeBoard>
 */
ticTacToe.TicTacToeComputerPlayer.prototype.nextStates = function (gameState, mark, returnMoves) {
    var nextStates = [];
    var boardArray = gameState.getBoardArray();
    for (var i = 0; i < boardArray.length; i++) {
        var currentRow = boardArray[i];
        for (var j = 0; j < currentRow.length; j++) {
            if (!boardArray[i][j]) {
                var boardCopy = gameState.getBoardCopy();
                boardCopy.setCell(i, j, mark);
                nextStates.push(returnMoves ? new ticTacToe.TicTacToeComputerPlayer.Move(boardCopy, {
                    rowNumber: i,
                    columnNumber: j
                }, null) : boardCopy);
            }
        }

    }
    return nextStates;

};
/**
 *
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @returns {boolean}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.isTerminalState = function (gameState) {
    return gameState.areAllCellsFull() || gameState.hasWon(ticTacToe.TicTacToeBoard.O) || gameState.hasWon(ticTacToe.TicTacToeBoard.X);
};


/**
 *
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @returns {number}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.heuristic = function (gameState) {
    var mark = this.mark;
    var oppositeMark = this.getOpponentMark();

    if (gameState.hasWon(mark)) {
        return 1000;
    }
    if (gameState.hasWon(oppositeMark)) {
        return -1000;
    }

    var score = 0;

    var board = gameState.getBoardArray();
    for (var i = 0; i < ticTacToe.TicTacToeGame.WINNING_CONFIGURATIONS.length; i++) {
        var currentWinningConfiguration = ticTacToe.TicTacToeGame.WINNING_CONFIGURATIONS[i];
        var configurationMatches = 0;
        var configurationEmpty = 0;
        var configurationOpposite = 0;
        for (var j = 0; j < currentWinningConfiguration.length; j++) {
            var currentPosition = currentWinningConfiguration[j];

            if (!board[currentPosition[0]][currentPosition[1]]) {
                configurationEmpty++;
            } else if (board[currentPosition[0]][currentPosition[1]] == mark) {
                configurationMatches++;
            } else if (board[currentPosition[0]][currentPosition[1]] == oppositeMark) {
                configurationOpposite++;
            }
        }
        if (configurationMatches == 2 && configurationEmpty == 1) {
            score += 100;
        } else if (configurationOpposite == 2 && configurationEmpty == 1) {
            score += -100;
        }
        else if (configurationMatches == 1 && configurationEmpty == 2) {
            score += 10;
        } else if (configurationOpposite == 1 && configurationEmpty == 2) {
            score += -10;
        }
    }
    return score;

};


