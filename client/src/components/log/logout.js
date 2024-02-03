import React from 'react';
import axios from 'axios';
import cookie from 'js-cookie';
import { Button } from '@mui/material';

const Logout = () => {
    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.remove( key, {expires : 1});
        }

    };
    
    const logout =  async () => {
        await axios ({
            method : 'get',
            url : `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true
        })
        .then (() => removeCookie('jwt'))
        .catch ((err) => console.log(err));

        window.location ="/";
    };

    return (

    <Button style={{marginRight: '20px', fontSize: 'bold', color: "orange"}} onClick={logout}>
        Logout
    </Button>
  );
};

export default Logout;