const mongoose = require('mongoose')
const {Schema,model} = mongoose

const ReadingSchema = new Schema({
    temprature: {type: Number, required: true},
    time: {type: Date, required: true},
    sensor: {type: mongoose.Schema.Types.ObjectID, ref: 'Sensor'},
})

const ReadingModel = model('Reading', ReadingSchema)

module.exports = ReadingModel