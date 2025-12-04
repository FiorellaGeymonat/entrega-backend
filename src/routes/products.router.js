import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

// GET /api/products?limit=&page=&sort=asc|desc&query=category:Bakery|availability:true|title:abc
router.get('/', async (req, res, next) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;

    const lim = Math.max(parseInt(limit) || 10, 1);
    const pg  = Math.max(parseInt(page)  || 1, 1);

    // Filtro
    let filter = {};
    if (query) {
      const [field, value] = String(query).split(':');
      if (field && value !== undefined) {
        if (field === 'category') filter.category = value;
        if (field === 'availability') filter.stock = value === 'true' ? { $gt: 0 } : 0;
        if (field === 'title') filter.title = new RegExp(value, 'i');
      }
    }

    // Orden por precio
    let sortObj = {};
    if (sort === 'asc') sortObj.price = 1;
    if (sort === 'desc') sortObj.price = -1;

    const total = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(total / lim), 1);
    const prevPage = pg > 1 ? pg - 1 : null;
    const nextPage = pg < totalPages ? pg + 1 : null;

    const docs = await Product.find(filter)
      .sort(sortObj)
      .skip((pg - 1) * lim)
      .limit(lim);

    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const makeLink = (p) =>
      p ? `${baseUrl}?limit=${lim}&page=${p}${sort ? `&sort=${sort}` : ''}${query ? `&query=${encodeURIComponent(query)}` : ''}` : null;

    res.json({
      status: 'success',
      payload: docs,
      totalPages,
      prevPage,
      nextPage,
      page: pg,
      hasPrevPage: prevPage !== null,
      hasNextPage: nextPage !== null,
      prevLink: makeLink(prevPage),
      nextLink: makeLink(nextPage),
    });
  } catch (err) { next(err); }
});

// POST crear
router.post('/', async (req, res, next) => {
  try {
    const created = await Product.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

// PUT actualizar
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { next(err); }
});

// DELETE eliminar
router.delete('/:id', async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;
