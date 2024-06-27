import React, { useState } from 'react';
import './Login.scss';
import { Card, CardContent, Typography, TextField, Button, CardActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            const response = await fetch('https://your-api-endpoint.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            const result = await response.json();
            console.log('Login successful:', result);
            // Perform additional actions such as storing the user token or data
            navigate('/settings');
        } catch (error) {
            setError('Invalid username or password');
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Card sx={{ borderRadius: '35px', backdropFilter: "blur", backgroundColor: 'rgba(0,0,30,0.4)' }} className='card'>
                <CardContent>
                    <Typography className='formLabel' variant="h5" component="div" gutterBottom>
                        Login
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
                        {error && (
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        )}
                        <CardActions>
                            <Button type="submit" size="large" variant="contained" fullWidth>
                                Submit
                            </Button>
                        </CardActions>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

export default Login;
