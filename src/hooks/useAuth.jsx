// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "http://localhost:9091/theArchivalLibrary/v1";
export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Function to check authentication status
        const checkAuth = async () => {
            try {
                let jwt = sessionStorage.getItem('token');
                jwt = jwt ? jwt.replace(/^"|"$/g, '') : '';

                if (!jwt) {
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                }

                // Make an API call to validate the token
                const response = await axios.get(`${API_URL}/auth/authenticate`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });

                if (response.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { isAuthenticated, loading };
}
