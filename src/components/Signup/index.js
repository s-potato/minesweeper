import { useState } from "react";
import { useNavigate } from "react-router-dom"
import md5 from "md5";
import "./style.css"
import { getUser, setUser } from "../../utils/firebase/user";

function Signup() {
    const navigate = useNavigate();
    const [account, setAccout] = useState({ username: "", password: "", cpassword: "" })
    const [invalidUsername, setInvalidUsername] = useState(undefined)
    const [invalidPassword, setInvalidPassword] = useState(undefined)
    const [invalidCPassword, setInvalidCPassword] = useState(undefined)

    const handleSubmit = e => {
        let errorFlag = false
        e.preventDefault();
        if (account.username.length < 6 || account.username.length > 30) {
            setInvalidUsername("Username must be between 6 and 30 characters.")
            errorFlag = true
        }

        if (account.password.length < 6 || account.password.length > 30) {
            setInvalidPassword("Password must be between 6 and 30 characters.")
            errorFlag = true
        }

        if (account.password !== account.cpassword) {
            setInvalidPassword("Password and Confirm password must be match.")
            errorFlag = true
        }

        if(!errorFlag){
            setInvalidUsername(undefined)
            setInvalidPassword(undefined)
            setInvalidCPassword(undefined)
            handleSignup({...account})
        }
    }

    const handleSignup = account => {
        let user = {
            id: md5(account.username),
            username: account.username,
            password: md5(account.password)
        }

        getUser(user.id).then(data => {
            if(!data) {
                setUser(user)
                localStorage.setItem('user', JSON.stringify(user))
                navigate('/')
            } else {
                setInvalidUsername("This username has been used")
            }
        })
    }

    return (
        <div className="container is-fullheight">
            <div className="columns is-centered is-vcentered is-fullheight">
                <div className="column is-4">
                    <form className="box">
                        <a href="/" className="logo-containter">
                            <img src='mines.png' className="logo" alt="Minesweeper" />
                        </a>
                        <div className="block has-text-centered is-size-3">Signup</div>
                        <div className="field">
                            <label className="label" htmlFor="username">Username</label>
                            <div className="control has-icons-left">
                                <input className={invalidUsername ? "input is-danger" : "input"} type="text" name="username" placeholder="example" onChange={e => setAccout({ ...account, username: e.target.value })} />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-user"></i>
                                </span>
                            </div>
                            {invalidUsername &&
                                <p className="help is-danger">{invalidUsername}</p>
                            }
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="password">Password</label>
                            <div className="control has-icons-left">
                                <input className={invalidPassword ? "input is-danger" : "input"} type="password" name="password" placeholder="********" onChange={e => setAccout({ ...account, password: e.target.value })} />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                            {invalidPassword &&
                                <p className="help is-danger">{invalidPassword}</p>
                            }
                        </div>
                        <div className="field">
                            <label className="label" htmlFor="password">Confirm password</label>
                            <div className="control has-icons-left">
                                <input className={invalidCPassword ? "input is-danger" : "input"} type="password" name="cpassword" placeholder="********" onChange={e => setAccout({ ...account, cpassword: e.target.value })} />
                                <span className="icon is-small is-left">
                                    <i className="fa fa-lock"></i>
                                </span>
                            </div>
                            {invalidCPassword &&
                                <p className="help is-danger">{invalidCPassword}</p>
                            }
                        </div>
                        <div className="buttons is-centered">
                            <button className="button is-primary" onClick={handleSubmit}>Signup</button>
                        </div>
                        <div className="columns is-centered">
                            <div className="column">
                                <p className="has-text-centered">Login with Google</p>
                                <div className="has-text-centered">
                                    <button className="button is-normal">
                                        <span className="icon">
                                            <img width="40px" alt="Google sign-in" src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="column">
                                <p className="has-text-centered">Have an account?</p>
                                <div className="has-text-centered">
                                    <button className="button is-normal" onClick={e=>{e.preventDefault(); navigate('/login')}}>
                                        Login
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup