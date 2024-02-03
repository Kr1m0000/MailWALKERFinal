import React from 'react';
import Navbar from '../components/navbar';

function PrivacyPolicy() {
  return (
    <>
       <Navbar/>
       <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>When you use our services, you are entrusting us with your information. We understand the significant responsibility this entails and diligently work to safeguard your information while ensuring you have control over it.</p>

      <h2>1. Information Collection</h2>
      <p>We collect the following personal information when you use our application:</p>
      <ul>
        <li>Your first and last name: Necessary for personalizing your experience and uniquely identifying you within the application.</li>
        <li>Date of birth: Collected to verify your age and ensure compliance with our application's terms of use.</li>
        <li>Email address: Required for account creation, serving as your login identifier, and sending important notifications about your account.</li>
        <li>Password: Strictly confidential and securely stored for account access protection.</li>
        <li>Answer to a secret question: Provided for security reasons and may be used to assist in password reset if forgotten.</li>
        <li>Phone number: Collected for two-factor authentication, sending a verification code during account login.</li>
      </ul>

      <h2>2. Use of Information</h2>
      <p>We utilize collected information for:</p>
      <ul>
        <li>Providing and improving our services: Personal information enables the use of our application and access to its features. We also use this data to enhance user experience and optimize application performance.</li>
        <li>Data security: Implemented security measures protect personal data from unauthorized access, disclosure, or alteration. Messages and emails within the application are encrypted for confidentiality.</li>
        <li>Communication with you: Email address and phone number may be used to send important account-related communications, such as notifications of setting changes or service updates. We do not share this information with third parties for marketing without explicit consent.</li>
      </ul>

      <h2>3. Data Retention</h2>
      <p>We retain your personal information for the duration necessary to achieve the purposes outlined in this privacy policy unless a longer retention period is required or permitted by law.</p>

      <h2>4. Information Sharing</h2>
      <p>We do not share your personal information with third parties, except under the following circumstances:</p>
      <ul>
        <li>With your consent: Information may be shared with third parties if prior consent is obtained.</li>
        <li>Legal obligations: Personal information may be disclosed if legally required, such as complying with a court order or request from competent authorities.</li>
      </ul>

      <h2>5. Cookies</h2>
      <p>Our application uses cookies to enhance the user experience. They help identify users and personalize their experience on our application.</p>
      <p>The cookies we use do not collect personal information about you. They may be used to save preferences, remember login information, or track activity on our application.</p>

      <h2>6. Your Rights</h2>
      <p>You have the right to access, rectify, delete, or restrict the processing of your personal information. You can also choose to deactivate your account at any time. To exercise your rights or for any questions regarding our privacy policy, please contact us via the provided contact details at the bottom of this page.</p>
</div>
</>
  );
}

export default PrivacyPolicy;