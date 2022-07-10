import { useEffect, useState } from "react"
import { getHistory } from "../../utils/firebase/game"
import Header from "../Header"

function History() {
    const [history, setHistory] = useState([])

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"))
        getHistory(user.id).then(data => {
            console.log(data)
            setHistory(data)
        })
    }, [])

    return (
        <div>
            <Header activeLink={"history"}></Header>
            <div>
                {history.map((item, index) => (
                    <div>{index+1} {item.level} {item.result} {item.time} {item.startTime}</div>
                ))}
            </div>
        </div>
    )
}

export default History