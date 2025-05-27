import mongoose from 'mongoose';

const TipSchema = new mongoose.Schema({
  author: { type: String, required: true },
  tip:    { type: String, required: true },
}, {
  timestamps: true     // ← adds createdAt + updatedAt
});

export default mongoose.model('Tip', TipSchema);
