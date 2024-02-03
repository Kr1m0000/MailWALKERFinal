import React from "react";
import Navbar from "../components/navbar";
import Footer from "../components/landing/Footer";


const Privacy = () => {
  
  return (
    
    <>
    <Navbar/>
    <div className="App">
       <br/>
      <div className="work-section-top">
        <p className="primary-subheading">MailWALKER Privacy Policy.</p>
        <h1 className="primary-heading">Privacy Policy</h1>
        <p className="primary-text">
        When you use our services, you are entrusting us with your information. We understand the significant responsibility this entails and diligently work to safeguard your information while ensuring you have control over it.
        </p>
      </div>
      <br/>
      <br/>
      <div className="work-section-top">
        <p className="primary-subheading">1. Information Collection</p>
        <h1 className="primary-heading">Collected informations:</h1>
        <p className="primary-text">
         <ul>
            <li>Your first and last name: Necessary for personalizing your experience and uniquely identifying you within the application.</li>
            <li>Date of birth: Collected to verify your age and ensure compliance with our application's terms of use.</li>
            <li>Email address: Required for account creation, serving as your login identifier, and sending important notifications about your account.</li>
            <li>Password: Strictly confidential and securely stored for account access protection.</li>
            <li>Answer to a secret question: Provided for security reasons and may be used to assist in password reset if forgotten.</li>
            <li>Phone number: Collected for two-factor authentication, sending a verification code during account login.</li>
         </ul>
        </p>
      </div>
      <div className="work-section-top">
        <p className="primary-subheading">2. Use of Information</p>
        <h1 className="primary-heading">How we utilize it:</h1>
        <p className="primary-text">
         <ul>
           <li>Providing and improving our services: Personal information enables the use of our application and access to its features. We also use this data to enhance user experience and optimize application performance.</li>
           <li>Data security: Implemented security measures protect personal data from unauthorized access, disclosure, or alteration. Messages and emails within the application are encrypted for confidentiality.</li>
           <li>Communication with you: Email address and phone number may be used to send important account-related communications, such as notifications of setting changes or service updates. We do not share this information with third parties for marketing without explicit consent.</li>
        </ul>   
        </p>
      </div>
      <div className="work-section-top">
        <p className="primary-subheading">3. Data Retention</p>
        <h1 className="primary-heading">Retentoin duration</h1>
        <p className="primary-text">
           We retain your personal information for the duration necessary to achieve the purposes outlined in this privacy policy unless a longer retention period is required or permitted by law.
        </p>
      </div>
      <div className="work-section-top">
        <p className="primary-subheading">4. Information Sharing</p>
        <h1 className="primary-heading">Circumstances:</h1>
        <p className="primary-text">
           <ul>
             <li>With your consent: Information may be shared with third parties if prior consent is obtained.</li>
             <li>Legal obligations: Personal information may be disclosed if legally required, such as complying with a court order or request from competent authorities.</li>
         </ul>
        </p>
      </div>
      <div className="work-section-top">
        <p className="primary-subheading">5. Cookies</p>
        <h1 className="primary-heading">Cookie usage:</h1>
        <p className="primary-text">
           <p>Our application uses cookies to enhance the user experience. They help identify users and personalize their experience on our application.</p>
           <p>The cookies we use do not collect personal information about you. They may be used to save preferences, remember login information, or track activity on our application.</p>
        </p>
      </div>
      <div className="work-section-top">
        <p className="primary-subheading">6. Your Rights</p>
        <h1 className="primary-heading">Your data control rights:</h1>
        <p className="primary-text">
        You have the right to access, rectify, delete, or restrict the processing of your personal information. You can also choose to deactivate your account at any time. To exercise your rights or for any questions regarding our privacy policy, please contact us via the provided contact details at the bottom of this page.
        </p>
      </div>
      <Footer/>
    </div>
    
    </>
    
    
  );
};

export default Privacy;
