import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const textContainerStyle = {
  width: '100%',
  padding: '5px',
  marginTop: '5px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  backgroundColor: '#f9f9f9',
  overflow: 'hidden',
  wordWrap: 'break-word'
};

const vehicleImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '8px',
};

const Renterdash = () => {
  const [renter, setRenter] = useState(null);
  const [rentServices, setRentServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Example renter data
  const u_Data = {
    _id: "66a4632bb0a3d660a6c0a7ed",
    fName: "John",
    lName: "Doe",
    profileImage: "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg",
    NICpassportNum: "A1234567",
    email: "johnx.doe@example.com",
    contactNumber: "+1234567890",
    travelerId: 1003,
  };

  useEffect(() => {
    // Set renter data
    setRenter(u_Data);

    // Fetch vehicle rent services based on renterId
    const fetchRentServices = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/vehicle-rent-services?renterId=${u_Data.travelerId}`);
        setRentServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rent services:', error);
        setLoading(false);
      }
    };

    fetchRentServices();
  }, [u_Data.travelerId]);

  if (!renter) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card
        size="lg"
        variant="plain"
        orientation="horizontal"
        sx={{
          textAlign: 'center',
          height: '100vh',
          width: '100%',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
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
            src={renter.profileImage}
            sx={{ width: 80, height: 80, mb: 2, mx: 'auto' }}
          />
          <Typography textColor="primary.200" sx={{ fontSize: '1.5rem' }}>
            Renter Account
          </Typography>
          <Typography textColor="primary.200">
            {renter.fName} {renter.lName}
          </Typography>
        </CardOverflow>

        <CardContent sx={{ gap: 1.5, minWidth: 200, width: '100%' }}>
          <div className="user-dashboard">
            <h2>Renter Dashboard</h2>
            <div className="user-info">
              <label>
                Name:
                <div style={textContainerStyle}>{renter.fName} {renter.lName}</div>
              </label>
              <label>
                Email:
                <div style={textContainerStyle}>{renter.email}</div>
              </label>
              <label>
                Address:
                <div style={textContainerStyle}>{renter.address || 'N/A'}</div>
              </label>
              <label>
                NIC/Passport Number:
                <div style={textContainerStyle}>{renter.NICpassportNum}</div>
              </label>
              <label>
                Contact Number:
                <div style={textContainerStyle}>{renter.contactNumber}</div>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Rental Services */}
      <div style={{ marginTop: "20px" }}>
        <Typography variant="h4" sx={{ textAlign: "center", mb: 2 }}>
          Vehicle Rental Services
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100px" }}>
            <CircularProgress />
          </Box>
        ) : rentServices.length === 0 ? (
          <Card sx={{ mb: 2, p: 2, textAlign: "center" }}>
            <Typography>No rental services available.</Typography>
          </Card>
        ) : (
          rentServices.map(service => (
            <Card key={service.vehicleRentServiceId} sx={{ mb: 2, position: 'relative' }}>
              <CardOverflow variant="solid" color="primary">
                <Typography textColor="primary.200" sx={{ fontSize: "1.2rem" }}>
                  Vehicle: {service.vehicleRegNum} ({service.type})
                </Typography>
                <Typography textColor="primary.200">
                  Rent Price: {service.rentPrice}
                </Typography>
                {service.vehicleStatus === "Booked" && (
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
                <img
                  src={service.vehicleImage}
                  alt="Vehicle Image"
                  style={vehicleImageStyle}
                />
                <Typography textColor="primary.200">
                  Location: {service.avilableLocation}
                </Typography>
              </CardOverflow>
              <CardContent>
                <Typography>
                  Description: {service.description}
                </Typography>
                <Typography>
                  Rating: {service.rating}
                </Typography>
                {service.vehicleStatus === "Booked" && (
                  <Box
                    sx={{
                      marginTop: 2,
                      padding: 2,
                      borderRadius: 1,
                      boxShadow: 1,
                      backgroundColor: '#f1f1f1',
                    }}
                  >
                    <Typography variant="h6">Rented Traveler Details:</Typography>
                    <Typography>Name: {service.travelerFname} {service.travelerLname}</Typography>
                    <Typography>Email: {service.travelerEmail}</Typography>
                    <Typography>Contact: {service.travelerContactNumber}</Typography>
                    <Avatar
                      alt="Traveler Profile Image"
                      src={service.travelerProfileImage}
                      sx={{ width: 50, height: 50, mt: 2, mb: 1 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Renterdash;
