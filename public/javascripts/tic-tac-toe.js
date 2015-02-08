var ticTacToe = {};
/**
 *
 * @constructor
 */
ticTacToe.TicTacToeBoard = function TicTacToeBoard() {
    this.boardArray = ticTacToe.TicTacToeBoard.getEmptyBoardArray();


};

ticTacToe.TicTacToeBoard.getEmptyBoardArray = function () {
    return [[null, null, null],
        [null, null, null],
        [null, null, null]];
};

ticTacToe.TicTacToeBoard.prototype.getBoardArray = function () {
    return this.boardArray;
};

/**
 * @returns {string} a string of length 9 in the form 'xoxoooxxo'
 */
ticTacToe.TicTacToeBoard.prototype.toStringRepresentation = function () {
    var str = '';
    for (var i = 0; i < this.boardArray.length; i++) {
        var currentRow = this.boardArray[i];
        for (var j = 0; j < currentRow.length; j++) {
            str += this.boardArray[i][j] ? this.boardArray[i][j] : ticTacToe.TicTacToeBoard.EMPTY;
        }

    }
    return str;
};

ticTacToe.TicTacToeBoard.prototype.toString = function () {
    return this.toStringRepresentation();
};

/**
 *
 * @returns {ticTacToe.TicTacToeBoard}
 */
ticTacToe.TicTacToeBoard.prototype.getBoardCopy = function () {
    return ticTacToe.TicTacToeBoard.fromStringRepresentation(this.toStringRepresentation());
};


/**
 *
 * @param {string} str
 * @returns {ticTacToe.TicTacToeBoard}
 */
ticTacToe.TicTacToeBoard.fromStringRepresentation = function (str) {

    var board = new ticTacToe.TicTacToeBoard();
    var boardArray = board.getBoardArray();
    var countX = 0;
    var countO = 0;

    for (var i = 0; i < boardArray.length; i++) {
        var currentRow = boardArray[i];
        for (var j = 0; j < currentRow.length; j++) {
            var currentCharacter = str.charAt(i * boardArray.length + j);
            if (currentCharacter !== ticTacToe.TicTacToeBoard.X &&
                currentCharacter !== ticTacToe.TicTacToeBoard.O) {
                currentCharacter = null;
            }
            if (currentCharacter === ticTacToe.TicTacToeBoard.X) {
                countX++;
            }
            if (currentCharacter === ticTacToe.TicTacToeBoard.O) {
                countO++;
            }
            boardArray[i][j] = currentCharacter;
        }

    }

    return Math.abs(countX - countO) > 1 ? null : board;
};

/**
 * x| |o
 * -----
 *  | |
 * -----
 *  | |
 *  @returns {string} a graphical representation of the game state
 */
ticTacToe.TicTacToeBoard.prototype.toGraphicalString = function () {
    var str = '\n';
    for (var i = 0; i < this.boardArray.length; i++) {
        var currentRow = this.boardArray[i];
        for (var j = 0; j < currentRow.length; j++) {
            str += this.boardArray[i][j] ? this.boardArray[i][j] : ' ';
            var appender = j !== currentRow.length - 1 ? '|' : "\n";
            str += appender;
        }
        if (this.boardArray.length - 1 != i) {
            str += '-----\n'
        }

    }
    return str;
};


/**
 *
 * @param {number} rowNumber
 * @param {number} columnNumber
 * @param {TicTacToeBoard.X|TicTacToeBoard.O} value
 * @returns {boolean} whether or not it was successful to set the cell
 */
ticTacToe.TicTacToeBoard.prototype.setCell = function (rowNumber, columnNumber, value) {
    // sanity of args
    if (rowNumber > ticTacToe.TicTacToeBoard.UPPER_BOUNDARY || rowNumber < ticTacToe.TicTacToeBoard.LOWER_BOUNDARY
        || columnNumber < ticTacToe.TicTacToeBoard.LOWER_BOUNDARY || columnNumber > ticTacToe.TicTacToeBoard.UPPER_BOUNDARY
        && ( value !== ticTacToe.TicTacToeBoard.X || value !== ticTacToe.TicTacToeBoard.O)) {
        return false;
    }
    if (this.boardArray[rowNumber][columnNumber]) {
        return false;
    }

    this.boardArray[rowNumber][columnNumber] = value;
    return true;

};

