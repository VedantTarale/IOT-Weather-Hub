import styles from "../assets/styles"
import { useContext, useState } from "react"
import {Navigate} from 'react-router-dom'
import UserContext from "../UserContext"
const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)
    const {setUserInfo} = useContext(UserContext)
    async function login(ev){
        ev.preventDefault()
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: "include"
        })
        if(response.ok){
            response.json().then(userInfo => {
                setUserInfo(userInfo)
                setRedirect(true)
            })
        }
        else if (response.ok === false)
            alert("Wrong Credentials!!")
    }
    if(redirect){
        return (
            <Navigate to={'/home'}/>
        )
    }
    return (
        <>
            <div className="flex justify-center items-center mt-20">
                <form method="post" className={styles.log_reg_form} onSubmit={login}>
                    <input className={styles.text_input} placeholder="Username" type="text" name="username" id="username" value={username} onChange={ev => setUsername(ev.target.value)} />
                    <input className={styles.text_input} placeholder="Password" type="password" name="password" id="passowrd" value={password} onChange={ev => setPassword(ev.target.value)} />
                    <div className="flex justify-center">
                        <input className={styles.submit} type="submit" value="Login" />
                    </div>
                </form>
            </div>
        </>
    )
}
export default Login