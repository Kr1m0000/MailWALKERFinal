import React from "react";
import BannerBackground from "../../Assets/home-banner-background.png";
import BannerImage from "../../Assets/envelope.png";

import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
 
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            MailWALKER is an all-in-one email service
          </h1>
          <p className="primary-text">
             Choose ease and simplicity for your daily email <span className="orange-text">walk-through</span>
          </p>
          <a href='/profil' className="secondary-button">
            Get started <FiArrowRight />{" "}
          </a>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
