import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './components/style.css';

const ProfileManager = () => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    gender: '',
    age: '',
  });

  const [profiles, setProfiles] = useState([]);
  const apiUrl = 'https://team-zoko.onrender.com/api/profiles'; // Update with your actual Render backend URL

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(apiUrl);
        console.log('Fetched profiles:', response.data);
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
    try {
      const { id, name, email, gender, age } = formData;

      if (!name || !email || !gender || !age) {
        console.error('All fields are required');
        return;
      }

      const profileData = {
        name,
        email,
        gender,
        age: parseInt(age),
      };

      let response;
      if (id) {
        console.log('Updating profile with id:', id); // Log the id being updated
        response = await axios.put(`${apiUrl}/${id}`, profileData);
        console.log('Profile updated:', response.data);
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile.id === id ? response.data : profile
          )
        );
      } else {
        console.log('Creating profile:', profileData);
        response = await axios.post(apiUrl, profileData);
        console.log('Profile created:', response.data);
        setProfiles((prevProfiles) => [...prevProfiles, response.data]);
      }

      setFormData({
        id: null,
        name: '',
        email: '',
        gender: '',
        age: '',
      });
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  const handleEditClick = (profile) => {
    setFormData({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      gender: profile.gender,
      age: String(profile.age),
    });
  };

  const handleDeleteClick = async (id) => {
    console.log(`Deleting profile with id: ${id}`);
    try {
      const response = await axios.delete(`${apiUrl}/${id}`);
      console.log('Delete response:', response);
      setProfiles(profiles.filter((profile) => profile.id !== id));
    } catch (error) {
      console.error('Error deleting profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>Profile Manager</h2>
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
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
          >
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
        <button type="submit">{formData.id ? 'Update' : 'Submit'}</button>
      </form>

      <div>
        <h2>All Profiles</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.id}>
                  <td>{profile.id}</td>
                  <td>{profile.name}</td>
                  <td>{profile.email}</td>
                  <td>{profile.gender}</td>
                  <td>{profile.age}</td>
                  <td>
                    <button onClick={() => handleEditClick(profile.id)}>Edit</button>
                    <button onClick={() => handleDeleteClick(profile.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No profiles found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfileManager;
