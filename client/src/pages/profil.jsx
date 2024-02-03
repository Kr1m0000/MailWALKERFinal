import React, { useContext, useRef, useState, useEffect } from 'react';
import Log from '../components/log';
import { UidContext } from '../components/AppContext';
import Navbar from '../components/navbar';
import axios from 'axios';
import FaceIcon from '@mui/icons-material/Face';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import EditIcon from '@mui/icons-material/Edit';
import ManageAccounts from '@mui/icons-material/ManageAccounts';
import { HomeOutlined, EmailOutlined, ChatOutlined, NoteOutlined} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import { Button, Menu, MenuItem, MenuList } from '@mui/material';
import Footer from '../components/landing/Footer';



const Profil = () => {
  
  
  const [showPasswordFields, setShowPasswordFields] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorPseudoTaken, setErrorPseudoTaken] = useState('');
  const [errorTrustedEmail, setErrorTrustedEmail] = useState('');
  const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorConfirmPassword, setErrorConfirmPassword] = useState('');
  const fileInputRef = useRef(null);
  const [picUrl, setpicUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');
  const uid = useContext(UidContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({

    firstName: '',
    lastName: '',
    pseudo: '',
    email: '',
    trustedEmail: '',
    password: '',
    birthdate: '',
    gender: '',
    phoneNumber: '',
    pic: '',

  });

  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        
        if (!uid) {
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/${uid}`);
        const userDataFromApi = response.data;

        setFormData({
          firstName: userDataFromApi.firstName,
          lastName: userDataFromApi.lastName,
          pseudo: userDataFromApi.pseudo,
          email: userDataFromApi.email,
          trustedEmail: userDataFromApi.trustedEmail,
          phoneNumber: userDataFromApi.phoneNumber,
          password: '',
          birthdate: userDataFromApi.birthdate,
          pic: userDataFromApi.pic,
          gender: userDataFromApi.gender,
          createdAt: userDataFromApi.createdAt,
        });
        setpicUrl(userDataFromApi.pic);

        console.log('Fetched user data:', formData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [uid]);



  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "long", year: "numeric" };
    return date.toLocaleDateString("fr-FR", options);
  }; 



  const updateProfilePicture = async (newPicUrl) => {
    console.log('Sending profile picture update with URL:', newPicUrl);
    
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}api/user/${uid}/updatePic`,
        { newPic: newPicUrl }, 
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('Profile picture updated in the backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile picture in the backend:', error);
    }
  };


  
  const postDetails = async (pics) => {
    setLoading(true);
  
    if (pics === undefined) {
      setLoading(false);
      console.log('No profile picture selected');
      return;
    }
  
    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append('file', pics);
      data.append('upload_preset', 'mailWalker');
      data.append('cloud_name', 'dokzpj9jg');
  
      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/dokzpj9jg/image/upload',
          {
            method: 'post',
            body: data,
          }
        );
  
        if (!response.ok) {
          throw new Error('Error uploading image to Cloudinary');
        }
  
        const imageData = await response.json();
        console.log('Image uploaded to Cloudinary:', imageData);
  
        console.log('Profile Picture URL:', imageData.url);
        setpicUrl(imageData.url.toString());
        
        
        await updateProfilePicture(imageData.url.toString());
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
      }
    }
  };
  

  

  const handleChangeProfilePicture = (e) => {
    const selectedFile = e.target.files && e.target.files.length > 0 ? e.target.files[0] : null;
  
    if (selectedFile) {
      postDetails(selectedFile);
    } else {
      console.error('No file selected');
    }
  };


  

  const handleEditClick = (e) => {
    
    setEditMode(!editMode);

  };



  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log('Updated Pseudo:', e.target.value);
  };


  const handlechangepasword = async (e) => {
    e.preventDefault();
  
    setErrorCurrentPassword('');
    setErrorNewPassword('');
    setErrorConfirmPassword('');
  
    let isValid = true;  
  
    if (!currentPassword) {
      setErrorCurrentPassword('Veuillez remplir ce champ.');
      isValid = false; 
    }
    if (!newPassword) {
      setErrorNewPassword('Veuillez remplir ce champ.');
      isValid = false; 
    }
    if (!confirmPassword) {
      setErrorConfirmPassword('Veuillez remplir ce champ.');
      isValid = false;
    }
    if (newPassword !== confirmPassword) {
      setErrorNewPassword('Le nouveau mot de passe ne correspond pas à la confirmation.');
      setErrorConfirmPassword('Le nouveau mot de passe ne correspond pas à la confirmation.');
      isValid = false;
    }
  
    if (isValid) {
    
      try {
        const response = await axios.put(`${process.env.REACT_APP_API_URL}api/user/${uid}`, { currentPassword, newPassword, confirmPassword });
        console.log('Response:', response);
        alert('Le mot de passe a bien été modifié.');
      } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
  
        if (error.response && error.response.status === 401) {
          setErrorCurrentPassword('Mot de passe actuel incorrect.');
        } else if (error.response && error.response.status === 400) {
          setErrorNewPassword('Le nouveau mot de passe ne répond pas aux exigences.');
          setErrorConfirmPassword('Le nouveau mot de passe ne répond pas aux exigences.');
        } else {
          console.error('Erreur inconnue lors de la mise à jour du mot de passe.');
        }
      }
    }
  }; 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}api/user/${uid}`, formData);
      console.log('Response:', response);

      if (response.status === 200) {
        console.log('');
        setEditMode(false);
      } else {
        console.error('Échec de la mise à jour des informations');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des informations:', error);
      if (error.response && error.response.status === 400) {
        if (error.response.data && error.response.data.error) {
          if (error.response.data.error.includes('Pseudo')) {
            setErrorPseudoTaken(error.response.data.error);
          } else if (error.response.data.error.includes('Invalid trusted email')) {
            setErrorTrustedEmail("Invalid trusted email, please provide a valid email address");
          } else {
            console.error('Erreur de validation:', error.response.data.error);
          }
        } else {
          console.error('Erreur inconnue liée au pseudo.');
        }
      }
    }
  };
   
      


  
  const handleConfirmationChange = (e) => {
    setConfirmation(e.target.value);
  };

  

  const handleDeleteAccount = async () => {
    if (confirmation === 'DELETE') {
      alert('Compte supprimé avec succès !');
    } else {

      alert('Le texte de confirmation est incorrect. Le compte n\'a pas été supprimé.');
    }
  };



   
const [anchorEl, setAnchorEl] = React.useState(null);

const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
}; 

  return (
    <>
    <div className='App'>
      <Navbar />
      <div className='profil-page'>
        {uid ? (
          <><Button  aria-controls="header-menu" aria-haspopup="true" onClick={handleClick}  style={{
                          backgroundColor: 'black', 
                          color: '#FFA500', 
                          marginTop:'15px',marginBottom:'15px', borderRadius:'15px', marginLeft:'47.5%'

                      }} >
              <MenuOpenRoundedIcon/>  Back
            </Button>
                    <Menu
                id="header-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{
                  border: '2px solid #FFA500', 
                  borderRadius: '8px', 
                }}
              >
                
                <MenuItem
                  component={Link}
                  to="/email"
                  onClick={handleClose}
                  style={{ color: '#FFA500' }} 
                >
                  <EmailOutlined />
                  Email
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/chat"
                  onClick={handleClose}
                  style={{ color: '#FFA500' }} 
                >
                  <ChatOutlined />
                  Chat
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/note"
                  onClick={handleClose}
                  style={{ color: '#FFA500' }} 
                >
                  <NoteOutlined />
                  Notes
                </MenuItem>
              </Menu>
            <h1 style={{ textAlign: 'center' }}> <FaceIcon/>   My Profile Page</h1>
            <p style={{ textAlign: 'center', color: 'green', fontWeight: 'bold', }}>Here are your personal information</p>
            <p style={{ textAlign: 'center', color: 'green' }}>Effortlessly manage and update your details</p>
            <h2  style={{ textAlign: 'center', color: '#fe9e0d', fontSize: '24px', marginBottom: '10px'}}> <WavingHandIcon/>  Hello {formData.firstName} {formData.lastName}!</h2>
            <div style={{marginLeft: '45%'}}>
            
              <br/>
              <br/>
           
              <br/>
                </div>

            <div className="user-box" style={{
            width: '90%',
            maxWidth: '600px', 
            margin: 'auto',
            padding: '2%',
            backgroundColor: '#F0EFEF',
            border: '4px solid #fe9e0d',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            '@media (max-width: 768px)': { 
                width: '95%',
                padding: '5px', 
            }
        }}>

             
             
              
             
                  





              {!editMode ? (
                <>
                  <div div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold',flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> First Name </h3>
                      <p style={{ margin: '15px 0' }}>{formData.firstName}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Last Name </h3>
                      <p style={{ margin: '15px 0' }}>{formData.lastName}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '210px', marginRight: '20px', marginBottom: '0' }}> Pseudo </h3>
                      <p style={{ margin: '10px 0' }}>{formData.pseudo}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Email </h3>
                      <p style={{ margin: '10px 0' }}>{formData.email}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Trusted Email </h3>
                      <p style={{ margin: '10px 0' }}>{formData.trustedEmail}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Phone Number </h3>
                      <p style={{ margin: '10px 0' }}>{formData.phoneNumber}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Gender </h3>
                      <p style={{ margin: '10px 0' }}>{formData.gender}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '8px', marginBottom: '0' }}> Birthdate </h3>
                      <p style={{ margin: '10px 0' }}>{formatDate(formData.birthdate)}</p>
                    </div>

                    <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
                      <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '8px', marginBottom: '0' }}> Account created at </h3>
                      <p style={{ margin: '10px 0' }}>{new Date(formData.createdAt).toLocaleString()}</p>
                    </div>

                  </div>
                </>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h2 style={{color:'#fe9e0d'}}> < EditIcon/> Your General Information</h2>
                  
                  <br /><br />
                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                  <label style={{ fontWeight: 'bold' }}>First Name:
                  <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '150px' , borderRadius: '15px',border: '2px solid #ccc'}} type='text' name='firstName' value={formData.firstName} onChange={handleChange} />
                  </label>
                  </div>

                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label style={{ fontWeight: 'bold' }} >
                      Last Name:
                      <input style={{ margin: '17px 0', marginLeft: '150px', height: '40PX', width: '250px' , borderRadius: '15px',border: '2px solid #ccc' }} type='text' name='lastName' value={formData.lastName} onChange={handleChange} />
                    </label>
                  </div>

                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label style={{ fontWeight: 'bold' }} >
                      Pseudo:
                      <input style={{ margin: '17px 0', marginLeft: '170px', height: '40PX', width: '250px' , borderRadius: '15px',border: '2px solid #ccc' }} type='text' name='pseudo' value={formData.pseudo} onChange={handleChange} />
                    </label> <br />
                    <div style={{ color: 'red', marginLeft: '260px', fontWeight: 'bold'  }}>{errorPseudoTaken}</div>
                  </div>

                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label style={{ fontWeight: 'bold' }} >
                      Trusted Email:
                      <input style={{ margin: '17px 0', marginLeft: '130px', height: '40PX', width: '250px' , borderRadius: '15px',border: '2px solid #ccc'}} type='text' name='trustedEmail' value={formData.trustedEmail} onChange={handleChange} />
                    </label>
                    <div style={{ color: 'red', marginLeft: '260px', fontWeight: 'bold' }}>{errorTrustedEmail}</div>
                  </div>

                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label  style={{ fontWeight: 'bold' }}>
                      Birthdate:
                      <input style={{ margin: '17px 0', marginLeft: '160px', height: '40PX', width: '250px', borderRadius: '15px',border: '2px solid #ccc' }} type='date' name='birthdate'
                       value={formData.birthdate} onChange={handleChange} />
                    </label>
                  </div>

                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label  style={{ fontWeight: 'bold' }}>
                      Gender:
                      <input style={{ margin: '17px 0', marginLeft: '170px', height: '40PX', width: '250px' , borderRadius: '15px',border: '2px solid #ccc'}} type='text' name='gender'
                        value={formData.gender} onChange={handleChange} />
                    </label>
                  </div>
                  <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
                    <label  style={{ fontWeight: 'bold' }}>
                      Phone Number:
                      <input style={{ margin: '17px 0', marginLeft: '120px', height: '40PX', width: '250px', borderRadius: '15px',border: '2px solid #ccc' }} type='tel' name='phoneNumber'
                        value={formData.phoneNumber} onChange={handleChange} />
                    </label>
                    < div style={{  marginBottom: '17px' }}>
                    <button type='submit' style={{
                      backgroundColor: editMode ? '#fe9e0d' : 'transparent',
                      color: editMode ? 'white' : 'black',
                      padding: '10px',
                      borderRadius: '5px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                      border: '2px solid #fe9e0d',
                      marginTop: '15px ',
                    }}>Save Changes</button>

                  </div>
                  </div> <br />

                  <div style={{  marginBottom: '17px' }}>

                    {showPasswordFields && (
                      <form onSubmit={handlechangepasword}>
                        
                        <h2 style={{color:'#fe9e0d'}}> < EditIcon/> Change password</h2>
                        <br/>
                        <br/>

                        <label htmlFor="current_password">Current Password:</label>
                        <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '150px' ,  borderRadius: '15px', border: '2px solid #ccc' }}
                          type="password"
                          name="current_password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                        /><div style={{ color: 'red', marginLeft: '260px' }}>{errorCurrentPassword}</div>
                      

                        <label htmlFor="new_password">New Password:</label>
                        <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '170px' ,  borderRadius: '15px',  border: '2px solid #ccc' }}
                          type="password"
                          name="new_password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}

                        /><br />
                        <div style={{ color: 'red', marginLeft: '260px' }}>{errorNewPassword}</div>
                        <label htmlFor="confirm_password">Confirm new password:</label>
                        <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '125px',  borderRadius: '15px',border: '2px solid #ccc' }}
                          type="password"
                          name="confirm_password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}

                        /><br />
                        <div style={{ color: 'red', marginLeft: '260px' }}>{errorConfirmPassword}</div>
                        < div style={{  marginBottom: '17px' }}></div>

                        <button type='submit' onClick={handlechangepasword}  style={{
                      backgroundColor: editMode ? '#fe9e0d' : 'transparent',
                      color: editMode ? 'white' : 'black',
                      padding: '10px',
                      borderRadius: '5px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                      border: '2px solid #fe9e0d',
                      marginTop: '15px ',
                    }}>Save Changes</button>

                    <div/>
                    

                        
                       

                      </form>
                    )}

                  </div>

                  
                  
                </form>

              )}
              {!editMode && (
                <div>
                  <button onClick={handleEditClick}
                    style={{
                      backgroundColor: editMode ? '#fe9e0d' : 'transparent',
                      color: editMode ? 'white' : 'black',
                      padding: '10px',
                      borderRadius: '5px',
                      marginLeft: '15px',
                      cursor: 'pointer',
                      border: '2px solid #fe9e0d',

                    }}>Edit Profile </button>

                </div>

              )}


            </div>
          </>
        ) : (


          <div className='log-container'>
            
            <Log signin={false} signup={true} />
            
            <div className='img-container'>
            <img src='./img/log1.png' alt='img-log' style={{ marginRight: '125px' }} />

            </div>
          </div>
          
        )}
      </div>
      
      <style jsx>{`
  
  .log-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
  }

  .img-container {
    max-width: 50%;
  }

  @media (max-width: 600px) {
   
    .log-container {
      flex-direction: column; 
      align-items: center;
    }

    
    .img-container {
      max-width: 60%; 
      margin-top: 20px;
    }
  }
`}</style>
<Footer></Footer>
</div>
    </>
  );
};

export default Profil;