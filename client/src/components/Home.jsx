import { useState, useEffect, useContext } from "react"
import UserContext from "../UserContext"
import styles from "../assets/styles"
import Chart from "./Chart"
const Home = () => {
    const { setUserInfo, userInfo } = useContext(UserContext)
    const [sensor, setSensor] = useState(null)
    const [selectedSensor, setSelectedSensor] = useState(null)
    const [tempearatures, setTemperatures] = useState(null)
    const [dates, setDates] = useState(null)
    useEffect(() => {
        console.log(tempearatures); // Display updated state value
    }, [tempearatures]);
    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: "include",
        }).then(response => {
            response.json().then(json => {
                setUserInfo(json)
            })
        })
    }, [setUserInfo])
    const username = userInfo?.username
    useEffect(() => {
        fetch(`http://localhost:4000/sensor/${username}`, {
            method: 'GET',
            credentials: "include"
        })
            .then(response => response.json())
            .then(json => {
                const sensorNames = json.map(item => item.sensor_name);
                setSensor(sensorNames);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [username])
    async function getData(ev) {
        ev.preventDefault()
        if (selectedSensor) {
            const response = await fetch(`http://localhost:4000/readings/${selectedSensor}`, {
                method: 'GET',
                credentials: "include"
            })
            if (response) {
                response.json().then(json => {
                    const temps = json.map(({ temprature }) => temprature);
                    const times = json.map(({ time }) => {
                        let date = new Date(time);
                        return date.toLocaleString();
                    });

                    setTemperatures(temps); // Store temperatures as an array
                    setDates(times); // Store times as an array
                });
            }

            else
                alert("Something Went Wrong!!")
        }
    }
    return (
        <>
            <div className="flex justify-center text-white mt-20">
                <form className={styles.log_reg_form} onSubmit={getData}>
                    {sensor && (
                        <>
                            <label htmlFor="sensor_name" className="text-primary text-2xl font-serif">Select Sensor: </label>
                            <select id="sensor_name" name="sensor_name" className={styles.text_input} value={selectedSensor} onChange={ev => setSelectedSensor(ev.target.value)}>
                                <option value="">Select an option</option>
                                {sensor.map((name, index) => (
                                    <option key={index} value={name}>{name}</option>
                                ))}
                            </select>
                        </>
                    )}
                    <div className="flex justify-center">
                        <input className={styles.submit} type="submit" value="Get Data" />
                    </div>

                </form>
            </div>
            <div className="flex justify-center items-center max-h-[40vh] w-full mt-10">
                {
                    tempearatures && dates && (
                        <Chart chartdata={{ labels: dates, datasets: [{ label: "Temperature", data: tempearatures, fill: false, backgroundColor: "#ECB365", borderColor: "#ECB365"}]}} />
                    )
                }
            </div>
        </>
    )
}
export default Home