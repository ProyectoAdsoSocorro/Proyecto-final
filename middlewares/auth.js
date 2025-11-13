/**
 * NOTA IMPORTANTE:
 * Este middleware está pensado para autenticación local. Si el token
 * es generado por un módulo externo, este archivo debería:
 * 1) Adaptarse para validar esos tokens, o
 * 2) Archivarse/comentarse si la validación es manejada externamente
 *
 * Headers esperados:
 * Authorization: Bearer <token>
 */

import jwt from 'jsonwebtoken';
import SchoolUsers from '../models/usersSchool.js';

const auth = async (req, res, next) => {
  // Extraer y validar formato del header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token no proporcionado o inválido' });

  // Obtener el token sin el prefijo 'Bearer '
  const token = authHeader.split(' ')[1];
  
  try {
    // Verificar firma y expiración del token usando JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar el usuario en la base de datos y excluir el campo password
    req.user = await SchoolUsers.findById(decoded.id).select('-password');
    
    // Validar que el usuario aún existe en la base de datos
    if (!req.user) return res.status(401).json({ message: 'Usuario no encontrado' });
    
    // Permitir que la petición continúe
    next();
  } catch (error) {
    // Captura errores de verificación de JWT (firma inválida, token expirado, etc)
    res.status(401).json({ message: 'Token inválido o caducado' });
  }
};

export default auth;
