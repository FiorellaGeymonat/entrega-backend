import { Router } from 'express';
import Cart from '../models/Cart.js';

const router = Router();

// Crear carrito
router.post('/', async (req, res, next) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (err) { next(err); }
});

// Obtener carrito con populate
router.get('/:cid', async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    res.json(cart);
  } catch (err) { next(err); }
});

// Agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { quantity = 1 } = req.body;
    const cart = await Cart.findById(req.params.cid);
    const existing = cart.products.find(p => String(p.product) === req.params.pid);
    if (existing) existing.quantity += Number(quantity) || 1;
    else cart.products.push({ product: req.params.pid, quantity: Number(quantity) || 1 });
    await cart.save();
    await cart.populate('products.product');
    res.json(cart);
  } catch (err) { next(err); }
});

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.products = cart.products.filter(p => String(p.product) !== req.params.pid);
    await cart.save();
    res.status(204).end();
  } catch (err) { next(err); }
});

// Reemplazar TODOS los productos
router.put('/:cid', async (req, res, next) => {
  try {
    const { products } = req.body; // [{product, quantity}, ...]
    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products: products || [] },
      { new: true, runValidators: true }
    ).populate('products.product');
    res.json(cart);
  } catch (err) { next(err); }
});

// Actualizar SOLO quantity
router.put('/:cid/products/:pid', async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      const e = new Error('Quantity must be a positive number');
      e.status = 400; throw e;
    }
    const cart = await Cart.findById(req.params.cid);
    const item = cart.products.find(p => String(p.product) === req.params.pid);
    if (!item) { const e = new Error('Product not found in cart'); e.status = 404; throw e; }
    item.quantity = quantity;
    await cart.save();
    await cart.populate('products.product');
    res.json(cart);
  } catch (err) { next(err); }
});

// Vaciar carrito
router.delete('/:cid', async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    cart.products = [];
    await cart.save();
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
