import Router from 'express';
import httpReports from '../controllers/reports.js';
import { check } from 'express-validator';
import validateFields from '../middlewares/check.js';

const router = Router();

router.get('/statistics-group/:groupId', [
    check('groupId').isMongoId().withMessage('ID de Grupo no válido').trim(),
    validateFields
], httpReports.getStatisticsByGroup);

export default router;