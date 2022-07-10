import { useEffect, useState } from "react"
import { getRanking } from "../../utils/firebase/game"
import Header from "../Header"

function Ranking() {
    const [level, setLevel] = useState('easy')
    const [rank, setRank] = useState([])

    useEffect(() => {
        getRanking(level).then(data => {
            console.log(data)
            setRank(data)
        })
    }, [level])

    return (
        <div>
            <Header activeLink={"ranking"}></Header>
            <div>
                <div className="panel-tabs">
                    <a href="true"
                        className={level === "easy" ? "is-active" : ""}
                        onClick={(e) => { e.preventDefault(); setLevel('easy') }}>Easy</a>
                    <a href="true"
                        className={level === "normal" ? "is-active" : ""}
                        onClick={(e) => { e.preventDefault(); setLevel('normal') }}>Normal</a>
                    <a href="true"
                        className={level === "hard" ? "is-active" : ""}
                        onClick={(e) => { e.preventDefault(); setLevel('hard') }}>Hard</a>
                </div>
                {rank.map((item, index) => (
                    <div key={item.uid}>{index + 1} {item.name} {item.totalWin} {item.totalTime}</div>
                ))}
            </div>
        </div>
    )
}

export default Ranking