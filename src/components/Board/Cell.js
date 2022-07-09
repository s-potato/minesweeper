import { useState } from 'react';
import './style.css'

function Cell(props) {
    const [minesCell, setMinesCell] = useState(<div className="cell cell-mines">💣</div>)
    const explosive = () => {
        setInterval(() => {
            setMinesCell(<div className="cell cell-mines">💥</div>)
        }, Math.random()*1000 + 500);
        return minesCell
    };

    return (
        <div onClick={(e) => props.revealCell(e, props.cell.x, props.cell.y)} onContextMenu={(e) => props.updateFlag(e, props.cell.x, props.cell.y)}>
            {!props.cell.revealed && props.cell.flagged ? (
                <div className="cell cell-unreveal">🚩</div>
            ) : !props.cell.revealed ?
                <div className="cell cell-unreveal"></div> :
                props.cell.revealed && props.cell.value === -1 ?
                    explosive() :
                    props.cell.value !== 0 ?
                        <div className={"cell cell-reveal cell-reveal-" + props.cell.value}>{props.cell.value}</div> :
                        <div className="cell cell-reveal"></div>
            }
        </div>
    )
}

export default Cell