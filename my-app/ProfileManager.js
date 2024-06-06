import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://teamzoko.netlify.app/';  // Change this to your deployed API URL

const ProfileManager = () => {
    const [profiles, setProfiles] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [updateId, setUpdateId] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        const response = await axios.get(`${API_URL}/profiles`);
        setProfiles(response.data);
    };

    const createProfile = async () => {
        const response = await axios.post(`${API_URL}/profiles`, { name, email });
        setProfiles([...profiles, response.data]);
        setName('');
        setEmail('');
    };

    const updateProfile = async (id) => {
        const response = await axios.put(`${API_URL}/profiles/${id}`, { name, email });
        setProfiles(profiles.map(profile => profile.ID === id ? response.data : profile));
        setName('');
        setEmail('');
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
                <button type="submit">{updateId ? 'Update' : 'Create'} Profile</button>
            </form>
            <ul>
                {profiles.map(profile => (
                    <li key={profile.ID}>
                        {profile.Name} ({profile.Email})
                        <button onClick={() => { setName(profile.Name); setEmail(profile.Email); setUpdateId(profile.ID); }}>Update</button>
                        <button onClick={() => deleteProfile(profile.ID)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileManager;
