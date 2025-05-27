import mongoose from 'mongoose';
const Name = new mongoose.Schema({
  name: { type: String, required: true },
});
export default mongoose.model('Name', Name);
