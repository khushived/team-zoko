import React, { useState } from 'react';
import axios from 'axios';

const UpdateProfileForm = ({ profile, onUpdate }) => {
    const [name, setName] = useState(profile.name);
    const [age, setAge] = useState(profile.age);
    const [gender, setGender] = useState(profile.gender);
    const [email, setEmail] = useState(profile.email);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/profiles/${profile.id}`, { name, age, gender, email });
            onUpdate();
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Update Profile</h2>
            <div>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Age:</label>
                <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
            </div>
            <div>
                <label>Gender:</label>
                <input type="text" value={gender} onChange={(e) => setGender(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit">Update</button>
        </form>
    );
};

export default UpdateProfileForm;
