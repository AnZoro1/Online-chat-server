const Messages = require('../models/Message.model')

module.exports.MessagesController = {
  addMessage: async (req, res) => {
    try {
      const { from, to, message } = req.body
      const data = await Messages.create({
        message: { text: message },
        users: [from, to],
        sender: from,
      })

      if (data) {
        return res.json({ msg: 'Message added successfully' })
      } else {
        return res.json({ msg: 'Failed to add message to the database' })
      }
    } catch (err) {
      return res.json({ error: err })
    }
  },
  getAllMessages: async (req, res) => {
    try {
      const { from, to } = req.body
      const messages = await Messages.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updateAt: 1 })

      const projectMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        }
      })
      res.json(projectMessages)
    } catch (err) {
      return res.json({ error: err })
    }
  },
}
