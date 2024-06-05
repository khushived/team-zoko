import React, { useState, useEffect } from 'react';
import ProfileForm from './components/ProfileForm';

const App = () => {
  const createProfile = async (profile) => {
    const response = await fetch('http://localhost:3000/profiles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      console.error('Failed to create profile');
    }
  };

  return (
    <div>
      <h1>Profile Management</h1>
      <ProfileForm createProfile={createProfile} />
    </div>
  );
};

export default App;
