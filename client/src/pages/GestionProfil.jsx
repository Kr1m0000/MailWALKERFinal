// import React, { useContext, useRef, useState, useEffect } from 'react';
// import Log from '../components/log';
// import { UidContext } from '../components/AppContext';
// import Navbar from '../components/navbar';
// import axios from 'axios';

// const GestionProfil = () => {
//   const [showPasswordFields, setShowPasswordFields] = useState(false);
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [errorCurrentPassword, setErrorCurrentPassword] = useState('');
//   const [errorNewPassword, setErrorNewPassword] = useState('');
//   const [errorConfirmPassword, setErrorConfirmPassword] = useState('');

//   const [confirmation, setConfirmation] = useState('');
//   const uid = useContext(UidContext);
//   const fileInputRef = useRef(null);
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     Pseudo: '',
//     email: '',
//     trustedEmail: '',
//     password: '',
//     birthdate: '',
//     profilePicture: null,
//     gender: '',
//     phoneNumber: '',

//   });

//   const defaultProfilePicture = '/uploads/profil/random-user.png';

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         if (!uid) {
//           return;
//         }

//         const response = await axios.get(`${process.env.REACT_APP_API_URL}api/user/${uid}`);
//         const userDataFromApi = response.data;

//         setFormData({
//           firstname: userDataFromApi.firstName,
//           lastname: userDataFromApi.lastName,
//           Pseudo: userDataFromApi.pseudo,
//           email: userDataFromApi.email,
//           trustedEmail: userDataFromApi.trustedEmail,
//           phoneNumber: userDataFromApi.phoneNumber,
//           password: '',
//           birthdate: userDataFromApi.birthdate,
//           profilePicture: userDataFromApi.profilePicture,
//           gender: userDataFromApi.gender,
//           createdAt: userDataFromApi.createdAt,
//         });

//         console.log('Fetched user data:', formData);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [uid]);

//   const handleImageClick = (e) => {
//     if (fileInputRef.current && editMode) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     setFormData({
//       ...formData,
//       profilePicture: selectedFile,
//     });
//   };

//   const handleEditClick = (e) => {
//     setEditMode(!editMode);

//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//     console.log('Updated Pseudo:', e.target.value);
//   };
//   const handlechangepasword = async (e) => {
//     e.preventDefault();
//     setErrorCurrentPassword('');
//     setErrorNewPassword('');
//     setErrorConfirmPassword('');

//     if (!currentPassword) {
//       setErrorCurrentPassword('Veuillez remplir ce champ.');
//     }
//     if (!newPassword) {
//       setErrorNewPassword('Veuillez remplir ce champ.');
//     }
//     if (!confirmPassword) {
//       setErrorConfirmPassword('Veuillez remplir ce champ.');
//     }
//     else if (newPassword !== confirmPassword) {
//       setErrorNewPassword('Le nouveau mot de passe ne correspond pas à la confirmation.');
//     } else {
//       alert('Le mot de passe a bien été modifié.');
//     }
//   };


//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.put(`${process.env.REACT_APP_API_URL}api/user/${uid}`, formData);
//       console.log('Response:', response);

//       if (response.status === 200) {
//         console.log('');
//         setEditMode(false);
//       } else {
//         console.error('Échec de la mise à jour des informations');
//       }
//     } catch (error) {
//       console.error('Erreur lors de la mise à jour des informations:', error);
//     }
//   };
//   const handleConfirmationChange = (e) => {
//     setConfirmation(e.target.value);
//   };

//   const handleDeleteAccount = async () => {
//     if (confirmation === 'DELETE') {
//       alert('Compte supprimé avec succès !');
//     } else {

//       alert('Le texte de confirmation est incorrect. Le compte n\'a pas été supprimé.');
//     }
//   };


//   return (
//     <>
//       <Navbar />
//       <div className='profil-page'>
//         {uid ? (
//           <>
//             <h1 style={{ textAlign: 'center' }}>My Profile Page</h1>
//             <p style={{ textAlign: 'center' }}>Here is your personal information and options for managing it.</p>
//             <p style={{ textAlign: 'center' }}> Manage your personal information </p>
//             <input
//               type='file'
//               accept='image/*'
//               style={{ display: 'none' }}
//               ref={fileInputRef}
//               onChange={handleFileChange}
//             />
//             <br />
//             <br />

//             <div className="user-box" style={{
//               width: '1190px',
//               height: '100px',
//               margin: '10px',
//               padding: '25px',
//               border: '1px solid #ccc',
//               borderRadius: '10px',
//               display: 'inline-block',
//             }}>
//               <h2>General information</h2><br />
//               <p>Some of this information may be seen by other users of our application services</p>
//               <br />  <br /> <br />
//               <div >

//                 <div style={{ display: 'flex', marginBottom: '50px' }}>
//                   <h3 style={{ flexBasis: '180px', marginRight: '20px' }}> profile picture </h3>
//                   <p style={{ display: 'inline-block', marginLeft: '20px' }}>
//                     Include a profile picture to enhance recognition by other users <br />
//                     and indicate your presence when logged into your account.
//                   </p>
//                 </div>

//                 <div
//                   contentEditable
//                   onClick={handleImageClick}
//                   style={{
//                     width: '110px',
//                     height: '110px',
//                     borderRadius: '50%',
//                     marginLeft: '800px',
//                     marginTop: '-100px',
//                     backgroundImage: `url(${formData.profilePicture ?
//                       URL.createObjectURL(formData.profilePicture) : defaultProfilePicture})`,
//                     backgroundSize: 'cover',
//                     backgroundPosition: 'center',
//                     cursor: editMode ? 'pointer' : 'default',
//                     display: 'inline-block',
//                     verticalAlign: 'top',
//                   }}
//                 >
//                 </div>
//               </div>
//               <br />


//               {!editMode ? (
//                 <>
//                   <div div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> First Name </h3>
//                       <p style={{ margin: '15px 0' }}>{formData.firstname}</p>
//                     </div>

//                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Last Name </h3>
//                       <p style={{ margin: '15px 0' }}>{formData.lastname}</p>
//                     </div>

//                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '210px', marginRight: '20px', marginBottom: '0' }}> Pseudo </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.Pseudo}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Email </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.email}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Trusted Email </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.trustedEmail}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Phone Number </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.phoneNumber}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '20px', marginBottom: '0' }}> Gender </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.gender}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '8px', marginBottom: '0' }}> Birthdate </h3>
//                       <p style={{ margin: '10px 0' }}>{formData.birthdate}</p>
//                     </div>

//                     <div style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc' }}>
//                       <h3 style={{ fontWeight: 'bold', flexBasis: '200px', marginRight: '8px', marginBottom: '0' }}> Account created at </h3>
//                       <p style={{ margin: '10px 0' }}>{new Date(formData.createdAt).toLocaleString()}</p>
//                     </div>

//                   </div>
//                 </>
//               ) : (
//                 <form onSubmit={handleSubmit}>
//                   <h2> Edit your general information</h2>
//                   <br /><br />
//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     First Name:
//                     <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '150px' }} type='text' name='firstname' value={formData.firstName} onChange={handleChange} />
//                   </div>

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label>
//                       Last Name:
//                       <input style={{ margin: '17px 0', marginLeft: '150px', height: '40PX', width: '250px' }} type='text' name='lastname' value={formData.lastName} onChange={handleChange} />
//                     </label>
//                   </div>

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label>
//                       Pseudo:
//                       <input style={{ margin: '17px 0', marginLeft: '170px', height: '40PX', width: '250px' }} type='text' name='pseudo' value={formData.Pseudo} onChange={handleChange} />
//                     </label> <br />
//                   </div>

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label>
//                       Trusted Email:
//                       <input style={{ margin: '17px 0', marginLeft: '130px', height: '40PX', width: '250px' }} type='text' name='trustedEmail' value={formData.trustedEmail} onChange={handleChange} />
//                     </label>
//                   </div>

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label >
//                       Date de Birth:
//                       <input style={{ margin: '17px 0', marginLeft: '140px', height: '40PX', width: '250px' }} type='date' name='dateOfBirth'
//                         value={formData.birthdate} onChange={handleChange} />
//                     </label>
//                   </div>

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label>
//                       Gender:
//                       <input style={{ margin: '17px 0', marginLeft: '180px', height: '40PX', width: '250px' }} type='text' name='gender'
//                         value={formData.gender} onChange={handleChange} />
//                     </label>
//                   </div>
//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <label>
//                       Phone Number:
//                       <input style={{ margin: '17px 0', marginLeft: '130px', height: '40PX', width: '250px' }} type='tel' name='phoneNumber'
//                         value={formData.phoneNumber} onChange={handleChange} />
//                     </label>
//                   </div> <br /><br />

//                   <div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>

//                     <button style={{
//                       height: '40px', width: '230px', backgroundColor: 'white', borderRadius: '200px',
//                       border: '1px solid #fe9e0d', marginLeft: '30px'
//                     }} onClick={(e) => setShowPasswordFields(true)}>
//                       Change the password
//                     </button>

//                     {showPasswordFields && (
//                       <form onSubmit={handlechangepasword}>

//                         <label htmlFor="current_password">Current Password</label>
//                         <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '150px' }}
//                           type="password"
//                           name="current_password"
//                           value={currentPassword}
//                           onChange={(e) => setCurrentPassword(e.target.value)}
//                           required
//                         /><div style={{ color: 'red', marginLeft: '260px' }}>{errorCurrentPassword}</div>
//                         <br />

//                         <label htmlFor="new_password">New Password:</label>
//                         <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '170px' }}
//                           type="password"
//                           name="new_password"
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}

