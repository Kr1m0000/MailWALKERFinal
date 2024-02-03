import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import axios from "axios";
import "./style.css";

import {
  AppBar,
  Toolbar,
  Box,
  InputBase,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Popover,
  styled,
} from "@mui/material";
import Badge from '@mui/material/Badge';
import { getSender } from "../../config/ChatLogics";



import {
  Menu as MenuIcon,
  Tune,

  HelpOutlineOutlined,
  SettingsOutlined,
  AppsOutlined,
  AccountCircleOutlined,
  Search,
  Message,
  EmailOutlined,
  MessageOutlined,
  Cancel,
  LoginOutlined,
  LogoutOutlined,
} from "@mui/icons-material";
import { SelectedChatContext } from '../../context/ChatProvider'; 


import NotificationsIcon from '@mui/icons-material/Notifications';
import notificationSound from './livechat-129007.mp3';

import { FaSearch } from "react-icons/fa";

import { gmailLogo } from "../constants/constant";
import UserList from "./search.jsx";
import { Link } from 'react-router-dom';
import Logout from '../log/logout.js'

const StyledAppBar = styled(AppBar)`
  background: black;
  box-shadow: none;
  height: 62px;
  justify-content: space-between;

  @media (max-width: 600px) {
    height: 56px; // Adjust the height for smaller screens
  }
`;

const SearchWrapper = styled(Box)`
  background: #eaf1fb;
  margin-left: 25px;
  border-radius: 9px;
  min-width: 300px; // Adjust the minimum width for smaller screens
  max-width: 720px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;

  @media (max-width: 600px) {
    min-width: 200px; // Adjust the minimum width for smaller screens
  }
`;

const OptionsWrapper = styled(Box)`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  & > svg {
    margin-left: 20px;
  }

  @media (max-width: 600px) {
    & > svg {
      margin-left: 10px; // Adjust the margin for smaller screens
    }
  }
`;

const CustomLogoutButton = ({ onClick }) => {
  return (
    <button className="custom-logout-button" onClick={onClick}>
      Logout
    </button>
  );
};


const Header = ({ toggleDrawer }) => {
  const uid = useContext(UidContext);
  const [picture, setPicture] = useState("https://res.cloudinary.com/dnorktqq7/image/upload/v1706797629/zo9wuyzb0hebdwvzytu7.png");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); 

  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);
  const [subMenuAnchorEl2, setSubMenuAnchorEl2] = useState(null);
  const { selectedChat, setSelectedChat, chats, setChats, user, notification, setNotification } = useContext(SelectedChatContext);
  const audioElement = new Audio(notificationSound);

  const playNotificationSound = () => {
    audioElement.play().catch(error => {
      // Handle the error, e.g., log it or display a message to the user
      console.error('Error playing audio:', error);
    });
  };


  function handleNewNotification() {

    playNotificationSound();
  }

    




  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
};
const handleSubMenuClick2 = (event) => {
    setSubMenuAnchorEl2(event.currentTarget);
};

const handleMenuClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
};

const handleMenuClose2 = () => {
  setAnchorEl2(null);
  setSubMenuAnchorEl2(null);
};

const handleOpenDialog = () => {
    setOpenDialog(true);
};

const handleCloseDialog = () => {
    setOpenDialog(false);
};



  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  console.log(open);

  const handleSearch = async () => {
    if (!search) {
      alert("Veuillez entrer quelque chose dans la recherche");

      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`${apiUrl}api/user?search=${search}`);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      alert(JSON.stringify(error, null, 2));
    }
  };

  useEffect(() => {
    const fetchUserPseudo = async () => {
      try {
        const response = await axios.get(`${apiUrl}api/user/${uid}`);
        console.log(picture);
        if (response.data.picture === '') setPicture('https://res.cloudinary.com/dnorktqq7/image/upload/v1706797629/zo9wuyzb0hebdwvzytu7.png')
        else setPicture(response.data.picture);
        
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) {
      fetchUserPseudo();
    }
  }, [uid]);

  useEffect(() => {
    if (notification.length > 0) {
      // Appeler la fonction handleNewNotification lorsqu'il y a une nouvelle notification
      handleNewNotification();
    }
  }, [notification]);




  return (
    <StyledAppBar position="static">
      <Toolbar>
        <MenuIcon color="white" onClick={toggleDrawer} />
        <img src={gmailLogo} alt="logo" className="responsive-logo" />

        <SearchWrapper>
          <button
            className="search-buttona"
            onClick={(event) => {
              handleSearch();
              handleClick(event);
            }}
          >
            <Search className="search-icon" />
          </button>
          <input
            style={{ color: "black" }}
            type="text"
            placeholder="Poeple to chat with"
            className="search-inputa"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              // Check if the pressed key is "Enter"
              if (e.key === "Enter") {
                handleSearch(); // You can also call handleClick(event) if needed
              }
            }}
          />
          <Tune color="action" />
        </SearchWrapper>

        <Popover
          backgroundColor="black"
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{ marginTop: "12px", height: "300px" }}
        >
          <UserList users={searchResult} searchValue={search} />
        </Popover>
       

        <Menu
        anchorEl={subMenuAnchorEl2}
        open={Boolean(subMenuAnchorEl2)}
        onClose={handleMenuClose2}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            marginTop: "15px",
            borderRadius: "10px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#E8E8E8",
            color: "#fe9e0d",
          },
        }}
      >
      {!notification.length && <MenuItem>No New Messages</MenuItem>}
        {notification.map((notif) => (
          <MenuItem
            key={notif._id}
            onClick={() => {
              setSelectedChat(notif.chat);
              setNotification(notification.filter((n) => n !== notif));
            }}
          >
            {notif.chat.isGroupChat
              ? `New Message in ${notif.chat.chatName}`
              : `New Message from ${getSender(user, notif.chat.users)}`}
          </MenuItem>
        ))}

      </Menu>

       
        <OptionsWrapper style={{ display: "flex", alignItems: "center" }}>
        <Badge badgeContent={notification.length} color="primary">
                      <NotificationsIcon color="white" style={{ marginRight: '5px' }} onClick={handleSubMenuClick2} />
                    </Badge>
          
          {picture && (
        <img
          src={picture}
          alt="User"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "100%",
            marginLeft: "5px",
          }}
          onClick={handleSubMenuClick}
        />
      )}
      <Menu
        anchorEl={subMenuAnchorEl}
        open={Boolean(subMenuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            marginTop: "15px",
            borderRadius: "10px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            backgroundColor: "#E8E8E8",
            color: "#fe9e0d",
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Link to="/profil" style={{ color: "inherit", textDecoration: "none" }}>
            <AccountCircleOutlined/> Profile
          </Link>
        </MenuItem>
        <MenuItem onClick={handleOpenDialog}>
          <LogoutOutlined /> Logout
        </MenuItem>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              borderRadius: "20px",
            },
          }}
        >
          <DialogTitle>Logout Confirmation</DialogTitle>
          <DialogContent>Are you sure you want to log out?</DialogContent>
          <DialogActions style={{alignItems:'center'}}>
            <Button  onClick={handleCloseDialog} style={{marginRight: '20px', fontSize: 'bold', color: "orange" }}>
              Cancel
            </Button>
            <Logout/>
          </DialogActions>
        </Dialog>
      </Menu>
        </OptionsWrapper>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;
