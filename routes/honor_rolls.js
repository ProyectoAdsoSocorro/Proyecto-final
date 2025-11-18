import honor_rolls from '../controllers/honor_rolls.js';
import {Router} from 'express';

const router = Router();

router.get("/api/reports/list-students/:schoolYear/:schoolId/:groupId",[

    validateFields
],honor_rolls.GetthonorRolls);