/**
 *
 * @const {string}
 */
ticTacToe.TicTacToeBoard.X = 'x';

/**
 *
 * @const {string}
 */
ticTacToe.TicTacToeBoard.O = 'o';

/**
 *
 * @const {string}
 */
ticTacToe.TicTacToeBoard.EMPTY = '_';

/**
 *
 * @const {number}
 */
ticTacToe.TicTacToeBoard.LOWER_BOUNDARY = 0;

/**
 *
 * @const {number}
 */
ticTacToe.TicTacToeBoard.UPPER_BOUNDARY = 2;


ticTacToe.TicTacToeGame = function TicTacToeGame() {
    this.gameBoard = new ticTacToe.TicTacToeBoard();
    this.currentPlayerMark = ticTacToe.TicTacToeBoard.X;
    this.gameCompleted = false;
};

ticTacToe.TicTacToeGame.prototype.getGameBoard = function () {
    return this.gameBoard;
};


ticTacToe.TicTacToeGame.prototype.hasWon = function (playerMark) {
    return this.getGameBoard().hasWon(playerMark);
};

ticTacToe.TicTacToeBoard.prototype.hasWon = function (playerMark) {
    var board = this.getBoardArray();
    for (var i = 0; i < ticTacToe.TicTacToeGame.WINNING_CONFIGURATIONS.length; i++) {
        var currentWinningConfiguration = ticTacToe.TicTacToeGame.WINNING_CONFIGURATIONS[i];
        var configurationMatches = 0;
        for (var j = 0; j < currentWinningConfiguration.length; j++) {
            var currentPosition = currentWinningConfiguration[j];

            if (board[currentPosition[0]][currentPosition[1]] === playerMark) {
                configurationMatches++;
            }
        }
        if (configurationMatches == currentWinningConfiguration.length) {
            return true;
        }
    }

};

/**
 *
 * @returns {string}
 */
ticTacToe.TicTacToeGame.prototype.toGraphicalString = function () {
    return this.getGameBoard().toGraphicalString();
};

/**
 * @returns {boolean} whether or not there are empty cells in the game
 */
ticTacToe.TicTacToeBoard.prototype.areAllCellsFull = function () {
    var boardArray = this.getBoardArray();
    for (var i = 0; i < boardArray.length; i++) {
        var currentRow = boardArray[i];
        for (var j = 0; j < currentRow.length; j++) {
            if (!boardArray[i][j]) {
                return false;
            }
        }

    }
    return true;
};

ticTacToe.TicTacToeGame.prototype.areAllCellsFull = function () {
    return this.getGameBoard().areAllCellsFull();
};

/**
 *
 * @param rowNumber
 * @param columnNumber
 */
ticTacToe.TicTacToeGame.prototype.makeMove = function (rowNumber, columnNumber) {

    if (this.gameCompleted) {
        return;
    }
    var boardObject = this.getGameBoard();
    var moveSuccessful = boardObject.setCell(rowNumber, columnNumber, this.currentPlayerMark);
    if (moveSuccessful) {
        console.log(this.toGraphicalString());
        if (this.hasWon(this.currentPlayerMark)) {
            this.gameCompleted = true;
            this.winner = this.currentPlayerMark;
            console.log('player ' + this.currentPlayerMark + ' has won');

        } else if (this.areAllCellsFull()) {
            this.gameCompleted = true;

            console.log('the game has ended in a draw');

        }
        else {
            this.currentPlayerMark = this.currentPlayerMark === ticTacToe.TicTacToeBoard.X ? ticTacToe.TicTacToeBoard.O : ticTacToe.TicTacToeBoard.X;
            console.log('player\'s ' + this.currentPlayerMark + ' turn');

        }
    } else {
        console.error('unsuccessful move');
    }
};

ticTacToe.TicTacToeGame.WINNING_CONFIGURATIONS = [
    [[0, 0], [0, 1], [0, 2]],
    [[1, 0], [1, 1], [1, 2]],
    [[2, 0], [2, 1], [2, 2]],
    [[0, 0], [1, 0], [2, 0]],
    [[0, 1], [1, 1], [2, 1]],
    [[0, 2], [1, 2], [2, 2]],
    [[0, 0], [1, 1], [2, 2]],
    [[0, 2], [1, 1], [2, 0]]

];

