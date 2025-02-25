import mongoose from 'mongoose'

// Chat Schema
const chatSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  messages: [{
    content: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
})

// Export models (with error handling for hot reloading)
export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema)