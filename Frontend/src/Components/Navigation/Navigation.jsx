import React, { useState, useRef, useEffect } from 'react';
import './navigation.css';
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { NavLink } from 'react-router-dom';
import { useUserContext } from '../pages/UserContext';
import Popup from '../Popup/popup';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: 'ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}));

function Navigation() {
    const { setUserData, userData } = useUserContext();
    const navRef = useRef();
    const [showPopup, setShowPopup] = useState(false);
    const [status, setStatus] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (userData) {
            const guiderIdRange = 2000;
            const renterIdRange = 1000;
            const travelerIdRange = 3000;

            if (userData.guiderId && userData.guiderId >= guiderIdRange && userData.guiderId < 4000) {
                navigate("/Guiderdash");
            } else if (userData.renterId && userData.renterId >= renterIdRange && userData.renterId < guiderIdRange) {
                navigate("/Renterdash");
            } else if (userData.traveler && userData.traveler >= travelerIdRange && userData.traveler < renterIdRange) {
                navigate("/TravelerDashboard");
            }
        }
    }, [userData, navigate]);

    const showNavbar = () => {
        navRef.current.classList.toggle("responsive_nav");
    }

    const togglePopup = (value) => {
        setStatus(value);
        setShowPopup(!showPopup);
    }

    const handleOnClick = () => {
        navigate("/AuthConGuiderSignIn");
    }

    const handleDashboardClick = () => {
        setShowMenu(!showMenu);
    }

    const handleLogoutClick = () => {
        setUserData(null);
        navigate("/");
    }

    return (
        <header className='navheader'>
            <div className="logo-container">
                <NavLink to='/'><img src={`${process.env.PUBLIC_URL}/images/logovid.png`} className='navlogo' alt='logo' /></NavLink>
                <h1 className='navlogotext'>GuideMe</h1>
            </div>

            <nav ref={navRef}>
                <NavLink to='/' activeClassName='active'>Home</NavLink>
                <NavLink to='/PlanTrip' activeClassName='active'>Trip</NavLink>
                <NavLink to='/BookGuider' activeClassName='active'>Guider</NavLink>
                <NavLink to='/RentVehicle' activeClassName='active'>Vehicle</NavLink>

                {!userData ? (
                    <>
                        <button className='login' onClick={handleOnClick}>Login</button>
                        <button className='signup' onClick={() => togglePopup(1)}>Sign Up</button>
                    </>
                ) : (
                    <>
                        <StyledBadge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            variant="dot"
                            onClick={handleDashboardClick}
                        >
                            <Avatar alt="User Avatar" src={userData.profileImage} />
                        </StyledBadge>

                        {showMenu && (
                            <div className="menu">
                                <button onClick={() => navigate("/Guiderdash")}>Dashboard</button>
                                <button onClick={handleLogoutClick}>Logout</button>
                            </div>
                        )}
                    </>
                )}

                <button onClick={showNavbar} className='ncbtn'>
                    <FaTimes />
                </button>
            </nav>
            <button className='nobtn' onClick={showNavbar}>
                <FaBars />
            </button>

            <Popup show={showPopup} onClose={togglePopup} status={status} />
        </header>
    );
}

export default Navigation;
