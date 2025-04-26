import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const withAuth = (Component) => {

    return (props) => {
        const navigate = useNavigate();
        const auth = useSelector((state) => state.auth);
        const { isAuthenticated } = auth;
        
        useEffect(() => {
            if (!isAuthenticated) {
                navigate('/login'); // Redirect to login page if not authenticated
            }
        }, [isAuthenticated, navigate]);

        if (!isAuthenticated) {
            return null; // Prevent rendering before redirection
        }

        return <Component {...props} />;
    };
};
