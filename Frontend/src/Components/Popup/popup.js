import React, { useState } from 'react';
import './popup.css';
import AuthContainer from '../Login1/AuthContainer'; 
import AuthConGuider from '../Login1/AuthConGuider';
import AuthConRenter from '../Login1/AuthConRenter'; 
import { useNavigate } from 'react-router-dom';

function Popup({ show, onClose, status }) {
    const [selectedRole, setSelectedRole] = useState(null);

    if (!show) {
        return null;
    }

    console.log("Value passed:", status);

    const renderSelectedComponent = () => {
        switch (selectedRole) {
            case 'user':
                return <AuthContainer status={status} />;
            case 'guider':
                return <AuthConGuider status={status} />;
            case 'renter':
                return <AuthConRenter status={status} />;
            default:
                return null;
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <button className="close-btn" onClick={onClose}>X</button>
                {!selectedRole ? (
                    <div className="cards-container">
                        <div className="card" onClick={() => setSelectedRole('user')}>
                            <img src={`${process.env.PUBLIC_URL}/images/userrole.jpg`} alt='User role' className='post1' />
                            <h3><br/>User</h3>
                        </div>
                        <div className="card" onClick={() => setSelectedRole('guider')}>
                            <img src={`${process.env.PUBLIC_URL}/images/guiderrole.jpg`} alt='Guider role' className='post2' />
                            <h3><br/>Guider</h3>
                        </div>
                        <div className="card" onClick={() => setSelectedRole('renter')}>
                            <img src={`${process.env.PUBLIC_URL}/images/renterrole.png`} alt='Renter role' className='post3' />
                            <h3><br/>Renter</h3>
                        </div>
                    </div>
                ) : (
                    <div className="selected-component">
                        {renderSelectedComponent()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Popup;
