import coreDirection from '../models/coreDirection.js';
import jwt from 'jsonwebtoken';

// CORRECCIÓN: Usar la misma variable de entorno en ambos lugares
const secretKey = process.env.JWT_SECRET || 'clave_super_secreta';

const generateTokenAdmin = (user) => {
  // Crear payload con la estructura correcta
  const payload = {
    uid: user._id,  // Usar 'uid' para consistencia
    email: user.email,
    role: user.role  // Incluir el rol en el token
  };
  
  // Agregar expiración por seguridad
  return jwt.sign(payload, secretKey, { expiresIn: '24h' });
}

const verifyTokenAdmin = async (req, res, next) => {
  try {
    const authHeader = req.header('x-token') || req.header('authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'Token no proporcionado' 
      });
    }

    // Extraer el token si viene con "Bearer "
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    console.log('Token recibido:', token.substring(0, 20) + '...');

    // Usar la misma secretKey
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          message: 'Token expirado' 
        });
      }
      console.error('Error verificando token:', error.message);
      return res.status(401).json({ 
        success: false,
        message: 'Token inválido' 
      });
    }

    // Buscar uid o _id según lo que tenga el token
    const userId = decoded.uid || decoded._id || decoded.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: 'Token no contiene información de usuario válida' 
      });
    }

    // Buscar usuario en la base de datos
    let user = await coreDirection.findById(userId).select('role name email');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Convertir a objeto plano y asegurar estructura
    req.user = {
      id: user._id,
      role: user.role || decoded.role,  // Usar rol de BD o del token
      name: user.name,
      email: user.email
    };

    console.log('Usuario autenticado:', req.user);
    next();
  } catch (error) {
    console.error('Error en verifyTokenAdmin:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Error interno del servidor' 
    });
  }
};

const roleCheckCore = (allowedRole) => {
  return (req, res, next) => {
    // Verificar que existe un usuario autenticado
    const user = req.user;
    console.log(user)
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'No autenticado' 
      });
    }

    // Verificar que el usuario tiene un rol asignado
    if (!user.role) {
      return res.status(403).json({ 
        success: false,
        message: 'Usuario sin rol asignado' 
      });
    }

    // Verificar que el rol del usuario coincide con el rol permitido
    if (user.role !== allowedRole) {
      return res.status(403).json({ 
        success: false,
        message: `Acceso denegado. Se requiere rol: ${allowedRole}. Tu rol: ${user.role}` 
      });
    }

    // Si el rol es válido, continuar
    next();
  };
}

export { generateTokenAdmin, verifyTokenAdmin, roleCheckCore }