import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    user: { type: String, default: 'Anon' },
    text: { type: String, required: true },
    ts: { type: Number, default: () => Date.now() }
  },
  { timestamps: true }
);

export const Message = mongoose.model('Message', messageSchema);
