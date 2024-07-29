import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternate from '@mui/icons-material/AddPhotoAlternate';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper'; // Added for border styling
import { storage } from '../Login1/firebase'; // Import your configured Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { NavLink } from 'react-router-dom';

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
  const [form, setForm] = useState({
    vehicleRegNum: '',
    type: '',
    vehicleImage: '',
    rentPrice: '',
    avilableLocation: '',
    description: ''
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Example renter data
  const u_Data = {
    _id: "66a4632bb0a3d660a6c0a7ed",
    fName: "John",
    lName: "Doe",
    profileImage: "https://images.pexels.com/photos/1643387/pexels-photo-1643387.jpeg",
    NICpassportNum: "A1234567",
    email: "johnx.doe@example.com",
    contactNumber: "+1234567890",
    renterId: 1003,
  };

  useEffect(() => {
    // Set renter data
    setRenter(u_Data);

    // Fetch vehicle rent services based on renterId
    const fetchRentServices = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/vehicle-rent-services?renterId=${u_Data.renterId}`);
        setRentServices(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching rent services:', error);
        setLoading(false);
      }
    };

    fetchRentServices();
  }, [u_Data.renterId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      // Define a reference to the storage location
      const storageRef = ref(storage, `vehicleImages/${image.name}`);

      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, image);

      try {
        // Create a promise to handle the upload completion
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Handle progress here if needed
            },
            (error) => {
              // Handle unsuccessful uploads
              console.error('Upload error:', error);
              reject(error);
            },
            async () => {
              // Handle successful uploads
              try {
                imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                resolve();
              } catch (error) {
                reject(error);
              }
            }
          );
        });
      } catch (error) {
        setErrorMessage('Image upload failed. Please try again.');
        setSnackbarOpen(true);
        return;
      }
    }

    const newVehicle = {
      ...form,
      renterId: u_Data.renterId,
      vehicleImage: imageUrl,
      rating: 0,
      vehicleStatus: "available",
    };

    try {
      await axios.post('http://localhost:3001/api/vehicle-rent-service', newVehicle);
      setSuccessMessage('Vehicle added successfully!');
      setSnackbarOpen(true);
      // Refresh vehicle services
      const response = await axios.get(`http://localhost:3001/api/vehicle-rent-services?renterId=${u_Data.renterId}`);
      setRentServices(response.data);
    } catch (error) {
      setErrorMessage('Error adding vehicle. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleClear = () => {
    setForm({
      vehicleRegNum: '',
      type: '',
      rentPrice: '',
      avilableLocation: '',
      description: ''
    });
    setImage(null);
    setImagePreview(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (!renter) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2 }}>
      <Card
        size="lg"
        variant="plain"
        orientation="horizontal"
        sx={{
          textAlign: 'center',
          height: '80vh',
          width: '100%',
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}
      >
        <CardOverflow
          variant="solid"
          color="primary"
          sx={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            height: 'auto',
            px: 'var(--Card-padding)',
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

      {/* Add Vehicle Form */}
      <Box sx={{ marginTop: 4, width: '100%', maxWidth: 600 }}>
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            borderRadius: 2,
            border: '1px solid #ddd',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 2 }}>
            Add New Vehicle
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Vehicle Registration Number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="vehicleRegNum"
                  value={form.vehicleRegNum}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Type"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="type"
                  value={form.type}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rent Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="rentPrice"
                  value={form.rentPrice}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Available Location"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="avilableLocation"
                  value={form.avilableLocation}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
                {imagePreview ? (
                  <Box
                    component="img"
                    sx={{
                      height: 100,
                      width: 100,
                      borderRadius: '8px',
                      objectFit: 'cover',
                      cursor: 'pointer',
                      marginBottom: '16px',
                    }}
                    src={imagePreview}
                    alt="Image preview"
                    onClick={() => document.getElementById('image-upload').click()}
                  />
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 100,
                      width: 100,
                      border: '2px dashed #ccc',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      mb: 2,
                    }}
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    <AddPhotoAlternate sx={{ fontSize: 48, color: '#ccc' }} />
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                >
                  Add Vehicle
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  color="secondary"
                  sx={{ mt: 2, ml: 2 }}
                  onClick={handleClear}
                >
                  Clear
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>

      {/* Vehicle List */}
      <Box sx={{ 
        marginTop: 4, 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'center'  // Centers items horizontally
      }}>
        {loading ? (
          <CircularProgress />
        ) : (
          rentServices.map((service) => (
            <Card key={service._id} sx={{ width: 250, mb: 2 }}> {/* Adjust the width as needed */}
              <CardOverflow>
                <CardContent>
                  <img
                    src={service.vehicleImage}
                    alt={service.vehicleRegNum}
                    style={{ width: '100%', height: 'auto' }} // Adjust image styling as needed
                  />
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                    {service.vehicleRegNum}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Type: {service.type}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Rent Price: {service.rentPrice}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Location: {service.avilableLocation}
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center' }}>
                    Description: {service.description}
                  </Typography>
                </CardContent>
              </CardOverflow>
            </Card>
          ))
        )}
      </Box>

      {/* Home Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom:'20px' }}>
        <NavLink to="/">
          <Button
            variant="outlined"
            color="primary"
            sx={{
              '--variant-borderWidth': '2px',
              borderRadius: 40,
              borderColor: 'primary.500',
            }}
          >
            Home
          </Button>
        </NavLink>
      </div>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={successMessage ? "success" : "error"}>
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Renterdash;
