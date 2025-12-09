const authRole = (rolesAllowed) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: "Usuario no autenticado"
        });
      }
      const userRole = req.user.role;
      //console.log(userRole)
      const isAllowed = rolesAllowed.includes(userRole);
      console.log(isAllowed)
      if (!isAllowed) {
        return res.status(403).json({
          error: "Acceso denegado",
          message: `Requiere uno de estos roles: ${rolesAllowed.join(", ")}`,
          yourRole: userRole
        });
      }
      next();
    } catch (error) {
      res.status(500).json({
        error: "Error verificando permisos"
      });
    }
  };
};

export default authRole;