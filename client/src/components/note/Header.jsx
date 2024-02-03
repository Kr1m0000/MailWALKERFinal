import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import axios from "axios";


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

import { FaSearch } from "react-icons/fa";

import { gmailLogo } from "../constants/constant";

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
  const [picture, setPicture] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); 

  const [subMenuAnchorEl, setSubMenuAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleSubMenuClick = (event) => {
    setSubMenuAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
    setAnchorEl(null);
    setSubMenuAnchorEl(null);
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
        setPicture(response.data.picture);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (uid) {
      fetchUserPseudo();
    }
  }, [uid]);

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <MenuIcon color="white" onClick={toggleDrawer} />
        <img src={gmailLogo} alt="logo" className="responsive-logo" />

        <SearchWrapper>
                    <Search color="action" />
                    <InputBase />
                    <Tune color="action"/>
                </SearchWrapper>


        <OptionsWrapper style={{ display: "flex", alignItems: "center" }}>
          
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
