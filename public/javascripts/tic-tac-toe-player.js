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
 * @param {number} rowNumber
 * @param {number} columnNumber
 * @constructor
 */
ticTacToe.TicTacToeAction = function (rowNumber, columnNumber) {
    this.rowNumber = rowNumber;
    this.columnNumber = columnNumber;
};

/**
 *
 * @param mark
 * @constructor
 */
ticTacToe.TicTacToeHumanPlayer = function (mark) {
    this.__proto__.mark = mark;
    this.rowNumber = null;
    this.columnNumber = null;
};

/**
 *
 * @returns {number}
 */
ticTacToe.TicTacToeHumanPlayer.prototype.getRowNumber = function () {
    return this.rowNumber;
};

/**
 *
 * @returns {number}
 */
ticTacToe.TicTacToeHumanPlayer.prototype.getColumnNumber = function () {
    return this.columnNumber;
};

/***
 *
 * @param {number} rowNumber
 */
ticTacToe.TicTacToeHumanPlayer.prototype.setRowNumber = function (rowNumber) {
    this.rowNumber = rowNumber;
};

/**
 *
 * @param {number} columnNumber
 */
ticTacToe.TicTacToeHumanPlayer.prototype.setColumnNumber = function (columnNumber) {
    this.columnNumber = columnNumber;
};

/**
 *
 * @param gameState
 * @returns {ticTacToe.TicTacToeAction}
 */
ticTacToe.TicTacToeHumanPlayer.prototype.getMove = function (gameState) {
    return new ticTacToe.TicTacToeAction(this.getRowNumber(), this.getColumnNumber());
};

/**
 *
 * @param mark
 * @constructor
 */
ticTacToe.TicTacToeComputerPlayer = function (mark) {
    this.__proto__.mark = mark;
};

/**
 *
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @returns {ticTacToe.TicTacToeAction}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.getMove = function (gameState) {
    var move = this.miniMax(gameState, true, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY);
    return move ? move.action : null;
};

/**
 *
 * @returns {ticTacToe.TicTacToeBoard.O|ticTacToe.TicTacToeBoard.X}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.getOpponentMark = function () {
    return this.mark == ticTacToe.TicTacToeBoard.O ? ticTacToe.TicTacToeBoard.X : ticTacToe.TicTacToeBoard.O;
};


/**
 *
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @param {ticTacToe.TicTacToeAction} action
 * @param {number} heuristicScore
 * @constructor
 */
ticTacToe.TicTacToeComputerPlayer.Move = function (gameState, action, heuristicScore) {
    this.gameState = gameState;
    this.action = action;
    this.heuristicScore = heuristicScore;
};

ticTacToe.TicTacToeComputerPlayer.Move.prototype.toString = function () {
    return "action:(" + this.action.rowNumber + "," + this.action.columnNumber + "), state:" + this.gameState.toString();
};

/**
 * Minimax algorithm with alpha beta pruning
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @param {boolean} maximizingPlayer
 * @param {number} alpha
 * @param {number} beta
 * @returns {ticTacToe.TicTacToeComputerPlayer.Move}
 */
ticTacToe.TicTacToeComputerPlayer.prototype.miniMax = function (gameState, maximizingPlayer, alpha, beta) {
    var val = this.maxStep(gameState, alpha, beta, true);
    return val;


};

/**
 * max step of minimax
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @param {number} alpha
 * @param {number} beta
 * @param {boolean} topLevel
 * @returns {ticTacToe.TicTacToeComputerPlayer.Move| number}
 */
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

/**
 * min step of miniMax
 * @param {ticTacToe.TicTacToeBoard} gameState
 * @param {number} alpha
 * @param {number} beta
 * @param {boolean} topLevel
 * @returns {ticTacToe.TicTacToeComputerPlayer.Move| number}
 */
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
 * returns the new states by executing each possible action
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
                nextStates.push(returnMoves ? new ticTacToe.TicTacToeComputerPlayer.Move(boardCopy,
                    new ticTacToe.TicTacToeAction(i, j), null) : boardCopy);
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
 * looks at a game state and determines how good it looks
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


