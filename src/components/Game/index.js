import Board from "../Board";
import "./style.css"

function Game() {
    const height = 9
    const width = 9
    const mines = 10

    return (
        <div>
            <h1>Minesweeper</h1>
            <div className="board">
                <Board height={height} width={width} mines={mines} />
            </div>
        </div>
    );
}

export default Game