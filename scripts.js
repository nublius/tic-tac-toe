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
    let winner = null;
    let winType = null;

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
        const isBoardFull = board.every(row =>
            row.every(cell => cell.getValue() !== '')
        );

        if (rowWin) winType = "row";
        else if (columnWin) winType = "column";
        else if (diagWin) winType = "diagonal";
        else if (antiDiagWin) winType = "antidiagonal";

        if (winType) {
            console.log(`${getActivePlayer().name} wins!`);
            GameBoard.printBoard();
            gameOver = true;
            winner = getActivePlayer().name;
            return true;
        } else if (isBoardFull) {
            gameOver = true;
            winner = "TIE!";
            GameBoard.printBoard();
            console.log("TIE!");
            return true;
        }

        console.log("Checking win for", symbol);
        console.log("Row check:", board[row].map(cell => cell.getValue()));
        console.log("Column check:", columnArray.map(cell => cell.getValue()));
        console.log("Diag check:", diagArray.map(cell => cell.getValue()));
        console.log("AntiDiag check:", antiDiagArray.map(cell => cell.getValue()));

    }

    const restartGame = () => {
        GameBoard.initBoard();
        gameOver = false;
        activePlayer = players[0];
        printNewRound();
        winType = null;
    }

    const getWinner = () => winner;
    const getGameOver = () => gameOver;
    const getWinType = () => winType;

    return {
        playRound,
        getActivePlayer,
        restartGame,
        getBoard: GameBoard.getBoard,
        getGameOver,
        getWinner,
        getWinType
    };
})();

// 

const DisplayController = (function Controller() {

    const initDisplay = () => {
        const gridContainer = document.querySelector("#grid__container");
        const gameStateDisplay = document.querySelector("h2");

        return {
            gridContainer,
            gameStateDisplay
        };
    }

    const elements = initDisplay();

    const reloadClick = document.querySelector(".reload");

    reloadClick.addEventListener("click", () => {
        GameController.restartGame();
        updateDisplay();
    })

    const handleCellClick = (row, column) => {
       GameController.playRound(row, column);
       updateDisplay();
    }

    const updateDisplay = () => {
        elements.gridContainer.textContent = "";

        const board = GameController.getBoard();
        const activePlayer = GameController.getActivePlayer().name;

        elements.gameStateDisplay.textContent = `${activePlayer.toUpperCase()}'S TURN`;

        board.forEach((row, rowIndex) => {
            row.forEach((cell, columnIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = columnIndex;

                cellButton.addEventListener("click", () => handleCellClick(rowIndex, columnIndex));

                cellButton.textContent = cell.getValue();
                elements.gridContainer.appendChild(cellButton);
            })
        })

        if (GameController.getGameOver() && GameController.getWinner() != "TIE!") {
            elements.gameStateDisplay.textContent = `${GameController.getWinner().toUpperCase()} WINS!`;

        } else if (GameController.getGameOver()) {
            elements.gameStateDisplay.textContent = "TIE!";
        }
    }

    updateDisplay();

})();