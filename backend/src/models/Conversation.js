import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Message',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    unreadCount: {
      customer: {
        type: Number,
        default: 0,
      },
      admin: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ customer: 1 });
conversationSchema.index({ admin: 1 });
conversationSchema.index({ status: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
