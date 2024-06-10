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

  useEffect(() => {
    axios.get('http://localhost:8080/profiles')
      .then(response => {
        console.log('Fetched profiles:', response.data);
        if (Array.isArray(response.data)) {
          setProfiles(response.data);
          console.log('Profiles state updated:', response.data);
        } else {
          console.error('Unexpected response format:', response.data);
        }
      })
      .catch(error => {
        console.error('Error fetching profiles:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'age' ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/profiles', formData)
      .then(response => {
        console.log('Created profile:', response.data);
        setProfiles([...profiles, response.data]);
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
          {profiles.length === 0 ? (
            <li>No profiles found</li>
          ) : (
            profiles.map((profile, index) => (
              <li key={index}>
                {profile.name} - {profile.email} - {profile.gender} - {profile.age}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProfileForm;
