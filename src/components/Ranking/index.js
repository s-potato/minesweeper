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

            <div className="block has-text-centered">
                <h1 className="title is-2">Ranking</h1>
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
                    <div className="is-flex is-justify-content-center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No. </th>
                                    <th>Name</th>
                                    <th>Win(s)</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rank.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1} </td>
                                        <td>{item.name} </td>
                                        <td>{item.totalWin}  </td>
                                        <td>{item.totalTime} </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Ranking