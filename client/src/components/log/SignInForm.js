import React, { useState } from "react";
import axios from "axios";
import PasswordResetForm from "./PasswordResetForm";

const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordForgotten, setPasswordForgotten] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = (e) => {
    e.preventDefault();
    setPasswordForgotten(true);
    console.log("Reset password link clicked");
  };

  const handleLogin = (e) => {
    e.preventDefault();
   

    axios({
      method: "post",
      url: `${process.env.REACT_APP_API_URL}api/user/login`,
      withCredentials: true,
      data: {
        email,
        password,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.errors) {
          setError('Email or password incorrect.');
        } else {
          window.location = "/email/inbox";
        }
      })
      .catch((err) => {
        
        console.log(err);
      });
  };

  return (
    <>
      {passwordForgotten ? (
        <>
          <PasswordResetForm />
          <span></span>
        </>
      ) : (
        <form action="" onSubmit={handleLogin} id="sign-up-form">
          <label className="form-label-Sign" htmlFor="email">
            Email
          </label>
          <div className="contact-form-container">
            <input
              type="text"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="email error"></div>

          <br />
          <label className="form-label-Sign" htmlFor="password">
            Password
          </label>
          <div className="contact-form-container">
            <input
              type="password"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="error" style={{ textAlign: 'center' }}>{error}</div>

          <label className="hint" htmlFor="terms">
            I forgot my password. &nbsp;&nbsp;
            <a
              id="reset-password"
              className="hint"
              href="/profil"
              onClick={handleResetPassword}
            >
              Reset password?
            </a>
          </label>
          <br />

          <input
            className="secondary-button-center"
            type="submit"
            value="log in"
          />
        </form>
      )}
    </>
  );
};

export default SignInForm;
//CBN
