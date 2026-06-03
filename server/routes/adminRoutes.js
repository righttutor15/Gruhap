const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserDetails);
router.get('/stats', adminController.getStats);
router.get('/revenue', adminController.getRevenue);
router.get('/inquiries', adminController.getInquiries);

module.exports = router;
