import { Router } from "express";
import {
  getAllValidities,
  getActiveValidity,
  createValidity,
  activateValidity,
  deleteValidity
} from "../controllers/validityController.js";

const router = Router();
router.get("/", getAllValidities);
router.get("/active", getActiveValidity);
router.post("/", createValidity);
router.put("/:id/activate", activateValidity);
router.delete("/:year", deleteValidity);

export default router;
