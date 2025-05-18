const gameBoard = (function createBoard () {
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
        console.table(board);
    };

    const writeSymbol = (row, column, player) => {
        // Checks if cell is empty
        const queryCell = () => {
            if (board[row][column] === '') {
                return false;
            } else {
                return true;
            };
        }

        if(!queryCell) return;

        board[row][column].addSymbol(player);
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