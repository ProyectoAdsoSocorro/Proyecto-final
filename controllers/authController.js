import SchoolUsers from '../models/users.js';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * register
 * - Crea un usuario nuevo en la colección SchoolUsers.
 * - Valida que no exista otro usuario con el mismo identificationNumber.
 * - El hashing de la contraseña se realiza en el hook pre('save') del modelo.
 */
export const register = async (req, res) => {
  try {
    const {
      identificationType,
      identificationNumber,
      firstName,
      lastName,
      email,
      password,
      role,
      school
    } = req.body;

    // Evitar duplicados por número de identificación
    const exists = await SchoolUsers.findOne({ identificationNumber });
    if (exists) return res.status(400).json({ message: 'Ya existe un usuario con este número de identificación' });

    // Crear el usuario. El password será hasheado automáticamente por el modelo.
    const newUser = await SchoolUsers.create({
      identificationType,
      identificationNumber,
      firstName,
      lastName,
      email,
      password,
      role,
      school
    });

    // Generar token JWT (si decides usar este controlador para autenticación local)
    const token = generateToken(newUser._id);

    // Responder con información mínima del usuario y el token
    res.status(201).json({
      message: 'Usuario creado con éxito',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        role: newUser.role,
        identificationNumber: newUser.identificationNumber,
      },
      token,
    });
  } catch (error) {
    // Si Mongoose lanza un ValidationError, aquí se captura y se devuelve 500
    // Puedes mejorar esto devolviendo 400 para errores de validación específicos.
    res.status(500).json({ message: error.message });
  }
};

/**
 * login
 * - Busca un usuario por identificationNumber y compara la contraseña
 *   usando el método comparePassword del modelo.
 * - Si las credenciales son válidas devuelve un token JWT y datos básicos.
 */
export const login = async (req, res) => {
  try {
    const { identificationNumber, password } = req.body;
    const user = await SchoolUsers.findOne({ identificationNumber });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = generateToken(user._id);

    res.json({
      message: 'Inicio de sesión exitosa',
      user: {
        id: user._id,
        firstName: user.firstName,
        role: user.role,
        identificationNumber: user.identificationNumber
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * profile
 * - Devuelve el usuario autenticado adjuntado en req.user por el middleware
 *   de autenticación. Si no utilizas el middleware local, esta ruta devolverá
 *   undefined o fallará según cómo se gestione req.user.
 */
export const profile = async (req, res) => {
  res.json(req.user);
};
