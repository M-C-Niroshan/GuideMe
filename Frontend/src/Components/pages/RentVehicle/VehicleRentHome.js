import './VehicleRentHome.css';
import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, MenuItem, Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { Slide } from "react-slideshow-image";

import GetVehicle from "./GetVehicle";
import Navigation from "../../Navigation/Navigation";
import Footer from "../../Footer/Footer";
import { useUserContext } from '../UserContext';

import Diverse_Vehicle_Selection from "./images/RentVehiclePageImages/Diverse Vehicle Selection.jpg";
import Simple_Booking_Process from "./images/RentVehiclePageImages/Simple Booking Process.jpg";
import Flexible_Rental_Periods from "./images/RentVehiclePageImages/Flexible Rental Periods.jpg";
import Competitive_Pricing from "./images/RentVehiclePageImages/Competitive Pricing.jpg";
import Customer_Support from "./images/RentVehiclePageImages/Customer Support.jpg";
import Convenient_Locations from "./images/RentVehiclePageImages/Convenient Locations.jpg";
import Safe_and_Reliable_Vehicles from "./images/RentVehiclePageImages/Safe and Reliable Vehicles.jpg";
import Vehicle_Ratings from "./images/RentVehiclePageImages/Vehicle Ratings.jpg";

import lcar from "./images/RentVehiclePageImages/vehicles/lcar.png";
import Bike from "./images/RentVehiclePageImages/vehicles/Bike.png";
import Tuk from "./images/RentVehiclePageImages/vehicles/Tuk.png";
import Flex from "./images/RentVehiclePageImages/vehicles/flex.png";
import Car from "./images/RentVehiclePageImages/vehicles/Car.png";
import Van from "./images/RentVehiclePageImages/vehicles/Van.png";

const services = [
  {
    img: Diverse_Vehicle_Selection,
    title: "Diverse Vehicle Selection",
    text: "Choose from a range of vehicles, from compact cars for city travel to spacious SUVs for family adventures.",
  },
  {
    img: Simple_Booking_Process,
    title: "Simple Booking Process",
    text: "Our intuitive booking system lets you reserve your vehicle with ease. Select your dates, pick your vehicle, and confirm your booking in minutes.",
  },
  {
    img: Flexible_Rental_Periods,
    title: "Flexible Rental Periods",
    text: "Rent a vehicle for as long as you need, with customizable rental durations to fit your schedule.",
  },
  {
    img: Competitive_Pricing,
    title: "Competitive Pricing",
    text: "Benefit from clear, competitive pricing with no hidden fees. Multiple payment options are available to suit your needs.",
  },
  {
    img: Customer_Support,
    title: "24/7 Customer Support",
    text: "Our dedicated support team is available around the clock to assist with any inquiries or issues you may have.",
  },
  {
    img: Convenient_Locations,
    title: "Convenient Locations",
    text: "With multiple pickup and drop-off locations, renting a vehicle has never been more convenient.",
  },
  {
    img: Safe_and_Reliable_Vehicles,
    title: "Safe and Reliable Vehicles",
    text: "Our vehicles are regularly maintained and inspected to ensure your safety and comfort during your rental period.",
  },
  {
    img: Vehicle_Ratings,
    title: "Customer Vehicle Ratings",
    text: "Read reviews and ratings from previous customers to help you choose the best vehicle for your needs.",
  },
];

const carTypes = [
  { value: "lcar", label: "lcar" },
  { value: "Bike", label: "Bike" },
  { value: "Tuk", label: "Tuk" },
  { value: "Flex", label: "Flex" },
  { value: "Car", label: "Car" },
  { value: "Van", label: "Van" },
];

const top100Films = [
  { label: "Colombo" },
  { label: "Jafna" },
  { label: "Negambo" },
  { label: "Matara" },
  { label: "Beliatta" },
  { label: "Ampara" },
  { label: "Biyagama" },
  { label: "Mawaramandiya" },
  { label: "Gampaha" },
  { label: "Kandy" },
];

