const gameBoard = (function createBoard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push('0'); // '0' as placeholder
        }
    }

    function logBoard() {
        console.table(board);
    }

    return { board };
})();