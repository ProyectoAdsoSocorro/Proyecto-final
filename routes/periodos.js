// routes/periodos.js
const express = require('express');
const router = express.Router();
const authPeriod = require('../middlewares/authperiodo');
const {
  getAll,
  getById,
  getByYear,
  createPeriod,
  updatePeriod,
  activatePeriod,
  deactivatePeriod,
  deletePeriod
} = require('../controllers/periodoController');

// Aplicar middleware de autorización a todas las rutas
router.use(authPeriod);

router.get('/', getAll);
router.get('/:id', getById);
router.get('/year/:year', getByYear);

router.post('/', createPeriod);
router.put('/:id', updatePeriod);
router.put('/:id/activate', activatePeriod);
router.put('/:id/deactivate', deactivatePeriod);
router.delete('/:id', deletePeriod);

module.exports = router;
