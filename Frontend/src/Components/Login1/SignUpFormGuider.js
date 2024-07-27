import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import Dropdown from '../SpecialComponents/DropdownGen';
import { Box, Button } from '@mui/material';

const SignUpFormGuider = () => {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    nic: '',
    age: '',
    mobile: '',
    gender: ''
  });

  const [error, setError] = useState(null);

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
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    if (image) {
      formDataToSend.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:3001/createuser', {
        method: 'POST',
        body: formDataToSend
      });
      const result = await response.json();
      if (response.ok) {
        alert('User created successfully!');
        // Close the SignUpForm or redirect here if needed
      } else {
        setError(result.message || 'Something went wrong');
      }
    } catch (error) {
      setError('An error occurred: ' + error.message);
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
          sx={{ fontSize: '10px',
            width: '70%',
            height: '36%',
            marginLeft: '10%',
           }}
        >
          Set Image
        </Button>
    
      </div>
      <div className='sub1'>
        <div className='minisub1'>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            className='tx1'
            value={formData.firstName}
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
            name="nic"
            placeholder="NIC number"
            className='tx4'
            value={formData.nic}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className='tx5'
            value={formData.age}
            onChange={handleInputChange}
          />
          
        </div>
        <div className='minisub2'>
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            className='tx7'
            value={formData.lastName}
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
            name="mobile"
            placeholder="Mobile number"
            className='tx6'
            value={formData.mobile}
            onChange={handleInputChange}
          />
          <Dropdown />
          
          <button className='sign1' type="submit">Sign Up</button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default SignUpFormGuider;