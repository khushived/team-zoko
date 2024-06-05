import React, { useState } from 'react';
import ProfileActions from './ProfileActions'; // Import the ProfileActions component
import axios from 'axios';

const MainComponent = () => {
  const [id, setId] = useState('');
  const [updatedProfile, setUpdatedProfile] = useState({
    name: '',
    age: '',
    gender: '',
    email: ''
  });

  const handleIdChange = (e) => {
    setId(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleUpdate = () => {
    // Implement logic to update profile
    axios.put(`http://localhost:3000/profiles/${id}`, updatedProfile)
      .then(response => {
        console.log('Profile updated:', response.data);
        setId('');
        setUpdatedProfile({ name: '', age: '', gender: '', email: '' });
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  const handleDelete = () => {
    // Implement logic to delete profile
    axios.delete(`http://localhost:3000/profiles/${id}`)
      .then(response => {
        console.log('Profile deleted:', response.data);
        setId('');
      })
      .catch(error => {
        console.error('Error deleting profile:', error);
      });
  };

  return (
    <div>
      {"ProfileForm.js"}
      {"ProfileList.js"}
      {"ProfileActions.js"}
      <ProfileActions 
        id={id} 
        updatedProfile={updatedProfile} 
        handleIdChange={handleIdChange} 
        handleInputChange={handleInputChange} 
        handleUpdate={handleUpdate} 
        handleDelete={handleDelete} 
      />
    </div>
  );
};

export default MainComponent;
