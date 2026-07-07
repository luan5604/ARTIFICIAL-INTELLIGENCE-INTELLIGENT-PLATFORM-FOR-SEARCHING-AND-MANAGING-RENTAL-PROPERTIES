const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getMyProperties, 
  updateProperty,
  deleteProperty,
  getMyRooms,
  createRoom, 
  updateRoom,
  deleteRoom,
  getRoomsByProperty,
  approveProperty,
  approveRoom
} = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', authorize('LANDLORD', 'ADMIN'), createProperty);
router.patch('/:id/approve', authorize('ADMIN'), approveProperty);
router.get('/my', authorize('LANDLORD', 'ADMIN'), getMyProperties);
router.get('/my-rooms', authorize('LANDLORD', 'ADMIN'), getMyRooms);
router.put('/:id', authorize('LANDLORD', 'ADMIN'), updateProperty);
router.delete('/:id', authorize('LANDLORD', 'ADMIN'), deleteProperty);

router.post('/rooms', authorize('LANDLORD', 'ADMIN'), createRoom);
router.patch('/rooms/:id/approve', authorize('ADMIN'), approveRoom);
router.put('/rooms/:id', authorize('LANDLORD', 'ADMIN'), updateRoom);
router.delete('/rooms/:id', authorize('LANDLORD', 'ADMIN'), deleteRoom);

router.get('/:propertyId/rooms', getRoomsByProperty);

module.exports = router;
