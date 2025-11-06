// middlewares/jwtHandler.js
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_KEY || 'clave_super_secreta';

// Función para generar un token "infinito" (sin expiración)
export function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}

// Middleware para verificar el token en rutas protegidas
export function verifyToken(req, res, next) {
  // Acepta token directo en 'x-token' o en 'authorization' (sin "Bearer "),
  // y también maneja "Bearer <token>" por compatibilidad.
  const authHeader = req.header('x-token') || req.header('authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
}
