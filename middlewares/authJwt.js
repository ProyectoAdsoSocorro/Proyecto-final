/* 
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_KEY || 'clave_super_secreta';

export function generateToken(payload) {
  return jwt.sign(payload, secretKey);
}


export function verifyToken(req, res, next) {

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
 */
