import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, Legend } from 'recharts';

import { getAuthorizedUser } from "../../utils/auth"
import { getStatistic } from "../../utils/firebase/game"
import Header from "../Header"

function Statistic() {
    const [level, setLevel] = useState('easy')
    const [stat, setStat] = useState(null)
    const [chartData, setChartData] = useState([])

    const label = ["Win", "Lose"]
    const COLORS = ["#0000ff", "#ff0000"]

    useEffect(() => {
        getAuthorizedUser().then(user => {
            if (!user.id) {
                return
            }
            getStatistic(user.id, level).then(data => {
                if (!data || !data.totalGames) {
                    setStat(null)
                    return
                }
                let statistic = {
                    ...data,
                    winrate: Math.round(10000 * data.totalWin / data.totalGames) / 100
                }
                setChartData([
                    {
                        name: "Win",
                        value: statistic.totalWin
                    },
                    {
                        name: "Lose",
                        value: statistic.totalGames - statistic.totalWin
                    }])
                setStat(statistic)
            })
        })
    }, [level])

    return (
        <div>
            <Header></Header>
            <div className="block has-text-centered">
                <h1 className="title is-2">Statistic</h1>
            </div>
            <div className="columns is-centered">
                <div className="column box is-5">
                    <div className="panel-tabs is-centered is-justify-content-center">
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
                    <div className="has-text-centered">
                        {
                            stat &&
                            <div>
                                <div className="is-flex is-justify-content-center">
                                    <PieChart width={250} height={250}>
                                        <Legend verticalAlign="top" height={36} />
                                        <Pie
                                            startAngle={90}
                                            endAngle={-270}
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={label}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </div>
                                <div>You had played {stat.totalGames} games</div>
                                <div>Win: {stat.totalWin} games</div>
                                <div>Lose: {stat.totalGames - stat.totalWin} games</div>
                                <div>Winrate: {stat.winrate}%</div>
                                {stat.bestResult && <div>Best result: {stat.bestResult}s</div>}
                            </div>
                        }
                        <div>{!stat && "You haven't played this level yet."}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistic