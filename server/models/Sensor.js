const mongoose = require('mongoose')
const {Schema,model} = mongoose

const SensorSchema = new Schema({
    sensor_name: {type: String, required: true, unique: true},
    type: {type: String, required: true},
    location: {type:String, required: true},
    user: {type: mongoose.Schema.Types.ObjectID, ref: 'User'}

})

const SensorModel = model('Sensor', SensorSchema)

module.exports = SensorModel