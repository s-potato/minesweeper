import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuthorizedUser } from "../../utils/auth"
import { getStatistic } from "../../utils/firebase/game"
import { getAllUser, setUser } from "../../utils/firebase/user"
import Header from "../Header"

function Admin() {
    const navigate = useNavigate()
    const [users, setUsers] = useState([])
    const [filter, setFilter] = useState("")
    const [modalUser, setModalUser] = useState({})
    const [isModal, setIsModal] = useState(false)

    useEffect(() => {
        getAuthorizedUser().then(user => {
            if (!user.isAdmin) navigate("/")
            getAllUser().then(users => {
                console.log(users)
                setUsers(users)
            })
        })
    }, [navigate])

    const handleBlock = (id) => {
        console.log(id)
        let nUsers = users.map(user => user.id === id ? { ...user, isBlocked: !user.isBlocked } : user)
        setUser(nUsers.filter(user => user.id === id)[0])
        setUsers(nUsers)
    }

    const handleDetail = (user) => {
        const easy = getStatistic(user.id, "easy")
        const normal = getStatistic(user.id, "normal")
        const hard = getStatistic(user.id, "hard")
        Promise.all([easy, normal, hard]).then(values => {
            console.log(values)
            let easyGame = 0
            let normalGame = 0
            let hardGame = 0
            let easyWinrate = 0
            let normalWinrate = 0
            let hardWinrate = 0
            if (values[0] && values[0].totalGames > 0) {
                easyGame = values[0].totalGames
                easyWinrate = 100 * values[0].totalWin / values[0].totalGames
            }
            if (values[1] && values[1].totalGames > 0) {
                normalGame = values[0].totalGames
                normalWinrate = 100 * values[1].totalWin / values[1].totalGames
            }
            if (values[2] && values[2].totalGames > 0) {
                hardGame = values[0].totalGames
                hardWinrate = 100 * values[2].totalWin / values[2].totalGames
            }
            setModalUser({
                ...user,
                easyGame: easyGame, normalGame: normalGame, hardGame: hardGame,
                easyWinrate: easyWinrate, normalWinrate: normalWinrate, hardWinrate: hardWinrate
            })
            setIsModal(true)
        })
    }

    const handleFilter = (e) => {
        setFilter(e.target.value)
    }

    return (
        <div>
            <Header activeLink={"admin"}></Header>
            <input class="input" type="text" placeholder="Text input" onChange={e => handleFilter(e)}></input>
            {users.filter(user => user.username.includes(filter)).map((item, index) => (
                <div key={index}>
                    <div key={index}>{item.username} {item.isAdmin ? "Admin" : "User"} {item.isBlocked ? "Blocked" : "Active"}
                    </div>
                    <button onClick={e => handleDetail(item)}>Detail</button>
                    {!item.isAdmin && (item.isBlocked ? <button onClick={(e) => handleBlock(item.id)}>Unblock</button> : <button onClick={(e) => handleBlock(item.id)}>Block</button>)}
                </div>
            ))}
            <div className={isModal ? "modal is-active" : "modal"}>
                <div className="modal-background" onClick={e => setIsModal(false)}></div>
                <div className="modal-content">
                    <div className="box">
                        <div>{modalUser.username} {modalUser.isAdmin ? "Admin" : "User"} {modalUser.isBlocked ? "Blocked" : "Active"}</div>
                        <div>Easy: {modalUser.easyGame} games, winrate: {modalUser.easyWinrate.toFixed(2)}%</div>
                        <div>Normal: {modalUser.normalGame} games, winrate: {modalUser.normalWinrate.toFixed(2)}%</div>
                        <div>Hard: {modalUser.hardGame} games, winrate: {modalUser.hardWinrate.toFixed(2)}%</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Admin