//                         /><br />
//                         <div style={{ color: 'red', marginLeft: '260px' }}>{errorNewPassword}</div>
//                         <label htmlFor="confirm_password">Confirm the new password:</label>
//                         <input style={{ margin: '17px 0', height: '40PX', width: '250px', marginLeft: '80px' }}
//                           type="password"
//                           name="confirm_password"
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}

//                         /><br />
//                         <div style={{ color: 'red', marginLeft: '260px' }}>{errorConfirmPassword}</div>
//                         <input style={{
//                           height: '30px', width: '180px', marginLeft: '50px',
//                           border: '1px solid #fe9e0d',
//                         }} type="submit" value="confirm" onClick={handlechangepasword} />

//                       </form>
//                     )}

//                   </div>

//                   <br />

//                   <div>
//                     <h1 style={{ textAlign: 'center' }}> account settings</h1><br /> <br />
//                     <h2 style={{ marginRight: '100px' }}>Delete Account</h2> <br />
//                     <p style={{ marginRight: '60px' }} >If you delete this account, it will be more difficult for you <br />
//                       to find friends and send them emails and messages</p> <br />
//                     <p>Please confirm the deletion of your account by typing "DELETE" in the box below:</p><br />

//                     <input
//                       type="text"
//                       value={confirmation}
//                       onChange={handleConfirmationChange}
//                       placeholder="Type DELETE to confirm"
//                     /> <br /> <br />
//                     <button onClick={handleDeleteAccount}>Delete Account</button>


