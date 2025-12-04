import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('Missing MONGO_URI in .env');
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'ecommerce' });
  console.log('🗄️  MongoDB connected');
}
