const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !user.active || !(await bcrypt.compare(password || '', user.passwordHash))) return res.status(401).json({ message: 'Invalid username or password' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, name: user.name, role: user.role } });
  } catch (e) { next(e); }
});
module.exports = router;
