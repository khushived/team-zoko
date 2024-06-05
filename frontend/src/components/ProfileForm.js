import React, { useState } from 'react';

const ProfileForm = ({ createProfile }) => {
  const [profile, setProfile] = useState({
    name: '',
    age: '', // this is actually fine because input field of type "number" will handle the conversion
    gender: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createProfile({ ...profile, age: Number(profile.age) }); // Ensure age is a number
    setProfile({ name: '', age: '', gender: '', email: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={profile.name} onChange={handleChange} required />
      <input type="number" name="age" placeholder="Age" value={profile.age} onChange={handleChange} required />
      <select name="gender" value={profile.gender} onChange={handleChange} required>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>
      <input type="email" name="email" placeholder="Email" value={profile.email} onChange={handleChange} required />
      <button type="submit">Create Profile</button>
    </form>
  );
};

export default ProfileForm;

