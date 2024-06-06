import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const ProfileManager = () => {
    const [profiles, setProfiles] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        const response = await axios.get(`${API_URL}/profiles`);
        setProfiles(response.data);
    };

    const createProfile = async () => {
        const response = await axios.post(`${API_URL}/profiles`, { name, email, gender, age });
        setProfiles([...profiles, response.data]);
        setName('');
        setEmail('');
        setGender('');
        setAge('');
    };

    const updateProfile = async (id) => {
        const response = await axios.put(`${API_URL}/profiles/${id}`, { name, email, gender, age });
        setProfiles(profiles.map(profile => profile.ID === id ? response.data : profile));
        setName('');
        setEmail('');
        setGender('');
        setAge('');
        setUpdateId(null);
    };

    const deleteProfile = async (id) => {
        await axios.delete(`${API_URL}/profiles/${id}`);
        setProfiles(profiles.filter(profile => profile.ID !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (updateId) {
            updateProfile(updateId);
        } else {
            createProfile();
        }
    };

    return (
        <div>
            <h1>Profile Manager</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
                <button type="submit">{updateId ? 'Update Profile' : 'Create Profile'}</button>
            </form>
            <h2>All Profiles</h2>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.ID}>
                        {profile.Name} ({profile.Email}) - {profile.Gender}, {profile.Age} years old
                        <button onClick={() => { setName(profile.Name); setEmail(profile.Email); setGender(profile.Gender); setAge(profile.Age); setUpdateId(profile.ID); }}>Update</button>
                        <button onClick={() => deleteProfile(profile.ID)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileManager;