//                   </div>
//                   < div style={{ borderBottom: '1px solid #ccc', marginBottom: '17px' }}>
//                     <button type='submit' style={{
//                       backgroundColor: editMode ? '#fe9e0d' : 'transparent',
//                       color: editMode ? 'white' : 'black',
//                       padding: '10px',
//                       borderRadius: '5px',
//                       marginLeft: 1000,
//                       cursor: 'pointer',
//                       border: '2px solid #fe9e0d',
//                       marginTop: '15px ',
//                     }}>Save Changes</button>

//                   </div>
//                 </form>

//               )}
//               {!editMode && (
//                 <div>
//                   <button onClick={handleEditClick}
//                     style={{
//                       backgroundColor: editMode ? '#fe9e0d' : 'transparent',
//                       color: editMode ? 'white' : 'black',
//                       padding: '10px',
//                       borderRadius: '5px',
//                       marginLeft: 1000,
//                       cursor: 'pointer',
//                       border: '2px solid #fe9e0d',

//                     }}>Edit Profile </button>

//                 </div>
//               )}
//             </div>
//           </>
//         ) : (


//           <div className='log-container'>
//             <Log signin={false} signup={true} />
//             <div className='img-container'>
//               <img src='./img/log1.png' alt='img-log' />
//             </div>
//           </div>
//         )
//         }
//       </div >
//     </>
//   );
// };

// export default GestionProfil;