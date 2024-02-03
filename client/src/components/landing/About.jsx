import React from "react";
import AboutBackground from "../../Assets/about-background.png";
import AboutBackgroundImage from "../../Assets/pcmail.png";
import { GoDesktopDownload } from "react-icons/go";


const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">Desktop</p>
        <h1 className="primary-heading">
          MailWALKER is available as a desktop app
        </h1>
        <p className="primary-text">
          Download MailWALKER 
        </p>
        {/* <p className="primary-text">
          Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
          facilisis at fringilla quam.
        </p> */}
        <div className="about-buttons-container">
          <a href='/profil' className="secondary-button">Get started</a>
          <button className="watch-video-button">
            <GoDesktopDownload /> Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
