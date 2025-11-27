import * as service from '../services/validityService.js';

/**
 * create
 * - Crea una nueva vigencia académica
 */
export const create = async (req, res) => {
  try {
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * list
 * - Lista todas las vigencias registradas
 */
export const list = async (req, res) => {
  try {
    const data = await service.list();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * getActive
 * - Devuelve la vigencia actualmente activa
 */
export const getActive = async (req, res) => {
  try {
    const active = await service.getActive();
    res.json(active || { message: 'No hay vigencia activa' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * activate
 * - Activa una vigencia por su ID
 */
export const activate = async (req, res) => {
  try {
    const updated = await service.activate(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * deactivate
 * - Desactiva una vigencia por su ID
 */
export const deactivate = async (req, res) => {
  try {
    const updated = await service.deactivate(req.params.id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

