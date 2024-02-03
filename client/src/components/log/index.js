import React, { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";


const Log = (props) => {
  const [signUpModal, setSignUpModal] = useState(props.signup);
  const [signInModal, setSignInModal] = useState(props.signin);

  const handleModals = (e) => {
    if (e.target.id === "register") {
      setSignInModal(false);
      setSignUpModal(true);
      // Reset password form is not active
    } else if (e.target.id === "login") {
      setSignInModal(true);
      setSignUpModal(false);
      // Reset password form is not active
    }
  };

  return (
    <div className="connection-form">
      <div className="form-container">
        <ul>
          <li
            onClick={handleModals}
            id="register"
            className={signUpModal ? "secondary-button" : ""}
          >
            Sign up
          </li>
          <li
            onClick={handleModals}
            id="login"
            className={signInModal ? "secondary-button" : ""}
          >
            Login
          </li>
        </ul>
        {signUpModal && <SignUpForm />}
        {signInModal && <SignInForm />}
      </div>
    </div>
  );
};

export default Log;
