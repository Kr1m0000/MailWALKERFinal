import React, { useState } from 'react';
import axios from 'axios';
import SignInForm from "./SignInForm";
import PhoneInput from 'react-phone-input-2';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import 'react-phone-input-2/lib/style.css';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LockIcon from '@mui/icons-material/Lock';

const SignUpForm = () => {
  const [formSubmit, setFormSubmit] = useState (false);
  const [pseudo, setPseudo] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [trustedEmail, setTrustedEmail] = useState('');
  const [password, setPassword] = useState('');
  const [controlPassword, setControlPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [picture, setPicture] = useState("https://res.cloudinary.com/dnorktqq7/image/upload/v1706797629/zo9wuyzb0hebdwvzytu7.png");
  const [picLoading, setPicLoading] = useState(false);

  const handlePhoneInputChange = (value, data, event, formattedValue) => {
    setPhoneNumber(formattedValue);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@walker\.com$/i;
    

    const terms = document.getElementById('terms');
    const pseudoError = document.querySelector('.pseudo.error');
    const emailError = document.querySelector('.email.error');
    const trustedEmailError = document.querySelector('.trustedEmail.error');
    const passwordError = document.querySelector('.password.error');
    const secretAnswerError = document.querySelector('.secretAnswer.error');
    const questionError = document.querySelector('.question.error');
    const passwordConfirmError = document.querySelector('.password-confirm.error');
    const termsError = document.querySelector('.terms.error');
    const pictureError = document.querySelector('.photo.error');

    passwordConfirmError.innerHTML = '';
    termsError.innerHTML = '';
    emailError.innerHTML = '';
    if (!emailRegex.test(email)) {
      emailError.innerHTML = "Invalid email. Please use '@walker.com' domain";
      return;}
    if (password !== controlPassword || !terms.checked) {
      if ( password !== controlPassword ) passwordConfirmError.innerHTML = "passwords doesn't match";
      if (!terms.checked) termsError.innerHTML = "please agree terms and conditions";
      
    } else {
     
      await axios (
        {
        method: 'post',
        url: `${process.env.REACT_APP_API_URL}api/user/register`,
        data: {
          pseudo,
          email,
          trustedEmail,
          secretAnswer,
          secretQuestion,
          password,
          phoneNumber,
          lastName,
          firstName,
          gender,
          picture,
          birthDate,

        }
      })
      .then((res) => {
        if (res.data.errors) {
          pseudoError.innerHTML= res.data.errors.pseudo;
          emailError.innerHTML= res.data.errors.email;
          trustedEmailError.innerHTML= res.data.errors.trustedEmail;
          passwordError.innerHTML= res.data.errors.password;
          secretAnswerError.innerHTML= res.data.errors.secretAnswer;
          pictureError.innerHTML= res.data.errors.photo;
          questionError.innerHTML= res.data.errors.question;
        } else setFormSubmit (true);
      })
      .catch((err) => console.log(err));
    }

  };
  const handleChange = (event) => {
    setGender(event.target.value);
  };
    
  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
        alert("Please Select an Image!");
        return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "dnorktqq7");
        fetch("https://api.cloudinary.com/v1_1/dnorktqq7/image/upload", {
            method: "post",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                setPicture(data.url.toString());
                console.log(data.url.toString());
                setPicLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setPicLoading(false);
            });
    } else {
        alert("Please Select an Image!");
        setPicLoading(false);
        return;
    }
};
   


  return (
    <>
    {formSubmit ? (
      <>
      <SignInForm/>
      <span></span>
      <h4 className="success" style={{ textAlign: 'center' }}> <br/>Enregistred succesfuly, please login.</h4>
      </>
    ) : (
      <form action='' onSubmit={handleRegister} id='sign-up-form'>
      

      <h4 className="hint"> <PermIdentityIcon/>  General informations</h4> 
        
      
      <label className="form-label-Sign"  >First Name</label>
      <div className="contact-form-container">
      <input type='text' name='firstname' id='firstname' placeholder="Alain" style={{ textAlign: 'center' }} onChange={(e) => setFirstName(e.target.value)} value={firstName}/>
      </div>
      
      
      <label className="form-label-Sign"  htmlFor='lastname'>Last Name</label>
      <div className="contact-form-container">
      <input type='text' name='lastname' id='lastname' placeholder="Turing" style={{ textAlign: 'center' }} onChange={(e) => setLastName(e.target.value)} value={lastName}/></div>

      
      <label className="form-label-Sign"  htmlFor='birthdate'>Birthdate</label>
      <div className="contact-form-container">
      <input type='date' name='birthdate' id='birthdate' style={{ textAlign: 'center' }} onChange={(e) => setBirthDate(e.target.value)} value={birthDate}/></div>
      

      
      <label className="form-label-Sign"  htmlFor='gender'>Gender</label>
      <div className="contact-form-container">
          <br/>

        <FormControl sx={{ m: 1, minWidth: 350 }} size="small">
          <InputLabel id="demo-select-small-label" >Gender</InputLabel>
          <Select labelId="demo-select-small-label"
                  id="demo-select-small"
                  label="Gender"
                  value={gender} onChange={handleChange}>
                
                <MenuItem value={"Male"}>Male</MenuItem>
                <MenuItem value={"Female"}>Female</MenuItem>
                         
          </Select>
        </FormControl>
      
      {/* <input type='gender' name='gender' id='gender' onChange={(e) => setGender(e.target.value)} value={gender}/> */}
      </div>
      <br/>
      <br/>

      <h4 className="hint"><ManageAccountsIcon/>  Account credentials</h4>

     
      <label className="form-label-Sign"  htmlFor='pseudo'>Pseudo</label>
      <div className="contact-form-container">
      <input type='text' name='pseudo' id='pseudo' placeholder="CoolUsername123" style={{ textAlign: 'center' }} onChange={(e) => setPseudo(e.target.value)} value={pseudo}/>
      </div>
      <div className='pseudo error' style={{ textAlign: 'center' }} ></div>
   
   
     
      <label  className="form-label-Sign"  htmlFor='email'>Email</label>
      <div className="contact-form-container">
      <input type='text' name='email' id='email' placeholder="exemple@walker.com" style={{ textAlign: 'center' }} onChange={(e) => setEmail(e.target.value)} value={email}/></div>
      <div className='email error' style={{ textAlign: 'center' }} ></div>
      
    
     
      <label  className="form-label-Sign"  htmlFor='password'>Password</label>
      <div className="contact-form-container">
      <input type='password' name='password' id='password' placeholder="strongPASS007" style={{ textAlign: 'center' }} onChange={(e) => setPassword(e.target.value)} value={password}/>
      </div>
      <div className='password error' style={{ textAlign: 'center' }} ></div>
      

      <label className="form-label-Sign"  htmlFor='password-conf'>Confirm password</label>
      <div className="contact-form-container">
      <input type='password' name='password' id='password-confirm' placeholder="strongPASS007" style={{ textAlign: 'center' }} onChange={(e) => setControlPassword(e.target.value)} value={controlPassword}/>
      </div>
      <div className='password-confirm error' style={{ textAlign: 'center' }} ></div>
      <br/>
      <br/>
     


      <h4 className="hint"><LockIcon/>  Security section</h4>
      
      
      <label className="form-label-Sign"  htmlFor='email'>Trusted Email</label>
      <div className="contact-form-container">
      <input type='text' name='temail' id='temail' placeholder="exemple@exemple.com" style={{ textAlign: 'center' }} onChange={(e) => setTrustedEmail(e.target.value)} value={trustedEmail}/>
      </div>
      <div className='trustedEmail error' style={{ textAlign: 'center' }} ></div>

      <label htmlFor='phoneNumber'>Phone Number</label>
      
      <div className="contact-form-container">
      <PhoneInput
              sx={{ m: 1, minWidth: 4000 }}
              country={'dz'}
              inputProps={{ required: true }}
              name="phoneNumber"
              id="phoneNumber"
              onChange={handlePhoneInputChange}
              value={phoneNumber}
            />
      </div>


     
      <label className="form-label-Sign"  htmlFor='secretQuestion' >Secret Question</label>
      <div className="contact-form-container">
      <input type='text' name='secretQuestion' id='secretQuestion' placeholder="What's your favorite color?" style={{ textAlign: 'center' }} onChange={(e) => setSecretQuestion(e.target.value)} value={secretQuestion}/>
      </div>
      <div className='secretQuestion error' style={{ textAlign: 'center' }} ></div>
    

    
      
      <label className="form-label-Sign"  htmlFor='answer'>Secret Answer</label>
      <div className="contact-form-container">
      <input type='password' name='answer' id='secretAnswer' placeholder="blue" style={{ textAlign: 'center' }} onChange={(e) => setSecretAnswer(e.target.value)} value={secretAnswer}/>
      </div>
      <div className='secretAnswer error' style={{ textAlign: 'center' }} ></div>

      <label htmlFor='photo'>Photo</label>
      <div className="contact1-form-container">
      <input
      type="file"
      p={0}
      accept="image/*"
      onChange={(e) => postDetails(e.target.files[0])}
      sx={{
        width: "120px", // Set the desired width
        height: "20px", // Set the desired height
        padding: "0px", // Adjust padding as needed
        fontSize: "20px", // Set the font size
      }}
    />
      </div>
      
      <div className='photo error'></div>
      <br/>
      
      <div className="checkbox-container">
      <input  type='checkbox' id='terms' />
      <label className="form-label-Sign-iagree"  htmlFor='terms'>I agree
      <a href='/terms' target='_blank' rel='noopener noreferrer'> terms and conditions</a>
      </label>
      </div>
      <div className='terms error' style={{ textAlign: 'center' }}></div>
      <br/>
  
      
      
      <input   className="secondary-button-center" type='submit' value="Validate" />
    </form>
    )}
     </>
    
  );
};

export default SignUpForm;
//cbn 