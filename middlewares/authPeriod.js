const mongoose = require('mongoose');

// Asumimos que existe una colección userschools en MongoDB
const UserSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.userschools || mongoose.model('userschools', UserSchema);

const authPeriodosFlexible = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ 
                message: 'Acceso no autorizado. Debe iniciar sesión.' 
            });
        }

        const userId = req.user._id;
        const user = await User.findById(userId);
        
        if (!user || !user.rol) {
            return res.status(401).json({ 
                message: 'Usuario no encontrado o sin rol asignado.' 
            });
        }

        const userRole = user.rol;
        const httpMethod = req.method;
        
        let isAuthorized = false;

        if (httpMethod === 'GET') {
            const allowedRoles = ['rector', 'coordinador', 'secretaria'];
            isAuthorized = allowedRoles.includes(userRole);

        } else if (httpMethod === 'POST' || httpMethod === 'PUT' || httpMethod === 'DELETE') {
            const requiredRole = 'secretaria';
            isAuthorized = (userRole === requiredRole);

        } else {
            isAuthorized = false;
        }

        if (isAuthorized) {
            req.user.role = userRole;
            next();
        } else {
            return res.status(403).json({ 
                message: `Acceso denegado: el rol '${userRole}' no puede realizar la acción '${httpMethod}'.` 
            });
        }
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(500).json({ 
            message: 'Error interno al verificar permisos.' 
        });
    }
};

module.exports = {
  authPeriodosFlexible
};
