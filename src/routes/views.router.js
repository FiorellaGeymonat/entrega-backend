import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

router.get('/products', async (req, res, next) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).lean(),
      Product.countDocuments()
    ]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.render('products', {
      products,
      page: Number(page),
      hasPrevPage: Number(page) > 1,
      hasNextPage: Number(page) < totalPages,
      prevPage: Number(page) - 1,
      nextPage: Number(page) + 1
    });
  } catch (e) { next(e); }
});

router.get('/carts/:cid', async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { add } = req.query;

    if (add) {
      const cartDoc = await Cart.findById(cid);
      const existing = cartDoc.products.find(p => String(p.product) === add);
      if (existing) existing.quantity += 1;
      else cartDoc.products.push({ product: add, quantity: 1 });
      await cartDoc.save();
    }

    const cart = await Cart.findById(cid)
      .populate('products.product')
      .lean();

    res.render('cart', { cart });
  } catch (e) { next(e); }
});

router.post('/carts/:cid/products/:pid', async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const qty = Number(req.body.quantity) || 1;

    const cartDoc = await Cart.findById(cid);
    const existing = cartDoc.products.find(p => String(p.product) === pid);
    if (existing) existing.quantity += qty;
    else cartDoc.products.push({ product: pid, quantity: qty });

    await cartDoc.save();
    res.redirect(`/carts/${cid}`);
  } catch (e) { next(e); }
});

export default router;
