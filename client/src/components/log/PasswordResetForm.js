import React, { useState } from "react";
import axios from "axios";
import SignInForm from "./SignInForm";

const PasswordResetForm = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [newPassword, setPassword] = useState("");
  const [confirmNewPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [secretAnswer, setSecretAnswer] = useState("");
  const [secretQuestion, setSecretQuestion] = useState("");
  const [error, setError] = useState("");
  const [formSubmit, setFormSubmit] = useState("");

  const handleWrapper = async (e) => {
    e.preventDefault();
    handleRequestReset();
    handleGetSecretQuestion();
  };
  const handlePhoneReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/stepone`,
        {
          email,
        }
      );

      if (response.data.errors) {
        setError(response.data.errors.message);
      } else {
        setStep(4);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while requesting password reset.");
    }
  };
  const handlePhoneResetPassword = async (e) => {
    e.preventDefault();
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );

    passwordConfirmError.innerHTML = "";
    if (newPassword !== confirmNewPassword) {
      passwordConfirmError.innerHTML = "passwords doesn't match";
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/steptwo`,
          {
            email,
            otp: otpPhone,
            nouveauMotDePasse: newPassword,
          }
        );

        if (response.data.errors) {
          setError(response.data.errors.message);
        } else {
          setFormSubmit(true);
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while resetting the password.");
      }
    }
  };
  const handleRequestReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/trustedemail`,
        {
          email,
        }
      );

      if (response.data.errors) {
        setError(response.data.errors.message);
      } else {
        setStep(2);
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while requesting password reset.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );

    passwordConfirmError.innerHTML = "";
    if (newPassword !== confirmNewPassword) {
      passwordConfirmError.innerHTML = "passwords doesn't match";
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/resetpassword`,
          {
            email,
            otp,
            nouveauMotDePasse: newPassword,
          }
        );

        if (response.data.errors) {
          setError(response.data.errors.message);
        } else {
          setFormSubmit(true);
        }
      } catch (error) {
        console.error(error);
        setError("An error occurred while resetting the password.");
      }
    }
  };

  const handleGetSecretQuestion = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}api/user/secretquestion`,
        {
          email,
        }
      );

      if (response.data.secretQuestion) {
        setSecretQuestion(response.data.secretQuestion);
        setStep(3); // Move to the step where secret answer is entered
      } else {
        setError("Secret question not found.");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred while getting the secret question.");
    }
  };

  const handleResetPasswordWithSecretAnswer = async (e) => {
    e.preventDefault();
    const passwordConfirmError = document.querySelector(
      ".password-confirm.error"
    );

    passwordConfirmError.innerHTML = "";
    if (newPassword !== confirmNewPassword) {
      passwordConfirmError.innerHTML = "passwords doesn't match";
    } else {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}api/user/resetpassword2`,
          {
            email,
            secretAnswer,
            newPassword,
          }
        );

        if (response.data.message) {
          setFormSubmit(true);
        } else {
          setError("Password reset failed.");
        }
      } catch (error) {
        console.error(error);
        setError(
          "An error occurred while resetting the password with the secret answer."
        );
      }
    }
  };

  return (
    <>
      {formSubmit ? (
        <>
          <SignInForm />
          <span></span>
          <h4 className="success" style={{ textAlign: 'center' }}>
            <br/>
            Your password has been successfully reset, please login.
          </h4>
        </>
      ) : (
        <div>
          {step === 1 && (
            <form onSubmit={handleWrapper}>
              <br/>
              <label  className="hint" htmlFor="email">Please provide your account's email</label>
              
              <div className="contact-form-container">
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              </div>
              <br />
              
              <button type="button"  className="secondary-button"  onClick={handleRequestReset}>
                Use your recuperation email
              </button>
              <br />
              <button type="button"  className="secondary-button"  onClick={handlePhoneReset}>
                Use your phone number
              </button>
              <br />             
              <button className="secondary-button"  type="button" onClick={handleGetSecretQuestion}>
                Use your secret question
              </button>
              <div className="error" style={{ textAlign: 'center' }}></div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleResetPassword}>
              <h4 className="success" style={{ textAlign: 'center' }}>
                Confirmation code was sent to your trusted email.
              </h4>
              <br />
              <label  className="form-label-Sign"  htmlFor="otp">Confirmation Code</label>
           
              <div className="contact-form-container">
              <input
                type="text"
                id="pseudo"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              </div>
              <br />

              <label  className="form-label-Sign"  htmlFor="password">New Password</label>
             
              <div className="contact-form-container">
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>


              <div className="password error" style={{ textAlign: 'center' }}></div>
              <br />

              <label  className="form-label-Sign" htmlFor="confirmPassword">Confirm Password</label>
              <div className="contact-form-container">
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              </div> 

              <div className="password-confirm error" style={{ textAlign: 'center' }}></div>
              <br />
              <br />
              <button className="secondary-button-center" type="submit">Reset Password</button>
              <br />
              <div className="error" style={{ textAlign: 'center' }}>{error}</div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPasswordWithSecretAnswer}>
              <h4 className="hint" style={{ textAlign: 'center' }}> {secretQuestion} </h4>
              <br />
              <label  className="form-label-Sign" htmlFor="otp">Secret Answer</label>
              <div className="contact-form-container">
              <input
                type="password"
                id="pseudo"
                value={secretAnswer}
                onChange={(e) => setSecretAnswer(e.target.value)}
              />
              </div>
              <br />
              <label  className="form-label-Sign" htmlFor="password">New Password</label>
            
              <div className="contact-form-container">
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>

              <div className="password error" style={{ textAlign: 'center' }}></div>
              <br />
              <label  className="form-label-Sign" htmlFor="confirmPassword">Confirm Password</label>
              <div className="contact-form-container">
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              </div>

              <div className="password-confirm error" style={{ textAlign: 'center' }}></div>
              <br />
              <br />
              <button className="secondary-button-center" type="submit">Reset Password</button>
              <br />
              <div className="error" style={{ textAlign: 'center' }}>{error}</div>
            </form>
          )}
          {step === 4 && (
            <form onSubmit={handlePhoneResetPassword}>
              <h4 className="success" style={{ textAlign: 'center' }}>
                Confirmation code was sent to your phone number.
              </h4>
              <br />
              <label  className="form-label-Sign"  htmlFor="otp">Confirmation Code</label>
             
              <div className="contact-form-container">
              <input
                type="text"
                id="pseudo"
                value={otpPhone}
                onChange={(e) => setOtpPhone(e.target.value)}
              />
              </div>
              <br />

              <label  className="form-label-Sign"  htmlFor="password">New Password</label>
             
              <div className="contact-form-container">
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setPassword(e.target.value)}
              />
              </div>
              <div className="password error" style={{ textAlign: 'center' }}></div>
              <br />

              <label  className="form-label-Sign" htmlFor="confirmPassword">Confirm Password</label>
            
              <div className="contact-form-container">
              <input
                type="password"
                id="confirmPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              </div>
              <div className="password-confirm error" style={{ textAlign: 'center' }}></div>
              <br />
            
              <button className="secondary-button-center" type="submit">Reset Password</button>
              <br />
              <div className="error" style={{ textAlign: 'center' }}>{error}</div>
            </form>
          )}
        </div>
      )}
    </>
  );
};

export default PasswordResetForm;
//cbn
