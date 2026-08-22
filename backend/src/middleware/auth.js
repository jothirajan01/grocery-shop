const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

async function authenticate(req, res, next) {
  try {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Authentication required' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user || !user.active) return res.status(401).json({ message: 'Invalid user' });
    req.user = user;
    next();
  } catch { res.status(401).json({ message: 'Invalid or expired token' }); }
}
function authorize(...roles) { return (req, res, next) => roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Permission denied' }); }
module.exports = { authenticate, authorize };
