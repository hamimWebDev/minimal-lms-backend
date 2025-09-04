import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

export const Counter = mongoose.model('Counter', counterSchema);

export const generateAdminUserId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'admin' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const newId = `A-${counter.value.toString().padStart(4, '0')}`;
  return newId;
};
