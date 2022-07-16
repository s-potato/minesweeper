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
        if (id === modalUser.id) {
            setModalUser({ ...modalUser, isBlocked: !modalUser.isBlocked })
        }
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
            let easyBestResult = (values[0] && values[0].bestResult) ? values[0].bestResult : ""
            let normalBestResult = (values[1] && values[1].bestResult) ? values[1].bestResult : ""
            let hardBestResult = (values[2] && values[2].bestResult) ? values[2].bestResult : ""
            if (values[0] && values[0].totalGames > 0) {
                easyGame = values[0].totalGames
                easyWinrate = Math.round(10000 * values[0].totalWin / values[0].totalGames) / 100
            }
            if (values[1] && values[1].totalGames > 0) {
                normalGame = values[0].totalGames
                normalWinrate = Math.round(10000 * values[1].totalWin / values[1].totalGames) / 100
            }
            if (values[2] && values[2].totalGames > 0) {
                hardGame = values[0].totalGames
                hardWinrate = Math.round(10000 * values[2].totalWin / values[2].totalGames) / 100
            }
            setModalUser({
                ...user,
                easyGame: easyGame, normalGame: normalGame, hardGame: hardGame,
                easyWinrate: easyWinrate, normalWinrate: normalWinrate, hardWinrate: hardWinrate,
                easyBestResult: easyBestResult, normalBestResult: normalBestResult, hardBestResult: hardBestResult,
            })
            setIsModal(true)
        })
    }

    const handleFilter = (e) => {
        setFilter(e.target.value)
    }

    const handleClear = () => {
        const search = document.getElementById('search')
        search.value = ""
        setFilter("")
    }

    return (
        <div>
            <Header activeLink={"admin"}></Header>
            <div className={isModal ? "modal is-active" : "modal"}>
                <div className="modal-background" onClick={e => setIsModal(false)}></div>
                <div className="modal-content">
                    <div className="box has-text-centered">
                        <h1 className="title is-3">{modalUser.username}</h1>
                        {modalUser.isGoogleAccount &&
                            <>
                                <b><i class="fa-brands fa-google"></i>oogle Account</b>
                                <div><b>Email: </b>{modalUser.email}</div>
                                <br></br>
                            </>
                        }
                        <div><b>Role: </b>{modalUser.isAdmin ? "Admin" : "User"}</div>
                        <div><b>Status: </b>{modalUser.isBlocked ? "Blocked" : "Active"}</div>
                        <br></br>
                        <div className="is-flex is-justify-content-center">
                            <table className="table ">
                                <thead>
                                    <tr>
                                        <th>Level</th>
                                        <th>TotalGames</th>
                                        <th>WinRate</th>
                                        <th>Best result</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Easy</td>
                                        <td>{modalUser.easyGame}</td>
                                        <td>{modalUser.easyWinrate}%</td>
                                        <td>{modalUser.easyBestResult}</td>
                                    </tr>
                                    <tr>
                                        <td>Normal</td>
                                        <td>{modalUser.normalGame}</td>
                                        <td>{modalUser.normalWinrate}%</td>
                                        <td>{modalUser.normalBestResult}</td>
                                    </tr>
                                    <tr>
                                        <td>Hard</td>
                                        <td>{modalUser.hardGame}</td>
                                        <td>{modalUser.hardWinrate}%</td>
                                        <td>{modalUser.hardBestResult}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            {!modalUser.isAdmin && (modalUser.isBlocked ? <button className="button is-primary mx-2" onClick={(e) => handleBlock(modalUser.id)}>Unblock</button> : <button className="button is-danger mx-2" onClick={(e) => handleBlock(modalUser.id)}>Block</button>)}
                            <button className="button mx-2" onClick={e => setIsModal(false)}>Back</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="block has-text-centered">
                <h1 className="title is-2">Admin Portal</h1>
            </div>
            <div className="columns is-centered">
                <div className="column box is-5">
                    <div className="field has-addons">
                        <div className="control has-icons-left is-expanded">
                            <input className="input" type="text" id="search" placeholder="Search..." onChange={e => handleFilter(e)}></input>
                            <span className="icon is-small is-left">
                                <i className="fa fa-search"></i>
                            </span>
                        </div>
                        <div class="control">
                            <button class="button" onClick={handleClear}>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div className="is-flex is-justify-content-center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>No. </th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.filter(user => user.username.includes(filter)).map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.username}</td>
                                        <td>{item.isAdmin ? "Admin" : "User"}</td>
                                        <td>{item.isBlocked ? "Blocked" : "Active"}</td>
                                        <td>
                                            <button className="button is-small" onClick={e => handleDetail(item)}>Detail</button>
                                            {!item.isAdmin && (item.isBlocked ? <button className="button is-small is-primary" onClick={(e) => handleBlock(item.id)}>Unblock</button> : <button className="button is-small is-danger" onClick={(e) => handleBlock(item.id)}>Block</button>)}
                                        </td>
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

export default Admin