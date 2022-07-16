import { useEffect, useState } from "react"
import { getAuthorizedUser } from "../../utils/auth"
import { formatDate } from "../../utils/date"
import { getHistory } from "../../utils/firebase/game"
import Header from "../Header"

function History() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        getAuthorizedUser().then(user => {
            if (!user.id) {
                return
            }
            getHistory(user.id).then(data => {
                setHistory(data)
            })
        })
    }, [])

    return (
        <div>
            <Header activeLink={"history"}></Header>
            <div className="block has-text-centered">
                <h1 className="title is-2">History</h1>
            </div>
            <div className="columns is-centered">
                <div className="column is-5 is-flex is-justify-content-center">
                    <table className="table box">
                        <thead>
                            <tr>
                                <th>No. </th>
                                <th>Level</th>
                                <th>Result</th>
                                <th>Time</th>
                                <th>Start time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1} </td>
                                    <td>{item.level} </td>
                                    <td>{item.result === "win" ? "Win" : "Lose"}  </td>
                                    <td>{item.time} </td>
                                    <td>{formatDate(item.startTime)} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default History