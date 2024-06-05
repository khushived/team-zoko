import React, { useState } from 'react';
import axios from 'axios';

const ProfileActions = ({ id, updatedProfile, handleIdChange }) => {

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/profiles/${id}`, updatedProfile)
      .then(response => {
        console.log('Profile updated:', response.data);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  };

  const handleDelete = () => {
    axios.delete(`http://localhost:3000/profiles/${id}`)
      .then(response => {
        console.log('Profile deleted:', response.data);
      })
      .catch(error => {
        console.error('Error deleting profile:', error);
      });
  };

  return (
    <div>
      <input type="text" placeholder="Enter Profile ID" value={id} onChange={handleIdChange} />
      {/* Add other input fields for updating profile data */}
      <button onClick={handleUpdate}>Update Profile</button>
      <button onClick={handleDelete}>Delete Profile</button>
    </div>
  );
};

export default ProfileActions;
