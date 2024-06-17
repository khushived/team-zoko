import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    gender: '',
    age: '',
  });

  const [profiles, setProfiles] = useState([]);
  const apiUrl = 'https://team-zoko.onrender.com/api/profiles'; // Update with your actual Render backend URL

  useEffect(() => {
    // Fetch all profiles from the backend when the component mounts
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('Fetched profiles:', response.data); // Log the response data
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form data to be submitted:', formData); // Log the form data

    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Profile created:', response.data); // Log the created profile
      setProfiles((prevProfiles) => [...prevProfiles, response.data]);
      // Clear form data after successful submission
      setFormData({
        name: '',
        email: '',
        gender: '',
        age: '',
      });
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Form</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>All Profiles</h2>
        <ul>
          {/* Display all profiles */}
          {profiles.length > 0 ? (
            profiles.map((profile) => (
              <li key={profile.id}> {/* Ensure the correct key field */}
                {profile.name} - {profile.email} - {profile.gender} - {profile.age}
              </li>
            ))
          ) : (
            <li>No profiles found</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileForm;
