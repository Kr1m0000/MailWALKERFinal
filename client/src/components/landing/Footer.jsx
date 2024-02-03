import React from "react";
import Logo from "../../Assets/logo.png";
import { BsFacebook, BsInstagram, BsLinkedin} from "react-icons/bs";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Button } from "@mui/material";


const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="nav-logo-container">
          <img src={Logo} alt="" />
        </div>
        <div className="footer-icons">
          <Button href="https://www.instagram.com/thesnails.dev/">
               <BsInstagram />
          </Button>
          <Button href="https://www.linkedin.com/company/thesnails/">
               <BsLinkedin />
          </Button>
          <Button href="https://www.instagram.com/thesnails.dev/">
               <BsFacebook />
          </Button>
          <Button href="https://www.instagram.com/thesnails.dev/">
               <FaSquareXTwitter />
          </Button>
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>05 42 84 88 25</span>
          <span>07 92 31 23 99</span>
          <span>contact@walker.com</span>
        </div>
        <div className="footer-section-columns">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="footer-section-columns">
          <a href="/terms" target='_blank' rel='noopener noreferrer'>Terms & Conditions</a>
          <a href="/policy" target='_blank' rel='noopener noreferrer' >Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
