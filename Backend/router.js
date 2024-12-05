const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/vehiclelist', controller.getVehicleRentServices);
router.post('/vehicle-rent-service', controller.addVehicleRentService);

router.get('/vehicle-rent-details', controller.getVehicleRentDetails);
router.post('/vehicle-rent-details', controller.addVehicleRentDetails);

router.get('/guide-servise', controller.getGuideServises);
router.post('/guide-servise', controller.addGuideServise);

router.get('/guider-booking-details', controller.getGuiderBookingDetails);
router.post('/guider-booking-details', controller.addGuiderBookingDetails);

router.get('/renters', controller.getRenters);
router.post('/renter', controller.addRenter);

router.get('/guiders', controller.getGuiders);
router.post('/guider', controller.addGuider);

router.get('/travelers', controller.getTravelers);
router.post('/traveler', controller.addTraveler);

router.post('/api/login', controller.loginUser);
router.get('/guide-service-status', controller.getGuideServiceWithBookingStatus);
router.get('/vehicle-rent-services', controller.getVehicleRentServicesForRenter);

module.exports = router;