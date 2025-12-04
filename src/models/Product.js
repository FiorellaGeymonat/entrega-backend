import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  code: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  category: { type: String, index: true },
  thumbnails: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
