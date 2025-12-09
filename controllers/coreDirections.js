import CoreDirection from '../models/coreDirection.js';
import bcrypt from 'bcrypt';
import { generateJWT } from '../middlewares/jwt.js';

export const getAll = async (req, res) => {
  try {
    const directions = await CoreDirection.find();
    res.json(directions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Commented out for possible future use
// export const getById = async (req, res) => {
//   try {
//     const direction = await CoreDirection.findById(req.params.id);
//     if (!direction) return res.status(404).json({ message: 'Not found' });
//     res.json(direction);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const create = async (req, res) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newDirection = new CoreDirection({ ...rest, password: hashedPassword });
    const saved = await newDirection.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const direction = await CoreDirection.findOne({ email });

    if (!direction) return res.status(400).json({ message: 'Credenciales invalidas' });

    const isMatch = await bcrypt.compare(password, direction.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales invalidas' });

    const token = generateJWT(direction._id, "direccionNucleo");
    console.log(direction._id)
    res.json({ message: 'Login Exitoso', coreDirection: direction, token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: Date.now() };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const updated = await CoreDirection.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'La contraseña es requerida' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const updated = await CoreDirection.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'No encontrado' });
    res.json({ message: 'Contraseña actualizada' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const deleted = await CoreDirection.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Extraviado' });
    res.json({ message: 'Core direction elimminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controllers to activate/deactivate core directions

export const activate = async (req, res) => {
  try {
    const updated = await CoreDirection.findByIdAndUpdate(
      req.params.id,
      { isActive: true, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Extraviado' });
    res.json({ message: 'Dirección del núcleo activada', coreDirection: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deactivate = async (req, res) => {
  try {
    const updated = await CoreDirection.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'No se encuentra' });
    res.json({ message: 'Core direction desactivada', coreDirection: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};                                                                              
