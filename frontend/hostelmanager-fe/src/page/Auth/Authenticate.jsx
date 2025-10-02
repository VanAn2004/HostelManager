import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { setToken } from '../../Service/LocalStorageService';
import { Box } from 'lucide-react';

const Authenticate = () => {
    const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];

      console.log("Token: ", accessToken);

      setToken(accessToken);
      setIsLoggedin(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/home");
    }
  }, [isLoggedin, navigate]);

  return (
    <Box
    sx={{
      display: "flex",
      flexDirection : "column",
      gap: "30px",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
 
  </Box>
  )
}

export default Authenticate
