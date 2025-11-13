/**
 * --------------------------------------------------
 * Capa de servicio para la gestión de Vigencias (Validity)
 * Implementa la lógica de negocio para:
 * - Crear vigencias
 * - Listar todas las vigencias
 * - Obtener la vigencia activa
 * - Activar y desactivar una vigencia
 */

import Validity from '../models/validity.js';

/**
 * Crea una nueva vigencia
 * Verifica que no exista ya una vigencia para el mismo año y colegio.
 * @param {Object} data - Datos de la vigencia
 * @returns {Promise<Object>} Vigencia creada
 */
export const create = async (data) => {
  const existing = await Validity.findOne({ year: data.year, school: data.school });
  if (existing) throw new Error('Ya existe una vigencia para este año y colegio');
  return Validity.create(data);
};

/**
 * Lista todas las vigencias, ordenadas por año descendente
 * Incluye las referencias al colegio y personal asignado.
 * @returns {Promise<Array>} Lista de vigencias
 */
export const list = async () => {
  return Validity.find()
    .populate('school rector generalSecretary headquarterInfo.headquarter')
    .sort({ year: -1 });
};

/**
 * Obtiene la vigencia actualmente activa
 * @returns {Promise<Object|null>} Vigencia activa o null si no hay
 */
export const getActive = async () => {
  return Validity.findOne({ active: true })
    .populate('school rector generalSecretary headquarterInfo.headquarter');
};

/**
 * Activa una vigencia y desactiva las demás
 * Solo una vigencia puede estar activa por colegio.
 * @param {string} id - ID de la vigencia a activar
 * @returns {Promise<Object>} Vigencia actualizada
 */
export const activate = async (id) => {
  await Validity.updateMany({}, { active: false }); // Desactiva todas
  return Validity.findByIdAndUpdate(id, { active: true }, { new: true });
};

/**
 * Desactiva una vigencia específica
 * @param {string} id - ID de la vigencia a desactivar
 * @returns {Promise<Object>} Vigencia actualizada
 */
export const deactivate = async (id) => {
  return Validity.findByIdAndUpdate(id, { active: false }, { new: true });
};
