import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import MailIcon from '@mui/icons-material/Mail';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MessageIcon from '@mui/icons-material/Message';
import DescriptionIcon from '@mui/icons-material/Description';
import ContactsIcon from '@mui/icons-material/Contacts';
import AgendaIcon from '@mui/icons-material/Event';
import { styled } from '@mui/system';
import { grey } from '@mui/material/colors';
import GoogleIcon from '@mui/icons-material/Google';

const StyledButton = styled(Button)({
  margin: '10px',
  marginLeft: '33px',
  padding: '8px',
  color: 'black',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: 'grey',
  },
});

const iconStyle = {
  fontSize: '30px',
};

const getParentRoute = (pathname) => {
  // Assuming the parent route is the first part of the path (e.g., "/email/inbox" -> "/email")
  return `/${pathname.split('/')[1]}`;
};

const SideNavBar = () => {
  const location = useLocation();

  const isLinkActive = (pathname) => getParentRoute(location.pathname) === pathname;

  const handleVideoCallClick = () => {
    // Perform any other actions if needed
    window.location.href = "/videocall";

  };

  return (
    <div
      style={{
        width: '60px',
        backgroundColor: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        }}
    >
      <Link to="/email/inbox">
        <StyledButton
          startIcon={<MailIcon style={iconStyle} />}
          style={isLinkActive('/email') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
      <Link to="/chat">
        <StyledButton
          startIcon={<MessageIcon style={iconStyle} />}
          style={isLinkActive('/chat') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
      <Link to="/videocall">
        <StyledButton
          startIcon={<VideoCallIcon style={iconStyle} />}
          style={isLinkActive('/videocall') ? { backgroundColor: grey[300] } : {}}
          onClick={handleVideoCallClick}
        />
      </Link>
      <Link to="/note/notes">
        <StyledButton
          startIcon={<DescriptionIcon style={iconStyle} />}
          style={isLinkActive('/note') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
      <Link to="/calendar">
        <StyledButton
          startIcon={<AgendaIcon style={iconStyle} />}
          style={isLinkActive('/agenda') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
      <Link to="/gmailapi">
        <StyledButton
          startIcon={<GoogleIcon style={iconStyle} />}
          style={isLinkActive('/gmailapi') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
      <Link to="/contact">
        <StyledButton
          startIcon={<ContactsIcon style={iconStyle} />}
          style={isLinkActive('/contact') ? { backgroundColor: grey[300] } : {}}
        />
      </Link>
    </div>
  );
};

export default SideNavBar;
