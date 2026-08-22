const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const adminHash = await bcrypt.hash('admin123', 10);
  const cashierHash = await bcrypt.hash('cashier123', 10);
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', name: 'Store Admin', passwordHash: adminHash, role: 'ADMIN' } });
  await prisma.user.upsert({ where: { username: 'cashier' }, update: {}, create: { username: 'cashier', name: 'Main Cashier', passwordHash: cashierHash, role: 'CASHIER' } });
  const categories = ['Staples', 'Beverages', 'Snacks', 'Personal Care'];
  for (const name of categories) await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  const staples = await prisma.category.findUnique({ where: { name: 'Staples' } });
  const beverages = await prisma.category.findUnique({ where: { name: 'Beverages' } });
  const snacks = await prisma.category.findUnique({ where: { name: 'Snacks' } });
  const care = await prisma.category.findUnique({ where: { name: 'Personal Care' } });
  const demo = [
    ['RICE-001','890100000001','Rice 5kg','Kg',320,380,400,45,5,true,5,staples.id],
    ['SUGAR-001','890100000002','Sugar 1kg','Kg',42,50,52,80,10,false,0,staples.id],
    ['OIL-001','890100000003','Cooking Oil 1L','Litre',110,135,145,38,8,true,5,staples.id],
    ['TEA-001','890100000004','Tea 250g','Packet',90,115,120,25,5,true,5,beverages.id],
    ['BIS-001','890100000005','Butter Biscuits','Packet',20,25,25,12,10,true,18,snacks.id],
    ['SOAP-001','890100000006','Bath Soap','Piece',28,35,38,6,10,true,18,care.id],
    ['SALT-001','890100000007','Salt 1kg','Packet',18,22,22,60,10,false,0,staples.id]
  ];
  for (const [sku, barcode, name, unit, purchasePrice, sellingPrice, mrp, stock, minStockLevel, gstApplicable, gstPercentage, categoryId] of demo) {
    await prisma.product.upsert({ where: { sku }, update: {}, create: { sku, barcode, name, unit, purchasePrice, sellingPrice, mrp, openingStock: stock, currentStock: stock, minStockLevel, gstApplicable, gstPercentage, categoryId } });
  }
  for (const rate of [0, 5, 12, 18, 28]) await prisma.gstRate.upsert({ where: { rate }, update: {}, create: { rate } });
  await prisma.shopSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1, shopName: 'Green Basket Grocery', address: 'Chennai, Tamil Nadu', phone: '9000000000' } });
  await prisma.customer.upsert({ where: { id: 1 }, update: {}, create: { id: 1, name: 'Walk-in Customer', phone: '' } });
}
main().finally(() => prisma.$disconnect());
