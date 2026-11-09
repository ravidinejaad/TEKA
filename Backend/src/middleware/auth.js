import jwt from 'jsonwebtoken';

// Verify JWT Token
export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer token"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      data: null
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token telah kadaluarsa. Silakan login kembali.',
        data: null
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid',
      data: null
    });
  }
}

// Role-based Authorization
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Silakan login terlebih dahulu',
        data: null
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Anda tidak memiliki akses ke resource ini',
        data: null
      });
    }

    next();
  };
}

// Generate JWT Token
export function generateToken(userId, email, role) {
  return jwt.sign(
    {
      id_user: userId,
      email: email,
      role: role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

// Generate Refresh Token
export function generateRefreshToken(userId, email, role) {
  return jwt.sign(
    {
      id_user: userId,
      email: email,
      role: role
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );
}
