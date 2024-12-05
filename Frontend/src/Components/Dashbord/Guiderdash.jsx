import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Avatar from "@mui/joy/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import "./Guiderdash.css";

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

const serviceImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '8px',
};

const GuiderDash = () => {
  // Example guider data
  const u_Data = {
    _id: "66a4632bb0a3d660a6c0a7ed",
    fName: "John",
    lName: "Doe",
    profileImage: "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg",
    NICpassportNum: "A1234567",
    email: "joxhnx.doe@example.com",
    contactNumber: "+1234567890",
    guiderId: 2001, // Use guiderId instead of travelerId
  };

  const [guiderData, setGuiderData] = useState(u_Data);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set guider data
    setGuiderData(u_Data);

    // Fetch guider services
    axios.get(`http://localhost:3001/api/guide-service-status?guiderId=${u_Data.guiderId}`)
      .then(response => {
        setServices(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching guider services:", error);
        setLoading(false);
      });
  }, [u_Data.guiderId]);

  return (
    <div>
      <Card
        size="lg"
        variant="plain"
        orientation="horizontal"
        sx={{
          textAlign: "center",
          height: "100vh",
          width: "100%",
          borderRadius: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
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
            src={guiderData.profileImage}
            sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
          />
          <Typography textColor="primary.200" sx={{ fontSize: "1.5rem" }}>
            Guider Profile
          </Typography>
          <Typography textColor="primary.200">
            {guiderData.fName} {guiderData.lName}
          </Typography>
        </CardOverflow>

        <CardContent sx={{ gap: 1.5, minWidth: 200, width: "100%" }}>
          <div className="guider-dashboard">
            <h2>Guider Dashboard</h2>
            <div className="user-info">
              <label>
                Name:
                <div style={textContainerStyle}>
                  {guiderData.fName} {guiderData.lName}
                </div>
              </label>
              <label>
                Email:
                <div style={textContainerStyle}>{guiderData.email}</div>
              </label>
              <label>
                NIC/Passport Number:
                <div style={textContainerStyle}>{guiderData.NICpassportNum}</div>
              </label>
              <label>
                Contact Number:
                <div style={textContainerStyle}>{guiderData.contactNumber}</div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guider Services */}
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Guider Services
        </Typography>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <CircularProgress />
          </div>
        ) : services.length === 0 ? (
          <Card sx={{ mb: 2, p: 2, textAlign: "center" }}>
            <Typography>No services available.</Typography>
          </Card>
        ) : (
          services.map(service => (
            <Card key={service.serviceId} sx={{ mb: 2, position: 'relative' }}>
              <CardOverflow variant="solid" color="primary">
              <Typography textColor="primary.200">
                  serviceId: {service.serviceId}
                </Typography>
                <Typography textColor="primary.200" sx={{ fontSize: "1.2rem" }}>
                  language: {service.language}
                </Typography>
                <Typography textColor="primary.200">
                  Price: {service.price} Per Day
                </Typography>
                {service.serviceStatus === "Booked" && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      backgroundColor: 'red',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '0 0 8px 0',
                      fontWeight: 'bold',
                    }}
                  >
                    Booked
                  </Box>
                )}
              </CardOverflow>

              
              <CardContent>
                <Typography>
                  Description: {service.description}
                </Typography>
                <Typography>
                  Rating: {service.rating}
                </Typography>
                {service.serviceStatus === "Booked" && (
                  <Box
                    sx={{
                      marginTop: 2,
                      padding: 2,
                      borderRadius: 1,
                      boxShadow: 1,
                      backgroundColor: '#f1f1f1',
                    }}
                  >                
                  <img
                  src={service.travelerProfileImage}
                  alt="Service Image"
                  style={serviceImageStyle}
                  />
                    <Typography variant="h6">Booked Traveler Details:</Typography>
                    <Typography>Name: {service.travelerFname} {service.travelerLname}</Typography>
                    <Typography>Email: {service.travelerEmail}</Typography>
                    <Typography>Contact: {service.travelerContactNumber}</Typography>
                  </Box>
                )}
                
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GuiderDash;
