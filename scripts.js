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
    }

    return { initBoard, getBoard, printBoard };
})();

function Cell() {
    let value = '';

    const addSymbol = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addSymbol, getValue };
}