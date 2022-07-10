import { useState } from "react";
import Board from "../Board";
import Header from "../Header";
import "./style.css"

function Game() {
    const [level, setLevel] = useState('easy')

    const easy = {
        height: 9,
        width: 9,
        mines: 10
    }

    const normal = {
        height: 16,
        width: 16,
        mines: 40
    }

    const hard = {
        height: 16,
        width: 30,
        mines: 99
    }

    return (
        <div>
            <Header activeLink={"game"}></Header>
            <div>
                <h1>Minesweeper {level}</h1>
                <div className="select">
                    <select value={level} onChange={(e)=>{console.log(level==="easy");setLevel(()=>e.target.value)}}>
                        <option value={"easy"}>Easy</option>
                        <option value={"normal"}>Normal</option>
                        <option value={"hard"}>Hard</option>
                    </select>
                </div>
                <div className="board">
                    {level === "easy" && <Board level="easy" height={easy.height} width={easy.width} mines={easy.mines} />}
                    {level === "normal" && <Board level="normal" height={normal.height} width={normal.width} mines={normal.mines} />}
                    {level === "hard" && <Board level="hard" height={hard.height} width={hard.width} mines={hard.mines} />}
                    
                </div>
            </div>
        </div>
    );
}

export default Game