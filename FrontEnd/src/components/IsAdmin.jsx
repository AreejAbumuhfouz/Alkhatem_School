import React, { useEffect, useState } from 'react';
import axios from 'axios';

const IsAdmin = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile', {
          withCredentials: true,
        });

        if (res.data.role === 'admin') {
          setIsAdmin(true);
        }
      } catch (err) {
        console.error('Error checking admin:', err);
      } finally {
        setChecked(true);
      }
    };

    checkAdmin();
  }, []);

  if (!checked) return null; 

  return isAdmin ? children : null;
};

export default IsAdmin;
