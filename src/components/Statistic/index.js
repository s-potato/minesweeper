import { useEffect, useState } from "react"
import { getStatistic } from "../../utils/firebase/game"
import Header from "../Header"

function Statistic() {
    const [level, setLevel] = useState('easy')
    const [stat, setStat] = useState(null)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        getStatistic(user.id, level).then(data => {
            console.log(data)
            setStat(data)
        })
    }, [level])

    return (
        <div>
            <Header></Header>
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
                {
                    stat&&stat.totalGames&&
                    <div>Winrate: {100*stat.totalWin/stat.totalGames}%</div>
                }
            </div>
        </div>
    )
}

export default Statistic