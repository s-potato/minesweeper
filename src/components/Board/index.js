import { useEffect, useState } from "react";
import { CreateBoard, EmptyBoard } from "../../utils/CreateBoard";
import reveal from "../../utils/Reveal";
import Cell from "./Cell";
import "./style.css"

function Board(props) {
    const [grid, setGrid] = useState([])
    const [isEndgame, setEndgame] = useState(true)
    const [nonMineCount, setNonMineCount] = useState(0);
    const [mineLocation, setMineLocation] = useState([]);
    const [mineCount, setMineCount] = useState(props.mines)
    const [notify, setNotify] = useState("")
    const [timer, setTimer] = useState(0)
    const [timeCounting, setTimeCounting] = useState(null)

    const timeCounter = () => {
        return setInterval(()=>{
            setTimer(timer => timer+1)
        }, 1000)
    }

    const freshBoard = () => {
        setNotify("")
        const newBoard = EmptyBoard(props.height, props.width)
        setMineCount(props.mines)
        setNonMineCount(props.height * props.width - props.mines)
        setTimer(0)
        setTimeCounting(null)
        setGrid(newBoard.board)
        setEndgame(false)
    }

    const firstMove = (x, y) => {
        const newBoard = CreateBoard(props.height, props.width, props.mines, x, y)
        setNonMineCount(props.height * props.width - props.mines)
        setMineLocation(newBoard.mineLocation)
        let newGrid = JSON.parse(JSON.stringify(newBoard.board));
        let revealedBoard = reveal(newGrid, x, y, nonMineCount);
        setTimeCounting(timeCounter());
        setGrid(revealedBoard.board);
        setNonMineCount(revealedBoard.nonMineCount)
    }

    useEffect(()=>{
        console.log(timer)
        console.log(timeCounting)
    },[timer, timeCounting])

    useEffect(() => {
        freshBoard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFlag = (e, x, y) => {
        e.preventDefault();
        if (!isEndgame) {
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
        if (!isEndgame) {
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
                setEndgame(true)
                for (let i = 0; i < mineLocation.length; i++) {
                    newGrid[mineLocation[i][0]][mineLocation[i][1]].revealed = true;
                }
                setGrid(newGrid);
                clearInterval(timeCounting)
                setTimeout(freshBoard, 5000);
            } else {
                let revealedBoard = reveal(newGrid, x, y, nonMineCount);
                setGrid(revealedBoard.board);
                setNonMineCount(revealedBoard.nonMineCount);
                if (revealedBoard.nonMineCount === 0) {
                    setNotify("You win!")
                    setEndgame(true)
                    clearInterval(timeCounting)
                    setTimeout(freshBoard, 5000);
                }
            }
        }
    }

    return (
        <div>
            {notify ? <h3>{notify}</h3> : <h3>💣: {mineCount}</h3>}  {timer}
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