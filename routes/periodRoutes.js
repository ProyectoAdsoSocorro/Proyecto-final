import express from "express";
import {
  getAllPeriods,
  getPeriodById,
  getPeriodsByYear,
  createPeriod,
  updatePeriod,
  deletePeriod
} from "../controllers/periodController.js";

const router = express.Router();

// Routes by documentation
router.get("/", getAllPeriods);                // GET /api/periodos
router.get("/:id", getPeriodById);             // GET /api/periodos/:id
router.get("/year/:year", getPeriodsByYear);     // GET /api/periodos/año/:año
router.post("/", createPeriod);                // POST /api/periodos
router.put("/:id", updatePeriod);              // PUT /api/periodos/:id
router.delete("/:id", deletePeriod);           // DELETE /api/periodos/:id

export default router;
