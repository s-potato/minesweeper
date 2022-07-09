import { useState } from "react"
import './style.css'


function Header({activeLink}) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const user = JSON.parse(localStorage.getItem("user"))

    return (
        <nav className="navbar" role="navigation" aria-label="main navigation">
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
                <a className={activeLink === "history" ? "navbar-item is-active" : "navbar-item"} href="/">
                    History
                </a>
                <a className={activeLink === "ranking" ? "navbar-item is-active" : "navbar-item"} href="/">
                    Ranking
                </a>
            </div>

            <div className="navbar-end">
                <div className="navbar-item has-dropdown is-hoverable">
                    <span className="navbar-link">{user.username}
                    </span>
                    <div className="navbar-dropdown is-right">
                        <a href="/" className="navbar-item">
                            Statistics
                        </a>
                        <a href="/" className="navbar-item" onClick={e => localStorage.removeItem("user")}>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Header