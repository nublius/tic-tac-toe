const GameBoard = (function Board () {
    const rows = 3;
    const columns = 3;
    const board = [];

    const initBoard = () => {
        for (let i = 0; i < rows; i++) {
            board[i] = [];
            for (let j = 0; j < columns; j++) {
                board[i].push(Cell());
            }
        }
    };

    const getBoard = () => board;

    const printBoard = () => {
        console.table(board.map(row => row.map(cell => cell.getValue())));
    };

    const writeSymbol = (row, column, player) => {
        // Checks if cell is empty
        if (board[row][column].getValue() !== '') return false;
        // If cell is available, write symbol onto GameBoard and return true
        board[row][column].addSymbol(player);
        return true;
    };

    return { initBoard, getBoard, printBoard, writeSymbol };
})();

function Cell() {
    let value = '';

    const addSymbol = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addSymbol, getValue };
}

const GameController = (function Controller (playerOneName = "Player One", playerTwoName = "Player Two") {
    GameBoard.initBoard();

    let gameOver = false;

    const players = [
        {
            name: playerOneName,
            symbol: 'X'
        },
        {
            name: playerTwoName,
            symbol: 'O'
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        GameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {

        if (gameOver) {
            console.log("Game is over. Please restart to play again.");
            return;
        }

        console.log(
            `Attempting to write ${getActivePlayer().name}'s symbol into board[${row}][${column}]...`
        );

        const moveSuccesful = GameBoard.writeSymbol(row, column, getActivePlayer().symbol);

        if(!moveSuccesful) {
            console.log("Cell is already occupied. Try a different move.");
            return;
        }

        const winner = (checkWin(row, column, getActivePlayer().symbol));
        if (winner) return;

        switchPlayerTurn();
        printNewRound();
    }

    const checkWin = (row, column, symbol) => {
        const board = GameBoard.getBoard();

        const columnArray = [
            board[0][column], 
            board[1][column], 
            board[2][column]
        ];

        const diagArray = [
            board[0][0],
            board[1][1],
            board[2][2]
        ];

        const antiDiagArray = [
            board[0][2],
            board[1][1],
            board[2][0]
        ];

        const rowWin = board[row].every(cell => cell.getValue() === symbol);
        const columnWin = columnArray.every(cell => cell.getValue() === symbol);
        const diagWin = diagArray.every(cell => cell.getValue() === symbol);
        const antiDiagWin = antiDiagArray.every(cell => cell.getValue() === symbol);

        if (rowWin || columnWin || diagWin || antiDiagWin) {
            console.log(`${getActivePlayer().name} wins!`);
            GameBoard.printBoard();
            gameOver = true;
            return getActivePlayer().name;
        }

        console.log("Checking win for", symbol);
        console.log("Row check:", board[row].map(cell => cell.getValue()));
        console.log("Column check:", columnArray.map(cell => cell.getValue()));
    }

    const restartGame = () => {
        GameBoard.initBoard();
        gameOver = false;
        activePlayer = players[0];
        printNewRound();
    }

    return {
        playRound,
        getActivePlayer,
        restartGame
    };
})();