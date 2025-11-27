/**
 * NOTA IMPORTANTE:
 * Este middleware depende de que req.user esté establecido por el
 * middleware de autenticación previo. Si la autenticación está
 * desactivada o comentada, este middleware también debe estarlo.
 *
 * Roles disponibles:
 * - principal (rector)
 * - coordinator (coordinador)
 * - secretary (secretaria)
 * - teacher (profesor)
 * - parent (acudiente)
 * - student (estudiante)

 * @param {string[]} allowedRoles - Array con los roles permitidos para la ruta
 */
export default function roleCheck(allowedRoles) {
  return (req, res, next) => {
    // Verificar que existe un usuario autenticado
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'No autenticado' });

    // Verificar que el rol del usuario está en la lista de roles permitidos
    if (!allowedRoles.includes(user.role))
      return res.status(403).json({ message: 'Acceso denegado: rol no autorizado' });

    // Si el rol es válido, continuar con el siguiente middleware o controlador
    next();
  };
}

