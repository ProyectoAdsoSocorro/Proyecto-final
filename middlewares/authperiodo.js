// middlewares/authPeriodo.js
// const authPeriod = (req, res, next) => {
//   console.log('🔍 Middleware authPeriod ejecutado');

//   if (!req.user) {
//     console.log('❌ req.user no existe');
//     return res.status(401).json({ message: 'Acceso no autorizado: usuario no autenticado' });
//   }

//   if (!req.user.role) {
//     console.log('❌ req.user.role no existe');
//     return res.status(401).json({ message: 'Acceso no autorizado: rol no definido' });
//   }

//   const role = req.user.role;
//   console.log('✅ Rol extraído:', role);

//   const allowedRoles = ['rector', 'coordinador', 'secretaria'];
//   if (!allowedRoles.includes(role)) {
//     console.log('❌ Rol no permitido:', role);
//     return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });
//   }

//   if (role === 'secretaria') {
//     console.log('✅ Secretaria → permite todo');
//     return next();
//   }

//   if (['rector', 'coordinador'].includes(role) && req.method === 'GET') {
//     console.log('✅ Rector/Coordinador → GET permitido');
//     return next();
//   }

//   console.log('❌ Acción denegada para rol:', role, 'método:', req.method);
//   return res.status(403).json({
//     message: 'Acceso denegado: solo la secretaria puede realizar esta acción'
//   });
// };

const authPeriod = (req, res, next) => {
  // Middleware temporalmente sin validación de roles
  console.log('🔍 Middleware authPeriod ejecutado sin validación de roles');
  next();
};

module.exports = authPeriod;