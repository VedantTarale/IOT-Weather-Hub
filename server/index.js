// Express
const express = require('express')
const app = express()

// CORS
const cors = require('cors')

// DB
const { default: mongoose } = require('mongoose')
const User = require('./models/User')
const Sensor = require('./models/Sensor')
const Reading = require('./models/Reading')

// Hashing
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);

//JWT
const jwt = require("jsonwebtoken")
const jwt_key = "afd4fasdg867433w53325[...[].'//';'/"

// Cookie-parser
const cookieParser = require('cookie-parser')

app.use(cors({ credentials: true, origin: "http://localhost:5173" }))
app.use(express.json())
app.use(cookieParser())

mongoose.connect("mongodb://localhost:27017/IOT_db", { useNewUrlParser: true });

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    try {
        const userDoc = await User.create({ username, password: bcrypt.hashSync(password, salt) })
        res.json(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const userDoc = await User.findOne({ username })
    const match = bcrypt.compareSync(password, userDoc.password)
    if (match) {

        jwt.sign({ username, id: userDoc.id }, jwt_key, {}, (err, token) => {
            if (err) res.json({"status":"error"})
            res.cookie('token', token).json({ id: userDoc._id, username })
        })
    }
    else {
        res.status(401).json({ "login": "unsuccessful" })
    }
})

app.get('/profile', (req, res) => {
    const { token } = req.cookies
    jwt.verify(token, jwt_key, {}, (err, info) => {
        if (err) res.json({"error": "failure!"})
        else res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie("token", "").json("success")
})
app.post('/send_data', async (req, res) => {
    const { sensor_name, location, temp, type, user } = req.body
    let sensorDoc = await Sensor.findOne({ sensor_name: sensor_name })
    let userDoc = await User.findOne({username: user})
    if (sensorDoc && userDoc) {
        try {
            const readingDoc = await Reading.create(
                { temprature: temp,
                  time: new Date(),
                  sensor: sensorDoc._id,
                }
            )
        } catch (error) {
            res.json({"staus":"error"})
        }
    }
    else if(userDoc){
        try {
            sensorDoc = await Sensor.create(
                { sensor_name: sensor_name, 
                  type: type, 
                  location: location,
                  user: userDoc._id  
                }
            )
            try {
                const readingDoc = await Reading.create(
                    { temprature: temp, 
                      time: new Date(),
                      sensor: sensorDoc._id,
                    },
                )
            } catch (error) {
                res.json({"status":"error"})
            }
        } catch (error) {
            res.json({"status":"error"})
        }
    }
    res.status(200).json(req.body)
})
app.get('/readings/:sensor_name',async(req,res)=>{
    const {sensor_name} = req.params
    const sensorDoc = await Sensor.findOne({sensor_name})
    const readingDoc = await Reading.find({sensor: sensorDoc._id}).sort({ time: -1 }).limit(50)
    res.json(readingDoc)
})
app.get('/sensor/:username', async (req, res) => {
    const { username } = req.params;
    if (username) {
      const userDoc = await User.findOne({ username });
      if (userDoc) {
        const sensorDoc = await Sensor.find({ user: userDoc._id });
        res.json(sensorDoc);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } else {
      res.status(400).json({ message: 'Invalid username' });
    }
  });
app.listen(4000)