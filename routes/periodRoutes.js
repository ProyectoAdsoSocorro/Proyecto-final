import express from "express";
import {
  getAllPeriods,
  getPeriodById,
  getPeriodsByYear,
  createPeriod,
  updatePeriod,
  activatePeriod,
  deactivatePeriod,
  // deletePeriod // ❌ Deshabilitado
} from "../controllers/periodController.js";

const router = express.Router();

// Routes by documentation
router.get("/", getAllPeriods);                  // GET /api/periodos
router.get("/:id", getPeriodById);               // GET /api/periodos/:id
router.get("/year/:year", getPeriodsByYear);     // GET /api/periodos/año/:año
router.post("/", createPeriod);                  // POST /api/periodos
router.put("/:id", updatePeriod);                // PUT /api/periodos/:id
router.put("/:id/activar", activatePeriod);      // PUT /api/periodos/:id/activar
router.put("/:id/desactivar", deactivatePeriod); // PUT /api/periodos/:id/desactivar
// router.delete("/:id", deletePeriod);          // DELETE /api/periodos/:id  <---Deshabilitado--->

export default router;

