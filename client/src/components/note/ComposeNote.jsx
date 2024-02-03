import React, { useState, useContext} from 'react';
import { Dialog, styled, Typography, Box, InputBase, TextField, Button } from '@mui/material'; 
import { Close, DeleteOutline } from '@mui/icons-material';
import axios from 'axios';
import { UidContext } from '../AppContext';

const dialogStyle = {
    height: '50%',
    width: '50%',
    maxWidth: '50%',
    maxHeight: '50%',
    boxShadow: 'none',
    borderRadius: '20px 20px 0 0',
}

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
    display: flex;
    justify-content: space-between;
    padding: 20px 18px;
    align-items: center;
`;

const SendButton = styled(Button)`
    background: #FFB603;
    color: #fff;
    font-weight: 500;
    text-transform: none;
    border-radius: 18px;
    width: 100px;
`
const ComposeNote = ({ open, setOpenDrawer }) => {
    const [data, setData] = useState({});
    const apiUrl = process.env.REACT_APP_API_URL;
    const uid = useContext(UidContext);
  
    const onValueChange = (e) => {
      setData({ ...data, [e.target.name]: e.target.value });
    };
  
    const compose = async (e) => {
      e.preventDefault();
  
      try {
        await axios.post(`${apiUrl}api/note/savenote`, {
          ...data,
          author: uid,
          sentAt: new Date(),
        });

        setOpenDrawer(false);
        setData({});
      } catch (error) {
        console.error('Error sending email:', error);
      }
    };
  
    const closeCompose = (e) => {
      e.preventDefault();
      setOpenDrawer(false);
      setData({});
    };
  
    return (
      <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
        <Header>
          <Typography>New Note</Typography>
          <Close fontSize="small" onClick={(e) => closeCompose(e)} />
        </Header>
        <RecipientWrapper>
          <InputBase
            placeholder="Title"
            name="subject"
            onChange={(e) => onValueChange(e)}
            value={data.subject}
          />
        </RecipientWrapper>
        <TextField
          multiline
          rows={5}
          sx={{ '& .MuiOutlinedInput-notchedOutline': { border: 'none' } }}
          name="body"
          onChange={(e) => onValueChange(e)}
          value={data.body}
        />
        <Footer>
          <SendButton onClick={(e) => compose(e)}>Send</SendButton>
          <DeleteOutline onClick={() => setOpenDrawer(false)} />
        </Footer>
      </Dialog>
    );
  };
  
  export default ComposeNote;