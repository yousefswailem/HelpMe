import React from 'react';
import { Grid, Button, ListItemText } from '@mui/material';

const AddressNav = ({ options, onAddressSelect }) => {
    const chunkArray = (arr, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const optionChunks = chunkArray(options, 8);

    return (
        <Grid container spacing={2}>
            {optionChunks.map((chunk, chunkIndex) => (
                <Grid item xs={16} key={`chunk-${chunkIndex}`}>
                    <Grid container spacing={2}>
                        {chunk.map((option) => (
                            <Grid item xs={1.5} key={option.key}>
                                <Button
                                    sx={{ color: 'black', padding: '2px', backgroundColor: 'white', width: '5vw', height: '100%', mt: '1px', border: 'solid 1px black' }}
                                    onClick={() => onAddressSelect(option)}
                                >
                                    <ListItemText primary={option.value} />
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    );
};

export default AddressNav;
