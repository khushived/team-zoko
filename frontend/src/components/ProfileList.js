import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UpdateProfileForm from './UpdateProfileForm'; // Ensure this path is correct

const ProfileList = () => {
    const [profiles, setProfiles] = useState([]);
    const [editProfile, setEditProfile] = useState(null);

    useEffect(() => {
        fetchProfiles();
    }, []);

    const fetchProfiles = async () => {
        try {
            const response = await axios.get('/profiles');
            setProfiles(response.data);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/profiles/${id}`);
            fetchProfiles();
        } catch (error) {
            console.error('Error deleting profile:', error);
        }
    };

    const handleEdit = (profile) => {
        setEditProfile(profile);
    };

    return (
        <div>
            <h2>Profile List</h2>
            {editProfile && (
                <UpdateProfileForm 
                    profile={editProfile} 
                    onUpdate={() => {
                        setEditProfile(null);
                        fetchProfiles();
                    }}
                />
            )}
            <ul>
                {profiles.map((profile) => (
                    <li key={profile.id}>
                        {profile.name} ({profile.age}, {profile.gender}, {profile.email})
                        <button onClick={() => handleEdit(profile)}>Edit</button>
                        <button onClick={() => handleDelete(profile.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProfileList;
