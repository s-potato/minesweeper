import Random from './Random'

const EmptyBoard = (height, width) => {
    let board = []
    for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            row.push({
                value: 0,
                revealed: false,
                x: i,
                y: j,
                flagged: false,
            });
        }
        board.push(row)
    }
    return {board}
}

const CreateBoard = (height, width, mines, x, y) => {
    let board = []
    let mineLocation = []
    for (let i = 0; i < height; i++) {
        let row = []
        for (let j = 0; j < width; j++) {
            row.push({
                value: 0,
                revealed: false,
                x: i,
                y: j,
                flagged: false,
            });
        }
        board.push(row)
    }

    let excludeArray = [x*width + y]
    if (y > 0) excludeArray.push(x*width + y - 1)
    if (y < width-1) excludeArray.push(x*width + y + 1)
    if (x > 0) {
        excludeArray.push((x-1)*width + y)
        if (y > 0) excludeArray.push((x-1)*width + y - 1)
        if (y < width-1) excludeArray.push((x-1)*width + y + 1)
    }
    if (x < width-1) {
        excludeArray.push((x+1)*width + y)
        if (y > 0) excludeArray.push((x+1)*width + y - 1)
        if (y < width-1) excludeArray.push((x+1)*width + y + 1)
    }
    let minesarr = Random(mines + 9, height*width)
    minesarr = minesarr.filter(element=> {
        return excludeArray.indexOf(element) < 0
    })
    minesarr = minesarr.slice(0, mines)
    minesarr.forEach(element => {
        let x = Math.floor(element/width)
        let y = element%width
        board[x][y].value = -1
        mineLocation.push([x, y])
    });

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (board[i][j].value === -1) {
                continue;
            }

            // Top
            if (i > 0 && board[i - 1][j].value === -1) {
                board[i][j].value++;
            }

            // Top Right
            if (i > 0 && j < width - 1 && board[i - 1][j + 1].value === -1) {
                board[i][j].value++;
            }

            // Right
            if (j < width - 1 && board[i][j + 1].value === -1) {
                board[i][j].value++;
            }

            // Botoom Right
            if (i < height - 1 && j < width - 1 && board[i + 1][j + 1].value === -1) {
                board[i][j].value++;
            }

            // Bottom
            if (i < height - 1 && board[i + 1][j].value === -1) {
                board[i][j].value++;
            }

            // Bottom Left
            if (i < height - 1 && j > 0 && board[i + 1][j - 1].value === -1) {
                board[i][j].value++;
            }

            // LEft
            if (j > 0 && board[i][j - 1].value === -1) {
                board[i][j].value++;
            }

            // Top Left
            if (i > 0 && j > 0 && board[i - 1][j - 1].value === -1) {
                board[i][j].value++;
            }
        }
    }

    return { board, mineLocation }
}

export {EmptyBoard, CreateBoard}