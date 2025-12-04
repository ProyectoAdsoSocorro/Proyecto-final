import jwt from 'jsonwebtoken';
import User from '../models/users.js';

const authPeriodos = async (req, res, next) => {
    try {
        // 1. Verificar Token
        const token = req.header("x-token");
        if (!token) {
            return res.status(401).json({
                message: "No hay token en la petición"
            });
        }

        let uid;
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            uid = payload.uid;
        } catch (error) {
            return res.status(401).json({
                message: "Token no válido"
            });
        }

        // 2. Obtener Usuario
        const user = await User.findById(uid);
        if (!user) {
            return res.status(401).json({
                message: "Usuario no existe"
            });
        }

        // Adjuntar usuario a la request
        req.user = user;

        // 3. Verificar Roles
        const userRoles = Array.isArray(user.roles) ? user.roles : (user.role ? [user.role] : []);
        const httpMethod = req.method;

        console.log('🔍 DEBUG authPeriodos:');
        console.log('  Usuario:', user.email);
        console.log('  user.roles (raw):', user.roles);
        console.log('  userRoles (procesado):', userRoles);
        console.log('  Método HTTP:', httpMethod);

        let isAuthorized = false;

        if (httpMethod === 'GET') {
            const allowedRoles = ['rector', 'coordinador', 'secretaria'];
            isAuthorized = userRoles.some(role => allowedRoles.includes(role));
            console.log('  Roles permitidos para GET:', allowedRoles);
            console.log('  ¿Autorizado?:', isAuthorized);
        } else if (['POST', 'PUT', 'DELETE'].includes(httpMethod)) {
            const requiredRole = 'secretaria';
            isAuthorized = userRoles.includes(requiredRole);
            console.log('  Rol requerido para', httpMethod + ':', requiredRole);
            console.log('  ¿Autorizado?:', isAuthorized);
        }

        if (isAuthorized) {
            next();
        } else {
            return res.status(403).json({
                message: `Este usuario no tiene permiso para realizar esta acción. Se requiere rol de ${httpMethod === 'GET' ? 'rector, coordinador o secretaria' : 'secretaria'}.`
            });
        }

    } catch (error) {
        console.error('Error en middleware de autenticación de periodos:', error);
        return res.status(500).json({
            message: 'Error interno del servidor.'
        });
    }
};

export { authPeriodos };
