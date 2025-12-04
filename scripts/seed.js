import 'dotenv/config';
import mongoose from 'mongoose';
import Product from '../src/models/Product.js';

const items = [
  { title: 'Pancake Protein 1', description: 'Vainilla', code: 'SKU001', price: 9.99, stock: 50, category: 'Bakery' },
  { title: 'Pancake Protein 2', description: 'Chocolate', code: 'SKU002', price: 11.5, stock: 35, category: 'Bakery' },
  { title: 'Shaker', description: '700ml', code: 'SKU003', price: 6.0, stock: 120, category: 'Accessories' }
];

async function run() {
  const uri = process.env.MONGO_URI;
  await mongoose.connect(uri, { dbName: process.env.MONGO_DB || 'ecommerce' });
  await Product.deleteMany({});
  await Product.insertMany(items);
  console.log('✅ Seed done');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
