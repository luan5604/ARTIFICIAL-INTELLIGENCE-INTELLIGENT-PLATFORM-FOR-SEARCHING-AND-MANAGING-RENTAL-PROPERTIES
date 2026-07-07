const express = require('express');
const router = express.Router();
const { 
  createReport, 
  getAllReports, 
  updateReportStatus, 
  deleteReport 
} = require('../controllers/report.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', createReport);
router.get('/', getAllReports);
router.patch('/:id/status', updateReportStatus);
router.delete('/:id', deleteReport);

module.exports = router;