export default function VehicleRentHome() {
  const { setUserData } = useUserContext();
  const [carType, setCarType] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [showGetVehicle, setShowGetVehicle] = useState(false);

  const handleFindVehicleClick = () => {
    if (pickupLocation && carType) {
      setShowGetVehicle(true);
    }
  };

  useEffect(() => {
    // Setting user data for temporary purposes
    setUserData({ travelerId: 15, name: 'John Doe', email: 'john@example.com' });
  }, [setUserData]);

  return (
    <div className="maincont">
      <Navigation />
      <div className="navback">
        <div className="travelheadervr">
          <p className="travelheaderpvr">Discover the Freedom to Explore with Our Comprehensive</p>
        </div>
        <div className="relative w-full h-screen overflow-hidden" id="backimg">
          <img src={`${process.env.PUBLIC_URL}/images/navback.jpg`} alt='background' className='absolute top-1/2 left-1/2 w-full h-auto transform -translate-x-1/2 -translate-y-1/2' />
        </div>
      </div>

      <Box sx={{ backgroundColor: "" }}>
        {/* Car Rental Form Section */}
        <Box>
          <div className="Form">
            <Box
              sx={{
                p: 2,
                bgcolor: "background.paper",
                borderRadius: 5,
                boxShadow: 5,
                display: "flex",
                justifyContent: "center",
                width: "100%",
                maxWidth: "800px",
                marginTop: "-110px"
              }}
            >
              <Grid container spacing={2} sx={{ width: "100%", justifyContent: "center" }}>
                <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", padding: "8px" }}>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={top100Films}
                    onChange={(event, newValue) => setPickupLocation(newValue ? newValue.label : "")}
                    sx={{ width: "100%" }}
                    renderInput={(params) => (
                      <TextField {...params} label="Pickup Location" />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", padding: "8px" }}>
                  <TextField
                    select
                    label="Vehicle Type"
                    value={carType}
                    onChange={(e) => setCarType(e.target.value)}
                    fullWidth
                  >
                    <MenuItem value="">Select Vehicle Type</MenuItem>
                    {carTypes.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#0056b3",
                      width: "100%",
                      "&:hover": { bgcolor: "#063f7c" },
                    }}
                    onClick={handleFindVehicleClick}
                  >
                    Find a Vehicle
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </div>
        </Box>

        {/* Conditionally Render GetVehicle Component */}
        {showGetVehicle && (
          <GetVehicle pickupLocation={pickupLocation} vehicleType={carType} />
        )}

        {/* Slideshow Section */}
        <Box sx={{ padding: { xs: "0px", md: "0px" }, marginTop: "1px", width:'80%', height:'10%', marginLeft:'auto', marginRight:'auto'}}>
          <Slide slidesToScroll={2} slidesToShow={4} indicators={true}>
            {[lcar, Bike, Tuk, Flex, Car, Van].map((src, index) => (
              <Box
                key={index}
                sx={{ textAlign: "center", padding: "0px", fontSize: "30px" }}
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  style={{ width: "80%", height: "auto" }}
                />
              </Box>
            ))}
          </Slide>
        </Box>

        {/* Rental Services Section */}
        <Box sx={{ padding: { xs: "20px", md: "5px" }, marginTop: "180px" }}>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "16px",
            }}
          >
            {services.map((service, index) => (
              <Box
                key={index}
                sx={{
                  width: { xs: "100%", sm: "45%", md: "30%" },
                  maxWidth: "300px",
                  backgroundColor: "#4bccbe",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={service.img}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "cover",
                    maxHeight: "200px",
                  }}
                />
                <Box sx={{ padding: "16px" }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {service.title}
                  </Typography>
                  <Typography variant="body2">{service.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        <Footer />
      </Box>
    </div>
  );
}
