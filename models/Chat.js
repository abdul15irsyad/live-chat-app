const mongoose = require('mongoose')

// make schema model
const chatSchema = mongoose.Schema({
  from: {type: String,required: true},
  to: {type: String,required: true},
  message: {type: String,required: true},
})

const Chat = mongoose.model("chat",chatSchema)

module.exports = Chat