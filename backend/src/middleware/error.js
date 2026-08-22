function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.code === 'P2002') return res.status(409).json({ message: 'A record with this unique value already exists' });
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
}
module.exports = errorHandler;
