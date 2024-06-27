import React, { useState, useEffect } from 'react';
import './cars.scss';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button, InputAdornment, TextField, IconButton, FormLabel, Typography } from '@mui/material';
import axios from 'axios'; 
import SearchIcon from '@mui/icons-material/Search';

const LeftPanel = () => {
    const [devices, setDevices] = useState([]);
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Replace the URL with your actual API endpoint
        axios.get(
            "http://185.203.217.168/api/get_devices?lang=en&user_api_hash=$2y$10$F4RpJGDpBDWO2ie448fQAu2Zo0twdwyBdMmnbeSqFbEkjGYocP.Y6"
        )
            .then(response => {
                const items = response.data[1].items;
                const formattedDevices = items.map(item => ({
                    label: item.name,
                    defaultChecked: false,
                    disabled: false,
                }));
                setDevices(formattedDevices);
                setCount(formattedDevices.length);
            })
            .catch(error => {
                console.error('There was an error fetching the devices!', error);
            });
    }, []);

    return (
        <>
            <div className="left-panel-container">
                <div className='left-panel'>
                    <div className='search'>
                        <TextField
                            sx={{ mr: '25px', width: '70%' }}
                            id="outlined-search"
                            label="Search field"
                            type="search"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button sx={{ height: '56px' }} variant="outlined" href="#outlined-buttons">
                            +
                        </Button>
                    </div>
                    <div className='group-list'>
                        <p className='group-label'>ليست في مجموعة ({count})</p>
                        <div>
                            <FormGroup>
                                {devices.map((device, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox   
                                                defaultChecked={device.defaultChecked}
                                                disabled={device.disabled}
                                                sx={{
                                                    color: 'black',
                                                    '&.Mui-checked': {
                                                        color: 'black',
                                                    },
                                                }}
                                            />
                                        }
                                        label={device.label}
                                    />
                                ))}
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LeftPanel;
