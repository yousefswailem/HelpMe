import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, TextField, Button, CardActions } from '@mui/material';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        pictureUrl: '',
        email: '',
        location: '',
        phone: ''
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            const response = await fetch('https://your-api-endpoint.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log('Success:', result);
            // Handle success (e.g., display a message, redirect, etc.)
        } catch (error) {
            console.error('Error:', error);
            // Handle error (e.g., display an error message)
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://your-api-endpoint.com/initial-data');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const initialData = await response.json();
                setFormData({
                    ...formData,
                    ...initialData
                });
            } catch (error) {
                console.error('Error fetching initial data:', error);
                // Handle error (e.g., display an error message)
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <Card sx={{ borderRadius: '35px', backdropFilter: "blur", backgroundColor: 'rgba(0,0,30,0.4)' }} className='card'>
            <CardContent>
                <Typography className='formLabel' variant="h5" component="div">
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        variant="outlined"
                        margin="normal"
                        required
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Picture URL"
                        name="pictureUrl"
                        variant="outlined"
                        margin="normal"
                        value={formData.pictureUrl}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        margin="normal"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        variant="outlined"
                        margin="normal"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Phone"
                        name="phone"
                        type="tel"
                        variant="outlined"
                        margin="normal"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <CardActions>
                        <Button type="submit" size="large" variant="contained" fullWidth>
                            Submit
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    );
}

export default Register;
