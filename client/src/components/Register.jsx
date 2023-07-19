import { useState } from "react"
import styles from "../assets/styles"

const Register = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    async function register(ev) {
        ev.preventDefault()
        const response = await fetch('http://localhost:4000/register', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
        })
        if(response.status === 200)
            alert("Registration Successful!!")
        else if (response.ok === false)
            alert("Registration Unsuccessful!!")
    }

    return (
        <>
            <div className="flex justify-center items-center mt-20">
                <form method="post" className={styles.log_reg_form} onSubmit={register}>
                    <input className={styles.text_input} placeholder="Username" type="text" name="username" id="username" value={username} onChange={ev => setUsername(ev.target.value)} />
                    <input className={styles.text_input} placeholder="Password" type="password" name="password" id="passowrd" value={password} onChange={ev => setPassword(ev.target.value)} />
                    <div className="flex justify-center">
                        <input className={styles.submit} type="submit" value="Register" />
                    </div>
                </form>
            </div>
        </>
    )
}
export default Register