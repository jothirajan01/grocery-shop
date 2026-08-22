const router = require('express').Router();
const prisma = require('../config/prisma');
const { authenticate, authorize } = require('../middleware/auth');
router.use(authenticate);
router.get('/', async (req, res, next) => { try {
  const { q, lowStock, categoryId } = req.query;
  const where = { active: true, ...(categoryId ? { categoryId: Number(categoryId) } : {}), ...(q ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }, { barcode: { contains: q } }] } : {}) };
  let products = await prisma.product.findMany({ where, include: { category: true, supplier: true }, orderBy: { name: 'asc' } });
  if (lowStock === 'true') products = products.filter(p => Number(p.currentStock) <= Number(p.minStockLevel));
  res.json(products);
} catch(e) { next(e); } });
router.post('/', authorize('ADMIN'), async (req, res, next) => { try {
  const b = req.body; if (!b.sku || !b.name) return res.status(400).json({ message: 'SKU and product name are required' });
  const product = await prisma.product.create({ data: { sku: b.sku, barcode: b.barcode || null, name: b.name, brand: b.brand || null, unit: b.unit || 'Piece', purchasePrice: Number(b.purchasePrice || 0), sellingPrice: Number(b.sellingPrice || 0), mrp: Number(b.mrp || 0), openingStock: Number(b.openingStock || 0), currentStock: Number(b.openingStock || 0), minStockLevel: Number(b.minStockLevel || 0), gstApplicable: Boolean(b.gstApplicable), gstPercentage: Number(b.gstPercentage || 0), hsnSac: b.hsnSac || null, categoryId: b.categoryId ? Number(b.categoryId) : null, supplierId: b.supplierId ? Number(b.supplierId) : null, expiryDate: b.expiryDate ? new Date(b.expiryDate) : null } });
  if (Number(b.openingStock || 0) > 0) await prisma.stockTransaction.create({ data: { productId: product.id, userId: req.user.id, type: 'OPENING', quantity: Number(b.openingStock), notes: 'Opening stock' } });
  res.status(201).json(product);
} catch(e) { next(e); } });
router.put('/:id', authorize('ADMIN'), async (req, res, next) => { try {
  const b = req.body; const product = await prisma.product.update({ where: { id: Number(req.params.id) }, data: { name: b.name, barcode: b.barcode || null, brand: b.brand || null, unit: b.unit, purchasePrice: Number(b.purchasePrice || 0), sellingPrice: Number(b.sellingPrice || 0), mrp: Number(b.mrp || 0), minStockLevel: Number(b.minStockLevel || 0), gstApplicable: Boolean(b.gstApplicable), gstPercentage: Number(b.gstPercentage || 0), hsnSac: b.hsnSac || null, categoryId: b.categoryId ? Number(b.categoryId) : null, supplierId: b.supplierId ? Number(b.supplierId) : null, active: b.active !== false, expiryDate: b.expiryDate ? new Date(b.expiryDate) : null } }); res.json(product);
} catch(e) { next(e); } });
router.delete('/:id', authorize('ADMIN'), async (req, res, next) => { try { await prisma.product.update({ where: { id: Number(req.params.id) }, data: { active: false } }); res.json({ message: 'Product deactivated' }); } catch(e) { next(e); } });
module.exports = router;
