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
    axios.get(apiUrl)
      .then(response => {
        setProfiles(response.data);
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
      });
  }, [apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the form data to create a new profile
    axios.post(apiUrl, formData)
      .then(response => {
        setProfiles([...profiles, response.data]);
        // Clear form data after successful submission
        setFormData({
          name: '',
          email: '',
          gender: '',
          age: '',
        });
      })
      .catch(error => {
        console.error('Error creating profile:', error);
      });
  };

  return (
    <div>
      <h2>Profile Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
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
              <li key={profile.ID}>
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
