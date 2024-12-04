import express from 'express';
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
} from '../controllers/reportController.js';

const router = express.Router();

router.post('/create', createReport);

router.get('/getAll', getAllReports);

router.get('/get/:id', getReportById);

router.put('/update/:id', updateReport);

router.delete('/delete/:id', deleteReport);

export default router;
