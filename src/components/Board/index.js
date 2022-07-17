import { useEffect, useState } from "react";
import { getAuthorizedUser } from "../../utils/auth";
import { CreateBoard, EmptyBoard } from "../../utils/CreateBoard";
import { addHistory, getStatistic, setStatistic } from "../../utils/firebase/game";
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
    const [startTime, setStartTime] = useState(null)
    const [timer, setTimer] = useState(0)
    const [timeCounting, setTimeCounting] = useState(null)
    const [isModal, setIsModal] = useState(false)

    const timeCounter = () => {
        return setInterval(() => {
            setTimer(timer => timer + 1)
        }, 1000)
    }

    const handleEndGame = (result, timer) => {
        getAuthorizedUser().then(user=>{
            if (!user.id) return
            let game = {
                uid: user.id,
                level: props.level,
                result: result,
                startTime: startTime,
                time: timer
            }
            console.log(game)
            getStatistic(user.id, props.level).then(data => {
                if (!data) {
                    let stat = {
                        uid: user.id,
                        name: user.username,
                        level: props.level,
                        totalGames: 1,
                        totalWin: result === 'win' ? 1 : 0,
                        totalTime: result === 'win' ? timer : 0
                    }
                    if (result === 'win') {
                        stat.bestResult = timer
                    }
                    setStatistic(stat)
                } else {
                    let stat = data
                    stat.totalGames += 1
                    if (result === 'win') {
                        stat.totalWin += 1
                        stat.totalTime += timer
                        if (!stat.bestResult) {
                            stat.bestResult = timer
                        } else if (stat.bestResult > timer) {
                            stat.bestResult = timer
                        }
                    }
                    console.log(stat)
                    setStatistic(stat)
                }
            })
            addHistory(game)
        })
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
        setStartTime(Date.now())
        setTimeCounting(timeCounter());
        setGrid(revealedBoard.board);
        setNonMineCount(revealedBoard.nonMineCount)
    }

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
                handleEndGame("lose", timer)
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
                    handleEndGame("win", timer)
                    setEndgame(true)
                    clearInterval(timeCounting)
                    setTimeout(freshBoard, 5000);
                }
            }
        }
    }

    return (
        <div className="box has-text-centered">
            <div className={isModal ? "modal is-active" : "modal"}>
                <div className="modal-background" onClick={e => setIsModal(false)}></div>
                <div className="modal-content">
                    <div className="box has-text-centered">
                        <h1 className="title is-3">How to play</h1>
                        <div>
                            <div>There is a board of m x n cells with x mines.</div>
                            <br></br>
                            <div>You can reveal a cell by left click on it. But if you click on a mine, you lose.</div>
                            <div>The numbers on a cell represent how many mines are adjacent to it.</div>
                            <div>You can right click a cell to place a flag where you think a mine is.</div>
                            <div>💣 is the number of flagged mines. ⏱ is time you have spent on this game.</div>
                            <br></br>
                            <div>The three difficulty levels are Easy (9x9 with 10 mines), Normal (16x16 with 40 mines) and Hard (30x16 with 99 mines).</div>
                            <br></br>
                            <div>To win this game, you need to reveal all non-mines cell.</div>
                        </div>
                        <button className="button mx-2" onClick={e => setIsModal(false)}>Back</button>
                    </div>
                </div>
            </div>
            {notify && <h3>{notify}</h3>}
            <div className="is-flex is-justify-content-space-around">
                <a href="/" onClick={e=>{e.preventDefault(); setIsModal(true)}}>How to play?</a>
                <div>💣: {mineCount}</div>
                <div>⏱: {timer}s</div>
            </div>
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