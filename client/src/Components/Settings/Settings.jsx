import React, { useState } from 'react';
import './Settings.scss';
import Sidebar from './sidebar/Sidebar';
import TopNavBar from './TopNavBar/TopNavBar';
import Cars from './cars/Cars';
import UserFlagIcons from './TopNavBar/UserFlagIcons';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { IconButton } from '@mui/material';
import Map from './map/Map';
import SidebarRight from './Sidebar-right/SidebarRight';

function Settings() {
    const [selectedComponent, setSelectedComponent] = useState(null);

    const handleSidebarClick = (component) => {
        setSelectedComponent(component);
    };

    const toggleCarsComponent = () => {
        setSelectedComponent((prevComponent) => (prevComponent === 'cars' ? null : 'cars'));
    };

    return (
        <div className='container'>
            <Sidebar onIconClick={handleSidebarClick} />
            <div className='content'>
                <div className='nav'>
                    <TopNavBar />
                    <div className='spacer'></div>
                    <UserFlagIcons />
                </div>
                <div className='main-content'>
                    {selectedComponent === 'cars' && (
                        <div className='cars-component'>
                            <Cars />
                        </div>
                    )}
                    <div className='icon-button-container'>
                        <IconButton
                            sx={{
                                backdropFilter: 'brightness(90%)',
                                borderRadius: '4px',
                                height: '100%',
                            }}
                            onClick={toggleCarsComponent}
                        >
                            <PlayArrowIcon />
                        </IconButton>
                    </div>
                    <div className='map'>
                        <Map />
                    </div>
                    <div>
                        <SidebarRight />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
