import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import AspectRatio from '@mui/joy/AspectRatio';
import Avatar from "@mui/joy/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import { useUserContext } from "../pages/UserContext";
import { NavLink } from 'react-router-dom';
import { Button } from '@mui/material';
import "./Traveller.css";

const textContainerStyle = {
  width: "100%",
  padding: "5px",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderRadius: "5px",
  backgroundColor: "#f9f9f9",
  overflow: "hidden",
  wordWrap: "break-word",
};

const TravelerDashboard = () => {
  const u_Data = {
    _id: "66a4632bb0a3d660a6c0a7ed",
    fName: "John",
    lName: "Doe",
    profileImage: "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg",
    NICpassportNum: "A1234567",
    email: "johnx.doe@example.com",
    contactNumber: "+1234567890",
    travelerId: 15,
  };

  const { setUserData, userData } = useUserContext();
  const [guiderReservations, setGuiderReservations] = useState([]);
  const [vehicleReservations, setVehicleReservations] = useState([]);
  const [loadingGuider, setLoadingGuider] = useState(true);
  const [loadingVehicle, setLoadingVehicle] = useState(true);

  useEffect(() => {
    setUserData(u_Data);

    axios.get(`http://localhost:3001/api/guider-booking-details?travelerId=${u_Data.travelerId}`)
      .then(response => {
        setGuiderReservations(response.data);
        setLoadingGuider(false);
      })
      .catch(error => {
        console.error("Error fetching guider reservations:", error);
        setLoadingGuider(false);
      });

    axios.get(`http://localhost:3001/api/vehicle-rent-details?travelerId=${u_Data.travelerId}`)
      .then(response => {
        setVehicleReservations(response.data);
        setLoadingVehicle(false);
      })
      .catch(error => {
        console.error("Error fetching vehicle reservations:", error);
        setLoadingVehicle(false);
      });
  }, [setUserData]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card
        size="lg"
        variant="plain"
        orientation="horizontal"
        sx={{
          textAlign: "center",
          height: "70vh",
          width: "100%",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        <div className="bluecon"></div>

        <CardOverflow
          variant="solid"
          color="primary"
          sx={{
            flex: "0 0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "100%",
            height: "auto",
            px: "var(--Card-padding)",
            borderRadius: 0,
          }}
        >
          <Avatar
            alt="Profile Image"
            src={userData.profileImage}
            sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
          />
          <Typography textColor="primary.200" sx={{ fontSize: "1.5rem" }}>
            User Account
          </Typography>
          <Typography textColor="primary.200">
            {userData.fName} {userData.lName}
          </Typography>
        </CardOverflow>

        <CardContent sx={{ gap: 1.5, minWidth: 200, width: "100%" }}>
          <div className="user-dashboard">
            <h2>User Dashboard</h2>
            <div className="user-info">
              <label>
                Name:
                <div style={textContainerStyle}>
                  {userData.fName} {userData.lName}
                </div>
              </label>
              <label>
                Email:
                <div style={textContainerStyle}>{userData.email}</div>
              </label>
              <label>
                ID:
                <div style={textContainerStyle}>{userData.travelerId}</div>
              </label>
              <label>
                NIC/Passport Number:
                <div style={textContainerStyle}>{userData.NICpassportNum}</div>
              </label>
              <label>
                Contact Number:
                <div style={textContainerStyle}>{userData.contactNumber}</div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Guider Reservations
        </Typography>
        {loadingGuider ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <CircularProgress />
          </div>
        ) : guiderReservations.length === 0 ? (
          <Card sx={{ mb: 2, p: 2, textAlign: "center" }}>
            <Typography>No guider reservations available.</Typography>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {guiderReservations.map(reservation => (
              <Card
                key={reservation.id}
                sx={{
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 2,
                  marginX: 1,
                  padding: 2
                }}
              >
                <Avatar
                  alt="Guider Image"
                  src={reservation.guiderProfileImage}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
                  {reservation.guiderFname} {reservation.guiderLname}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  {reservation.guiderEmail}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Reservation Date: {new Date(reservation.reservationDate).toLocaleDateString()}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Reservation Time: {reservation.reservationTime}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Contact: {reservation.guiderContactNum}
                </Typography>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Vehicle Reservations
        </Typography>
        {loadingVehicle ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <CircularProgress />
          </div>
        ) : vehicleReservations.length === 0 ? (
          <Card sx={{ mb: 2, p: 2, textAlign: "center" }}>
            <Typography>No vehicle reservations available.</Typography>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {vehicleReservations.map(reservation => (
              <Card
                key={reservation.id}
                sx={{
                  width: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginBottom: 2,
                  marginX: 1,
                  padding: 2
                }}
              >
                <AspectRatio ratio="1/1" sx={{ width: '100%', mb: 2 }}>
                  <img src={reservation.vehicleImage} alt="Vehicle Image" style={{ width: '100%', borderRadius: '8px' }} />
                </AspectRatio>
                <Typography variant="h6" textAlign="center" sx={{ mb: 1 }}>
                  {reservation.vehicleType}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  {reservation.vehicleRegNum}
                </Typography>
                <Avatar
                  alt="Renter Image"
                  src={reservation.renterProfileImg}
                  sx={{ width: 80, height: 80, mb: 2 }}
                />
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Pickup Date: {new Date(reservation.pickupDate).toLocaleDateString()} {reservation.pickupTime}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Handover Date: {new Date(reservation.handoverDate).toLocaleDateString()} {reservation.handoverTime}
                </Typography>
                <Typography textAlign="center" sx={{ mb: 1 }}>
                  Renter Contact: {reservation.renterContactNum}
                </Typography>
              </Card>
            ))}
          </div>
        )}
      </div>
      <NavLink to='/'>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              '--variant-borderWidth': '2px',
              borderRadius: 40,
              borderColor: 'primary.500',
              mx: 'auto',
              marginLeft:'auto',
              marginRight:'auto',
            }}
          >
            Home
          </Button>
        </NavLink>
    </div>
  );
};

export default TravelerDashboard;
