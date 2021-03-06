import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getAuthorizedUser } from "../../utils/auth"
import './style.css'


function Header({ activeLink }) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [user, setUser] = useState({})

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        if (!user || !user.id) navigate("/")
        setUser(user)
        getAuthorizedUser().then(data => {
            if (!data.id) {
                navigate("/")
            }
            setUser(data)
        })
    }, [navigate])

    return (
        <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
            <div className="navbar-brand">
                <a className="navbar-item" href="/">
                    <img src="mines.png" alt="Minesweeper" width="30" height="30" />
                </a>

                <div role="button" className={isMenuOpen ? "navbar-burger is-active" : "navbar-burger"}
                    aria-label="menu" aria-expanded="false" data-target="navbarBasicExample"
                    onClick={e => { setIsMenuOpen(!isMenuOpen) }}>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </div>
            </div>
            <div className={isMenuOpen ? "navbar-menu is-active" : "navbar-menu"}>
                <a className={activeLink === "game" ? "navbar-item is-active" : "navbar-item"} href="/">
                    Play
                </a>
                <a className={activeLink === "history" ? "navbar-item is-active" : "navbar-item"} href="/history">
                    History
                </a>
                <a className={activeLink === "ranking" ? "navbar-item is-active" : "navbar-item"} href="/ranking">
                    Ranking
                </a>
                {user && user.isAdmin &&
                    <a className={activeLink === "admin" ? "navbar-item is-active" : "navbar-item"} href="/admin">
                        Admin Portal
                    </a>
                }
            </div>

            <div className="navbar-end">
                {user && user.id &&
                    <div className="navbar-item has-dropdown is-hoverable">
                        <span className="navbar-link">{user.username}
                        </span>
                        <div className="navbar-dropdown is-right">
                            <a href="/statistic" className="navbar-item">
                                Statistics
                            </a>
                            <a href="/" className="navbar-item" onClick={e => localStorage.removeItem("user")}>
                                Logout
                            </a>
                        </div>
                    </div>
                }
                {(!user || !user.id) &&
                    <div className="navbar-item">
                        <div className="buttons">
                            <a href="/login" className="button is-primary">Login
                            </a>
                            <a href="/signup" className="button is-light">
                                Signup
                            </a>
                        </div>
                    </div>

                }
            </div>
        </nav>
    )
}

export default Header