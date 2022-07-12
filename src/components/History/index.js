import { useEffect, useState } from "react"
import { getAuthorizedUser } from "../../utils/auth"
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
            <div>
                {history.map((item, index) => (
                    <div key={index}>{index + 1} {item.level} {item.result} {item.time} {item.startTime}</div>
                ))}
            </div>
        </div>
    )
}

export default History