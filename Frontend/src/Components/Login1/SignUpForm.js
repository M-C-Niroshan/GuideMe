import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { Box, Button } from '@mui/material';
import Axios from 'axios';
import { storage } from './firebase'; // Import the configured Firebase storage
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import './loading.css'; // Import CSS file for styling

const SignUpForm = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    password: '',
    NICpassportNum: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading spinner

    let imageUrl = '';
    if (image) {
      // Define a reference to the storage location
      const storageRef = ref(storage, `profileImages/${image.name}`);
      
      // Start the upload task
      const uploadTask = uploadBytesResumable(storageRef, image);

      // Create a promise to handle the upload completion
      try {
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => {
              // Handle progress here if needed
            }, 
            (error) => {
              // Handle unsuccessful uploads
              console.error("Upload error:", error);
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
        console.error("Upload Error:", error);
        setError('Failed to upload image. Please try again.');
        setLoading(false);
        return;
      }
    }

    // Prepare the data to send to your backend
    const formDataToSend = {
      fName: formData.fName,
      lName: formData.lName,
      email: formData.email,
      password: formData.password,
      NICpassportNum: formData.NICpassportNum,
      contactNumber: formData.contactNumber,
      profileImage: imageUrl // Include the image URL in the data to be sent
    };

    // Send the data to your backend
    try {
      await Axios.post("http://localhost:3001/api/traveler", formDataToSend);
      console.log("User created successfully");
      setFormData({
        fName: '',
        lName: '',
        email: '',
        password: '',
        NICpassportNum: '',
        contactNumber: '',
      });
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Axios Error:", error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Hide loading spinner
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1 className='heading1'>Create Account</h1>
      <div className='subm' style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '2%', marginLeft: '-52%'}}>
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
              borderRadius: '50%',
              objectFit: 'cover',
              cursor: 'pointer',
              marginRight: '10px',
            }}
            src={imagePreview}
            alt='Image preview'
            onClick={() => document.getElementById('image-upload').click()}
          />
        ) : (
          <FaUserCircle 
            size={100}
            color="#ccc"
            style={{ cursor: 'pointer', marginRight: '10px' }}
            onClick={() => document.getElementById('image-upload').click()}
          />
        )}
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => document.getElementById('image-upload').click()}
          sx={{ fontSize: '10px', width: '70%', height: '36%', marginLeft: '10%' }}
        >
          Set Image
        </Button>
      </div>
      <div className='sub1'>
        <div className='minisub1'>
          <input
            type="text"
            name="fName"
            placeholder="First name"
            className='tx1'
            value={formData.fName}
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className='tx2'
            value={formData.email}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="NICpassportNum"
            placeholder="NIC number"
            className='tx4'
            value={formData.NICpassportNum}
            onChange={handleInputChange}
          />
        </div>
        <div className='minisub2'>
          <input
            type="text"
            name="lName"
            placeholder="Last name"
            className='tx7'
            value={formData.lName}
            onChange={handleInputChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className='tx3'
            value={formData.password}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="contactNumber"
            placeholder="Mobile number"
            className='tx6'
            value={formData.contactNumber}
            onChange={handleInputChange}
          />
          <button className='sign1' type="submit" disabled={loading}>Sign Up</button>
        </div>
      </div>
      {loading && <div className="loader"></div>} {/* Show loader */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SignUpForm;
