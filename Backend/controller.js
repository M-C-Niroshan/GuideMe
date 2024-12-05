const bcrypt = require('bcryptjs'); // Add bcrypt for password hashing
const VehicleRentService = require('./vehicleRentServiseModel.js'); // Ensure this path is correct
const VehicleRentDetails = require('./vehicleRentDetailsModel.js'); // Ensure this path is correct
const GuideServise = require('./guideServiseModel.js'); // Ensure this path is correct
const GuiderBookingDetails = require('./guiderBookingDetailsModel');
const Renter = require('./renterModel'); // Ensure this path is correct
const Guider = require('./guiderModel'); // Ensure this path is correct
const Traveler = require('./travelerModel'); // Ensure this path is correct

// Utility function to check if an email exists in any role
const checkEmailExists = async (email) => {
  const traveler = await Traveler.findOne({ email });
  if (traveler) return true;

  const renter = await Renter.findOne({ email });
  if (renter) return true;

  const guider = await Guider.findOne({ email });
  if (guider) return true;

  return false;
};

// Get all vehicle rent services
const getVehicleRentServices = async (req, res, next) => {
  const { pickupLocation, vehicleType } = req.query;

  // Construct the query object based on provided parameters
  let query = {};

  if (pickupLocation) {
    query.avilableLocation = pickupLocation;
  }

  if (vehicleType) {
    query.type = vehicleType;
  }

  try {
    // Find vehicle rent services based on query
    const services = await VehicleRentService.find(query)
      .where('vehicleStatus').equals('available')
      .exec();

    // Fetch renter details for each service and reshape the response
    const servicesWithRenterDetails = await Promise.all(services.map(async (service) => {
      const renter = await Renter.findOne({ renterId: service.renterId }).exec();
      return {
        vehicleRentServiceId: service.vehicleRentServiceId, // Include the vehicleRentServiceId
        renterId: service.renterId,
        vehicleRegNum: service.vehicleRegNum,
        type: service.type,
        vehicleImage: service.vehicleImage,
        rentPrice: service.rentPrice,
        avilableLocation: service.avilableLocation,
        description: service.description,
        rating: service.rating,
        name: renter ? `${renter.fName} ${renter.lName}` : null,
        profileImg: renter ? renter.profileImg : null,
        email: renter ? renter.email : null,
        contactNum: renter ? renter.contactNum : null
      };
    }));

    res.json(servicesWithRenterDetails);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// Add a new vehicle rental service
const addVehicleRentService = async (req, res, next) => {
  try {
    const vehicleRentService = new VehicleRentService({
      renterId: req.body.renterId,
      vehicleRegNum: req.body.vehicleRegNum,
      type: req.body.type,
      vehicleImage: req.body.vehicleImage,
      rentPrice: req.body.rentPrice,
      avilableLocation: req.body.avilableLocation,
      description: req.body.description,
      rating: req.body.rating,
      vehicleStatus: req.body.vehicleStatus,
    });

    const savedVehicleRentService = await vehicleRentService.save();
    res.json(savedVehicleRentService);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get vehicle rent details
const getVehicleRentDetails = async (req, res, next) => {
  const { travelerId } = req.query;

  try {
    // Find vehicle rent details based on travelerId
    const rentDetails = await VehicleRentDetails.find({ travelerId }).exec();

    // Fetch renter and vehicle service details for each rent entry
    const detailedRentals = await Promise.all(rentDetails.map(async (rent) => {
      const renter = await Renter.findOne({ renterId: rent.renterId }).exec();
      const vehicleService = await VehicleRentService.findOne({ vehicleRentServiceId: rent.vehicleRentServiceId }).exec();

      return {
/*         travelerId: rent.travelerId, */
        renterId: rent.renterId,
        vehicleRentServiceId: rent.vehicleRentServiceId,
        pickupDate: rent.pickupDate,
        pickupTime: rent.pickupTime,
        handoverDate: rent.handoverDate,
        handoverTime: rent.handoverTime,
        renterFname: renter ? renter.fName : null,
        renterLname: renter ? renter.lName : null,
        renterProfileImg: renter ? renter.profileImg : null,
        renterEmail: renter ? renter.email : null,
        renterContactNum: renter ? renter.contactNum : null,
        vehicleRegNum: vehicleService ? vehicleService.vehicleRegNum : null,
        vehicleType: vehicleService ? vehicleService.type : null,
        vehicleImage: vehicleService ? vehicleService.vehicleImage : null,
        availableLocation: vehicleService ? vehicleService.avilableLocation : null
      };
    }));

    res.json(detailedRentals);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add vehicle rent details
// Add vehicle rent details
const addVehicleRentDetails = async (req, res, next) => {
  const { travelerId, renterId, vehicleRentServiceId, pickupDate, pickupTime, handoverDate, handoverTime } = req.body;

  try {
    // Create new vehicle rent details entry
    const vehicleRentDetails = new VehicleRentDetails({
      travelerId,
      renterId,
      vehicleRentServiceId,
      pickupDate,
      pickupTime,
      handoverDate,
      handoverTime
    });

    // Save the vehicle rent details
    await vehicleRentDetails.save();

    // Update the vehicle status to "Booked"
    await VehicleRentService.findOneAndUpdate(
      { vehicleRentServiceId: vehicleRentServiceId }, // Assuming rentServiceId is vehicleRegNum
      { vehicleStatus: "Booked" },
      { new: true }
    ).exec();

    res.json({ message: 'Vehicle rent details added and vehicle status updated.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all guide services
const getGuideServises = async (req, res, next) => {
  const { language } = req.query;

  // Construct the query object based on provided parameters
  let query = {};

  if (language) {
    query.language = language;
  }

  try {
    // Find guide services based on query
    const guideServices = await GuideServise.find(query)
      .exec();

    // Fetch guider details for each service and reshape the response
    const guideServicesWithGuiderDetails = await Promise.all(guideServices.map(async (service) => {
      const guider = await Guider.findOne({ guiderId: service.guiderId }).exec();
      return {
        guiderId: service.guiderId,  // Include guiderId
        serviceId: service.serviceId,
        language: service.language,
        price: service.price,
        description: service.description,
        rating: service.rating,
        name: guider ? `${guider.fName} ${guider.lName}` : null,
        profileImg: guider ? guider.profileImage : null,
        email: guider ? guider.email : null,
        contactNum: guider ? guider.contactNum : null
      };
    }));

    res.json(guideServicesWithGuiderDetails);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Add a new guide service
const addGuideServise = (req, res, next) => {
  const guideServise = new GuideServise({
    guiderId: req.body.guiderId,
    // No need to pass serviceId; it will be auto-incremented
    language: req.body.language,
    price: req.body.price,
    description: req.body.description,
    rating: req.body.rating,
    serviseStatus: req.body.serviseStatus
  });

  guideServise.save()
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json({ error });
    });
};


// Get guider booking details
const getGuiderBookingDetails = async (req, res, next) => {
  const { travelerId } = req.query;

  try {
    // Find guider booking details based on travelerId
    const bookingDetails = await GuiderBookingDetails.find({ travelerId }).exec();

    // Fetch guider details for each booking and reshape the response
    const bookingsWithGuiderDetails = await Promise.all(bookingDetails.map(async (booking) => {
      const guider = await Guider.findOne({ guiderId: booking.guiderId }).exec();
      return {
        /* travelerId: booking.travelerId, */
        guiderId: booking.guiderId,
        serviceId: booking.serviceId,
        reservationDate: booking.reservationDate,
        reservationTime: booking.reservationTime,
        guiderFname: guider ? guider.fName : null,
        guiderLname: guider ? guider.lName : null,
        guiderProfileImage: guider ? guider.profileImage : null,
        guiderEmail: guider ? guider.email : null,
        guiderContactNum: guider ? guider.contactNum : null // Corrected field name
      };
    }));

    res.json(bookingsWithGuiderDetails);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add guider booking details
const addGuiderBookingDetails = async (req, res, next) => {
  const { travelerId, guiderId, serviceId, reservationDate, reservationTime } = req.body;

  try {
    // Create new guider booking details entry
    const guiderBookingDetails = new GuiderBookingDetails({
      travelerId,
      guiderId,
      serviceId,
      reservationDate,
      reservationTime
    });

    // Save the guider booking details
    await guiderBookingDetails.save();

    // Update the guide service status to "Booked"
    await GuideServise.findOneAndUpdate(
      { serviceId: serviceId }, // Assuming serviceId is used to find the service
      { serviseStatus: "Booked" },
      { new: true }
    ).exec();

    res.json({ message: 'Guider booking details added and service status updated.' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Get all renters
const getRenters = (req, res, next) => {
  Renter.find()
    .select('-_id -__v') // Exclude _id and __v fields
    .then(response => {
      res.json(response); // Return response directly as array
    })
    .catch(error => {
      res.json({ error });
    });
};

// Add a new renter
const addRenter = async (req, res, next) => {
  try {
    const emailExists = await checkEmailExists(req.body.email);
    if (emailExists) {
      return res.status(400).json({ error: "Account with this email already exists." });
    }

    const renter = new Renter({
      fName: req.body.fName,
      lName: req.body.lName,
      address: req.body.address,
      profileImg: req.body.profileImg,
      NICnum: req.body.NICnum,
      email: req.body.email,
      password: req.body.password,
      contactNum: req.body.contactNum
    });

    const savedRenter = await renter.save();
    res.json(savedRenter);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all guiders
const getGuiders = (req, res, next) => {
  Guider.find()
    .select('-_id -__v') // Exclude _id and __v fields
    .then(response => {
      res.json(response); // Return response directly as array
    })
    .catch(error => {
      res.json({ error });
    });
};

// Add a new guider
const addGuider = async (req, res, next) => {
  try {
    const emailExists = await checkEmailExists(req.body.email);
    if (emailExists) {
      return res.status(400).json({ error: "Account with this email already exists." });
    }

    const guider = new Guider({
      fName: req.body.fName,
      lName: req.body.lName,
      profileImage: req.body.profileImage,
      NICnum: req.body.NICnum,
      email: req.body.email,
      password: req.body.password,
      contactNum: req.body.contactNum,
      age: req.body.age,
      gender: req.body.gender
    });

    const savedGuider = await guider.save();
    res.json(savedGuider);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all travelers
const getTravelers = (req, res, next) => {
  Traveler.find()
    .select('-_id -__v') // Exclude _id and __v fields
    .then(response => {
      res.json(response); // Return response directly as array
    })
    .catch(error => {
      res.json({ error });
    });
};

// Add a new traveler
const addTraveler = async (req, res, next) => {
  try {
    const emailExists = await checkEmailExists(req.body.email);
    if (emailExists) {
      return res.status(400).json({ error: "Account with this email already exists." });
    }

    const traveler = new Traveler({
      fName: req.body.fName,
      lName: req.body.lName,
      profileImage: req.body.profileImage,
      NICpassportNum: req.body.NICpassportNum,
      email: req.body.email,
      password: req.body.password,
      contactNumber: req.body.contactNumber
    });

    const savedTraveler = await traveler.save();
    res.json(savedTraveler);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login function
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in any of the collections
    let user = await Renter.findOne({ email });
    if (!user) user = await Guider.findOne({ email });
    if (!user) user = await Traveler.findOne({ email });

    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Exclude password from the response
    const { password: _, ...userDetails } = user.toObject();
    res.json(userDetails);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getGuideServiceWithBookingStatus = async (req, res, next) => {
  const { guiderId } = req.query;

  try {
    // Find guide services for the given guiderId
    const guideServices = await GuideServise.find({ guiderId }).exec();

    // Get booking details for each service
    const detailedServices = await Promise.all(guideServices.map(async (service) => {
      // Find if this service is booked
      const booking = await GuiderBookingDetails.findOne({ guiderId, serviceId: service.serviceId }).exec();

      let bookingStatus = "Available";
      let bookedTraveler = {};

      if (booking) {
        bookingStatus = "Booked";
        // Fetch the booked traveler's details
        bookedTraveler = await Traveler.findOne({ travelerId: booking.travelerId }).exec();
      }

      return {
        serviceId: service.serviceId,
        language: service.language,
        price: service.price,
        description: service.description,
        rating: service.rating,
        serviceStatus: bookingStatus,
        travelerId: bookedTraveler.travelerId || null,
        travelerFname: bookedTraveler.fName || null,
        travelerLname: bookedTraveler.lName || null,
        travelerProfileImage: bookedTraveler.profileImage || null,
        travelerEmail: bookedTraveler.email || null,
        travelerContactNumber: bookedTraveler.contactNumber || null
      };
    }));

    res.json(detailedServices);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const getVehicleRentServicesForRenter = async (req, res, next) => {
  const { renterId } = req.query;

  try {
    // Find vehicle rental services for the given renterId
    const vehicleRentServices = await VehicleRentService.find({ renterId }).exec();

    // Get rent details for each vehicle service
    const detailedServices = await Promise.all(vehicleRentServices.map(async (service) => {
      // Find rent details for this service
      const rentDetail = await VehicleRentDetails.findOne({ vehicleRentServiceId: service.vehicleRentServiceId }).exec();

      let bookingStatus = "Available";
      let bookedTraveler = {};

      if (rentDetail) {
        bookingStatus = "Booked";
        // Fetch the booked traveler's details
        bookedTraveler = await Traveler.findOne({ travelerId: rentDetail.travelerId }).exec();
      }

      return {
        vehicleRentServiceId: service.vehicleRentServiceId,
        vehicleRegNum: service.vehicleRegNum,
        type: service.type,
        vehicleImage: service.vehicleImage,
        rentPrice: service.rentPrice,
        avilableLocation: service.avilableLocation,
        description: service.description,
        rating: service.rating,
        vehicleStatus: service.vehicleStatus,
        serviceStatus: bookingStatus,
        travelerId: bookedTraveler.travelerId || null,
        travelerFname: bookedTraveler.fName || null,
        travelerLname: bookedTraveler.lName || null,
        travelerProfileImage: bookedTraveler.profileImage || null,
        travelerEmail: bookedTraveler.email || null,
        travelerContactNumber: bookedTraveler.contactNumber || null
      };
    }));

    res.json(detailedServices);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  getVehicleRentServices,
  addVehicleRentService,
  getVehicleRentDetails,
  addVehicleRentDetails,
  getGuideServises,
  addGuideServise,
  getGuiderBookingDetails,
  addGuiderBookingDetails,
  getRenters,
  addRenter,
  getGuiders,
  addGuider,
  getTravelers,
  addTraveler,
  loginUser,
  getGuideServiceWithBookingStatus,
  getVehicleRentServicesForRenter
};