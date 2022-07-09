import { useEffect, useState } from "react";
import { CreateBoard, EmptyBoard } from "../../utils/CreateBoard";
import reveal from "../../utils/Reveal";
import Cell from "./Cell";
import "./style.css"

function Board(props) {
    const [grid, setGrid] = useState([])
    const [isEngame, setEngame] = useState(true)
    const [nonMineCount, setNonMineCount] = useState(0);
    const [mineLocation, setMineLocation] = useState([]);
    const [mineCount, setMineCount] = useState(props.mines)
    const [notify, setNotify] = useState("")

    const freshBoard = () => {
        setNotify("")
        const newBoard = EmptyBoard(props.height, props.width)
        setNonMineCount(props.height * props.width - props.mines)
        setGrid(newBoard.board)
        setEngame(false)
    }

    const firstMove = (x, y) => {
        const newBoard = CreateBoard(props.height, props.width, props.mines, x, y)
        setNonMineCount(props.height * props.width - props.mines)
        setMineLocation(newBoard.mineLocation)
        let newGrid = JSON.parse(JSON.stringify(newBoard.board));
        let revealedBoard = reveal(newGrid, x, y, nonMineCount);
        setGrid(revealedBoard.board);
        setNonMineCount(revealedBoard.nonMineCount)
    }

    useEffect(() => {
        freshBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFlag = (e, x, y) => {
        e.preventDefault();
        if (!isEngame) {
            let newGrid = JSON.parse(JSON.stringify(grid));
            newGrid[x][y].flagged = !newGrid[x][y].flagged;
            if (newGrid[x][y].flagged) {
                setMineCount(mineCount - 1)
            } else {
                setMineCount(mineCount + 1)
            }
            setGrid(newGrid);
        }
    }

    const revealCell = (e, x, y) => {
        if (!isEngame) {
            if (grid[x][y].flagged) {
                return;
            }
            if (nonMineCount === props.height * props.width - props.mines) {
                firstMove(x, y);
                return;
            }
            let newGrid = JSON.parse(JSON.stringify(grid));
            if (newGrid[x][y].value === -1) {
                setNotify("You lose!")
                setEngame(true)
                for (let i = 0; i < mineLocation.length; i++) {
                    newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
                }
                setGrid(newGrid);
                setTimeout(freshBoard, 5000);
            } else {
                let revealedBoard = reveal(newGrid, x, y, nonMineCount);
                setGrid(revealedBoard.board);
                setNonMineCount(revealedBoard.nonMineCount);
                if (revealedBoard.nonMineCount === 0) {
                    setNotify("You win!")
                    setEngame(true)
                    setTimeout(freshBoard, 5000);
                }
            }
        }
    }

    return (
        <div>
            {notify ? <h3>{notify}</h3> : <h3>💣: {mineCount}</h3>}
            <div>
                {grid.map((row, index1) => {
                    return (
                        <div className="row" key={index1}>
                            {row.map((cell, index2) => {
                                return <Cell cell={cell} key={index2} updateFlag={updateFlag} revealCell={revealCell} />
                            })}

                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Board