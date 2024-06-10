import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileList = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div>
      <h2>All Profiles</h2>
      <ul>
        {profiles.map((profile) => (
          <li key={profile.id}>
            Name: {profile.name} - Email: {profile.email} - Gender: {profile.gender} - Age: {profile.age}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileList;
