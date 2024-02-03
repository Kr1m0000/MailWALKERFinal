import React from "react";
import ProfilePic from "../../Assets/logoTEAM.png";
import { AiFillStar } from "react-icons/ai";

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Testimonial</p>
        <h1 className="primary-heading">What We Are Saying</h1>
        <p className="primary-text">
          "MailWalker's a user-friendly application that aims to redefine email experiences."
        </p>
      </div>
      <div className="testimonial-section-bottom">
        <img src={ProfilePic} alt="" />
        <p>
        "MailWalker is a designed to be a game-changer! As a comprehensive email all-in-one service, it seamlessly integrates an array of powerful functionalities, making it the go-to solution for all your email needs. TheSnails is not just proud, but downright enthusiastic about the robust capabilities and unmatched efficiency that MailWalker brings to the table."
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>TheSnails</h2>
      </div>
    </div>
  );
};

export default Testimonial;
