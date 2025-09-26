import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShipperLogin = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login', { replace: true });
  }, [navigate]);
  return null;
};

export default ShipperLogin;
