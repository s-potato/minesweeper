const reveal = (board, x, y, nonMineCount) => {
    let queue = [board[x][y]]
    while (queue.length !== 0) {
        let current = queue.pop()
        if (current.revealed) {
            continue
        }
        let i = current.x
        let j = current.y
        let height = board.length
        let width = board[0].length

        if (board[i][j].value !== -1) {
            board[i][j].revealed = true;
            nonMineCount--;
        }

        if (board[i][j].value === 0) {
            // Top
            if (i > 0 ) {
                queue.push(board[i - 1][j])
            }

            // Top Right
            if (i > 0 && j < width - 1) {
                queue.push(board[i - 1][j + 1])
            }

            // Right
            if (j < width - 1) {
                queue.push(board[i][j + 1])
            }

            // Botoom Right
            if (i < height - 1 && j < width - 1) {
                queue.push(board[i + 1][j + 1])
            }

            // Bottom
            if (i < height - 1) {
                queue.push(board[i + 1][j])
            }

            // Bottom Left
            if (i < height - 1 && j > 0) {
                queue.push(board[i + 1][j - 1])
            }

            // Left
            if (j > 0) {
                queue.push(board[i][j - 1])
            }

            // Top Left
            if (i > 0 && j > 0) {
                queue.push(board[i - 1][j - 1])
            }
        }
    }

    return {board, nonMineCount}
}

export default reveal