import React from "react";
import PickMeals from "../../Assets/mail.png";
import ChooseMeals from "../../Assets/comment.png";
import DeliveryMeals from "../../Assets/videocall.png";

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Mailing",
      text: "User-friendly Email Experience with a simple UI.",
    },
    {
      image: ChooseMeals,
      title: "Chating",
      text: "Instant Messaging, Anytime, Anywhere.",
    },
    {
      image: DeliveryMeals,
      title: "Video-Calling",
      text: "Bringing Faces Closer, Wherever You Are.",
    },
  ];
  return (
    <div className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Built-In</p>
        <h1 className="primary-heading">Main functionalities</h1>
        <p className="primary-text">
          Cruise through all your everyday needs though one and only one app 
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
