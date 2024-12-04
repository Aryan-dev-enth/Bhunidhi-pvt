import express from "express";
import {
  createSite,
  getAllSites,
  getSiteById,
  updateSite,
  deleteSite,
} from "../controllers/siteController.js";

const router = express.Router();

// Create a new site
router.post("/createSite", createSite);

router.get("/getAll", getAllSites);
router.get("/get/:id", getSiteById);
router.put("/updateSite:id", updateSite);
router.delete("/deleteSite:id", deleteSite);

export default router;
