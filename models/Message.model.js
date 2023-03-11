const mongoose = require('mongoose')

const messageSchema = mongoose.Schema(
  {
    message: {
      text: {
        type: String,
        required: true,
      },
    },
    users: Array,
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
)

const Messages = mongoose.model('Messages', messageSchema)
module.exports = Messages
