import React, { useState } from "react";
import Logo from "../../Assets/logo.png";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Link, animateScroll as scroll } from "react-scroll";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import { FiArrowRight } from "react-icons/fi";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const menuOptions = [
    // { text: "Home", icon: <HomeIcon />, to: "home" },
    { text: "Download", icon: <InfoIcon />, to: "about" },
    { text: "Testimonials", icon: <CommentRoundedIcon />, to: "testimonials" },
    { text: "Contact", icon: <PhoneRoundedIcon />, to: "contact" },
  ];

  const menuOptions2 = [
    // { text: "Home", icon: <HomeIcon />, to: "home" },
    { text: "Sign In", icon: <InfoIcon />, to: "/profil" },
    { text: "Policy", icon: <CommentRoundedIcon />, to: "/policy" },
    { text: "Terms", icon: <PhoneRoundedIcon />, to: "/terms" },
  ];

  return (
    <nav className="navbar">
      <div className="nav-logo-container">
        <img src={Logo} alt="" />
      </div>
      <div className="navbar-links-container">
      
        {menuOptions.map((item) => (
          <Link
            key={item.text}
            to={item.to}
            spy={true}
            smooth={true}
            offset={-70} 
            duration={500}
            style={{ cursor: "pointer" }}
            activeClass="primary-button" 
          >
            {item.text}
          </Link>
        ))}
        <a href='/profil' className="primary-button">Sign In</a>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
          <a href='/profil' className="secondary-button">
            Sign In {" "}
          </a>
        
          </List>
          <Divider />
        </Box>
      </Drawer>
    </nav>
  );
};

export default Navbar;
