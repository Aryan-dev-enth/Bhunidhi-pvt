import express from 'express';
import { 
  createRegion, 
  getAllRegions, 
  getRegionById, 
  updateRegion, 
  deleteRegion 
} from '../controllers/regionController.js';

const router = express.Router();

// Create a new region
router.post('/createRegion', createRegion);

// Get all regions
router.get('/getAll', getAllRegions);

// Get a region by ID
router.get('/get/:id', getRegionById);

// Update a region by ID
router.put('/updateRegion/:id', updateRegion);

// Delete a region by ID
router.delete('/deleteRegion/:id', deleteRegion);

export default router;
