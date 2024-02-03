import React, { useState } from 'react';
import {
  Dialog, styled, Typography, Box, InputBase, TextField, Button
} from '@mui/material';
import {
  Close
} from '@mui/icons-material';
import axios from 'axios';

const dialogStyle = {
  width: '80%',
  maxWidth: '100%',
  maxHeight: '100%',
  boxShadow: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

const TextFieldStyle = styled(TextField)`
  // Your custom styling for TextField
`;

const DialogWrapper = styled(Dialog)`
  ::-webkit-scrollbar {
    display: none;
  }

  @media screen and (max-width: 690px) {
    margin-left: 16px;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  }
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f2f6fc;

  & > p {
    font-size: 15px;
    font-weight: 500;
  }
`;

const RecipientWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 15px;

  & > div {
    font-size: 14px;
    border-bottom: 1px solid #F5F5F5;
    margin-top: 10px;
  }
`;

const Footer = styled(Box)`
  justify-content: space-between;
  padding: 18px;
  align-items: center;
  display: 'flex';
`;

const SendButton = styled(Button)`
  background: #FFB603;
  color: #fff;
  font-weight: 500;
  text-transform: none;
  border-radius: 18px;
  width: 100px;
`;

const ComposeGmail = ({ open, setOpenDrawer }) => {
  const [data, setData] = useState({});
  const apiUrl = process.env.REACT_APP_API_URL;

  const onValueChange = (e) => {
    setData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };
  

  const sendEmail = async (e) => {
    e.preventDefault();
  
    try {
      const emailData = { ...data };
  
      // Log the emailData before sending the request
      console.log('Email Data:', emailData);
  
      await axios.post(`${apiUrl}api/gmail/mail/send`, emailData);
  
      // Close the compose mail dialog
      setOpenDrawer(false);
      setData({});
    } catch (error) {
      console.error('Error sending email:', error);
      // Handle error (e.g., show a user-friendly message)
    }
  };
  

  const closeComposeMail = (e) => {
    e.preventDefault();

    // Close the compose mail dialog
    setOpenDrawer(false);
    setData({});
  };

  return (
    <DialogWrapper open={open} PaperProps={{ sx: dialogStyle }}>
      <Header>
        <Typography>New Message</Typography>
        <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
      </Header>
      <RecipientWrapper>
        <InputBase
          placeholder="Recipients"
          name="to"
          onChange={(e) => onValueChange(e)}
          value={data.to}
        />
        <InputBase
          placeholder="Subject"
          name="subject"
          onChange={(e) => onValueChange(e)}
          value={data.subject}
        />
      </RecipientWrapper>
      <TextFieldStyle
        multiline
        rows={15}
        sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
        name="text"
        onChange={(e) => onValueChange(e)}
        value={data.text}
      />
      <Footer>
        <SendButton onClick={(e) => sendEmail(e)}>Send</SendButton>
        <Button>
          <Close style={{ marginLeft: '20px' }} onClick={() => setOpenDrawer(false)} />
        </Button>
        
      </Footer>
    </DialogWrapper>
  );
};

export default ComposeGmail;
