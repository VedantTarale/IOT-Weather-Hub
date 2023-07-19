import { useContext, useEffect, useState } from "react"
import styles from "../assets/styles"
import { Link, Navigate } from "react-router-dom"
import UserContext from "../UserContext"
const NavBar = () => {
    const { setUserInfo, userInfo } = useContext(UserContext)
    const [redirect,setRedirect] = useState(false)
    useEffect(()=>{
        setRedirect(false)
    },[])
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: "include",
        }).then(response => {
            response.json().then(json => {
                setUserInfo(json)
            })
        })
    }, [setUserInfo])
    function logout() {
        fetch('http://localhost:4000/logout', {
            credentials: "include",
            method: 'POST'
        })
        setUserInfo(null)
        setRedirect(true)
    }
    const username = userInfo?.username
    return (
        <>
            <div className="w-full flex items-center justify-between mt-2">
                <div className={styles.heading}></div>
                <div className={styles.heading}>
                    IOT WEATHER HUB
                </div>
                <div className={styles.btns}>

                    {username && (
                        <>
                            <div className="text-primary flex justify-center items-center text-2xl">
                                Hello {username}
                            </div>
                            <button onClick={logout} className={styles.login_reg}>Logout</button>
                        </>
                    )}
                    {!username && (
                        <>
                            <Link to="/login" className={styles.login_reg}>Login</Link>
                            <Link to="/register" className={styles.login_reg}>Register</Link>
                        </>
                    )}

                </div>
            </div>
            {redirect && (
                <Navigate to={'/landing'}/>
            )} 
        </>
    )
}
export default NavBar