import React, { useState, useEffect } from 'react';
import ProfileForm from './ProfileForm';
import axios from 'axios';

const App = () => {
  const [profiles, setProfiles] = useState([]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/profiles');
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const createProfile = async (profile) => {
    try {
      await axios.post('http://localhost:3000/profiles', profile);
      fetchProfiles();
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <div>
      <h1>Profile Management</h1>
      <ProfileForm createProfile={createProfile} />
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>{profile.name} - {profile.age} - {profile.gender} - {profile.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
