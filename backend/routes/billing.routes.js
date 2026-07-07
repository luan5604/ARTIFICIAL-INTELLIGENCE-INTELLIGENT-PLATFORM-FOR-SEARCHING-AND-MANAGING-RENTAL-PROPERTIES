const express = require('express');
const router = express.Router();
const { 
  createContract, 
  createInvoice, 
  getMyInvoices,
  getMyContracts,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} = require('../controllers/invoice.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/contracts', authorize('LANDLORD', 'ADMIN'), createContract);
router.post('/invoices', authorize('LANDLORD', 'ADMIN'), createInvoice);
router.get('/my-invoices', authorize('TENANT', 'LANDLORD', 'ADMIN'), getMyInvoices);
router.get('/invoices/:id', authorize('TENANT', 'LANDLORD', 'ADMIN'), getInvoiceById);
router.patch('/invoices/:id', authorize('LANDLORD', 'ADMIN'), updateInvoice);
router.delete('/invoices/:id', authorize('LANDLORD', 'ADMIN'), deleteInvoice);
router.get('/my-contracts', authorize('LANDLORD', 'ADMIN'), getMyContracts);

module.exports = router;
