import React, { useState, useContext, useEffect, useId, useRef } from "react";
import {  Dialog,  styled,  Typography, Box,  InputBase,  TextField,  Button} from "@mui/material";
import {  AttachFile,  Close,  DeleteOutline,  ScheduleSendOutlined} from "@mui/icons-material";
import axios from "axios";
import { UidContext } from "../AppContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import Chip from '@mui/material/Chip';

const dialogStyle = {
  width: '80%',
  maxWidth: '100%',
  maxHeight: '100%',
  boxShadow: 'none',
  '&::-webkit-scrollbar': {
    display: 'none', // Hide the scrollbar for Webkit browsers (Chrome, Safari)
  }
};
const TextFieldStyle = styled(TextField)`
 
`
const DialogWrapper = styled(Dialog)`
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 690px) {
    margin-left: 16px;
    overflow: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
  
`;
const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 10px 15px;
  background: #f2f6fc;
  & > p {
    font-size: 15px;
    font-weight: 500;
  }
`;

const RecipientWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    & > div {
        font-size: 14px;
        border-bottom: 1px solid #F5F5F5;
        margin-top: 10px;
    }
`;

const Footer = styled(Box)`
  justify-content: space-between;
  padding: 18px;
  align-items: center;
  display: flex;
`;

const SendButton = styled(Button)`
background: #FFB603;
color: #fff;
font-weight: 500;
text-transform: none;
border-radius: 18px;
width: 100px;
`;

const ComposeMail = ({ open, setOpenDrawer, email,origine}) => {
  const [data, setData] = useState({email});
  const apiUrl = process.env.REACT_APP_API_URL;
  const uid = useContext(UidContext);
  const [startDate, setStartDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const refbody= useRef();
  const refsubject= useRef();
  let closeit = true;
  let oldData={}
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [draftFiles, setDraftFiles] = useState([]);
  const [transferFiles, setTransferFiles] = useState([]);

  const sentdraft = async () => {
    const formData = new FormData();
    formData.append('to', data.to || email.to);
    formData.append('cc', data.cc || email.cc);
    formData.append('subject', data.subject || email.subject);
    formData.append('body', data.body || email.body);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
    if (startDate) {
      formData.append('scheduledAt', startDate);
    }
  
    try {
      await axios.put(`${apiUrl}api/email/drafts/${email._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.error("Error updating draft:", error);
    }
  }

  useEffect(() => {
    if (origine === 'draft' && email && email.fichiers) {
      setDraftFiles(email.fichiers);
    }
  }, [origine, email]);

  useEffect(() => {
    if (origine === 'transfer' && email && email.fichiers) {
      setTransferFiles(email.fichiers);
    }
  }, [origine, email]);



if (origine=='transfer'){
      oldData={
      to:'',
      cc:'',
      subject:email.subject ?'Fwd: '+email.subject:'Fwd:',
      fichiers : email.fichiers  
    }
}else if (origine=='draft'){
  oldData= {to : email.to,cc : email.cc, subject: email.subject, body : email.body }
}else if (origine=='reply'){
  oldData={
    to:email.from,
    cc:'',
    subject:email.subject ?'Re: '+email.subject:'Re:',
    body:'',
    fichiers : email.fichiers
    }
}

  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
    }
  };

  const handleDeleteSelectedFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };



const sendEmail = async (e) => {

    e.preventDefault();
    const formData = new FormData();
    formData.append('to', data.to || email.to);
    formData.append('cc', data.cc || " " );
    formData.append('subject', ((origine=='transfer' && !data.subject)?refsubject.current.value:data.subject)||"");
    formData.append('body', ((origine=='transfer' && !data.body)?refbody.current.value:data.body)||"");
   
  
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }
  
    if (startDate) {
      formData.append('scheduledAt', startDate);
    }
    if (origine === 'draft') {
      formData.append('idEmaildraft', email._id);
    }
    if (origine === 'reply') {
      formData.append('idemail', email._id);
    }
    if (origine === 'transfer') {       
      formData.append('idemailforTransfer', email._id);
    }
  
    try {
      const currentDate = new Date();
       if (!data.to && !oldData.to) {
          closeit = false;
          alert("Please fill in the field Receipient");
        } else {
          if (startDate && startDate < currentDate) {
            closeit = false;
            alert(
              "The date you have just inserted is an old date! Please insert a valid date "
            );
          } else  if (origine=='reply'){
            const response = await axios.post(
              `${apiUrl}api/email/reply/${uid}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }); 
            } else  if (origine=='transfer'){
              const response = await axios.post(
                `${apiUrl}api/email/sendmail/${uid}`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );
            } else {
            if (origine=='draft'){
              sentdraft();
            }
            
            const response = await axios.post(
              `${apiUrl}api/email/sendmail/${uid}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );
  
            if (response.data != "") {
              closeit = false;
              alert(response.data);
            }
          }
        }
        // Close the compose mail dialog
        if (closeit) {
          setOpenDrawer(false);
          setData({});
          setSelectedFiles([])
        }
        setStartDate();
        setCalendarVisible(false);
        setSelectedFiles([]);
      } catch (error) {
        console.error("Error sending email:", error);
        // Handle error
      }
};

  const toggleCalendar = (e) => {
    setCalendarVisible(!calendarVisible);
  };
  const handleDateChange = (date) => {
    setStartDate(date);
  };


  const openFilePicker = () => {
    // Ouvrir la fenêtre modale de sélection de fichiers directement
    fileInputRef.current.click();
  };
  
  
const closeComposeMail = async (e) => {
    try {
        const formData = new FormData();
        formData.append('to', data.to || "");
        formData.append('cc', data.cc || "");
        formData.append('subject', data.subject || "");
        formData.append('body', data.body || "");
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }
        if (startDate) {
            formData.append('scheduledAt', startDate);
        }
        
        if(origine === 'draft') {
            sentdraft(); // Mettre à jour le brouillon
        } else if (!email) {
            await axios.post(`${apiUrl}api/email/addDrafts/${uid}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        }
        setOpenDrawer(false);
        setData({});
        setSelectedFiles([]); // Réinitialiser les fichiers sélectionnés
    } catch (error) {
        console.error("Error saving draft:", error);
    }
    setOpenDrawer(false);
    setData({});
    setSelectedFiles([]);
};

  return (
    <Dialog open={open} PaperProps={{ sx: dialogStyle }}>
      <Header>
        <Typography>New Message</Typography>
        <Close fontSize="small" onClick={(e) => closeComposeMail(e)} />
      </Header>
      <RecipientWrapper>
        <InputBase
          placeholder="Recipients"
          name="to"
          defaultValue={oldData.to}
          value={ origine=='reply'?oldData.to:null}
          onChange={(e) => onValueChange(e)}
        />
        <InputBase
          placeholder="cc"
          name="cc"
          defaultValue={oldData.cc}
          onChange={(e) => onValueChange(e)}
        />
        <InputBase
          placeholder="subject"
          name="subject"
          defaultValue={oldData.subject}
          onChange={(e) => onValueChange(e)}
          inputRef={refsubject}
        />
      </RecipientWrapper>
      { origine=='transfer' ? 
      <TextField
        placeholder="body"
        multiline
        rows={15}
        sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
        name="body"
        defaultValue={`\n
        ---------- Forwarded message ----------
        Date : ${ format(new Date(email.createdAt ), 'dd/MM/yyyy HH:mm:ss')}
        From : ${email.from}
        Subject : ${email.subject}
        To : ${email.to}\n\n
        ${email.body}`}
        onChange={(e) => onValueChange(e)}
       inputRef={refbody} 
       
      />
  :

  <TextField
    placeholder="body"
    multiline
    rows={15}
    sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" } }}
    name="body"
    defaultValue={oldData.body}
    onChange={(e) => onValueChange(e)}
  />
}

{origine=='reply'&&
<div>
<TextField
    multiline
    sx={{ "& .MuiOutlinedInput-notchedOutline": { border: "none" }
  }}
    value={`On   ${ format(new Date(email.createdAt ), 'dd/MM/yyyy HH:mm:ss')}   ,   <${email.from}> wrote:\n${email.body}\n`}
    style={{ paddingLeft: '2%' }} />
</div>
}

{((origine=='reply' || origine=='transfer')&& oldData.fichiers.length!==0 )&&
    <div>
    <p style={{ marginLeft: '2%', width:'auto'}}>Attachments :</p>
    <br />
    {oldData.fichiers.map((file, index) => (
    <Chip label={file.filename} key={index} style={{ marginLeft: '2%' }} />
  ))}
</div>
}

        {/* Affichage des fichiers sélectionnés */}
        {selectedFiles && selectedFiles.length > 0 && (
          <div>
            {Array.from(selectedFiles).map((file, index) => (
              <Chip label={file.name} key={index} 
              onDelete={() => handleDeleteSelectedFile(index)}/>
            ))}
          </div>
        )}

        {draftFiles && draftFiles.length > 0 && (
          <div>
            {draftFiles.map((file, index) => (
              <Chip label={file.filename} key={index} 
              onDelete={() => handleDeleteSelectedFile(index)}/>
            ))}
          </div>
        )}  

      <Footer>
        <SendButton onClick={(e) => sendEmail(e)}>Send</SendButton>
        <ScheduleSendOutlined onClick={(e) => toggleCalendar(e)}></ScheduleSendOutlined>
        {calendarVisible && (
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            timeIntervals={1}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        )}
       

        <AttachFile onClick={(e) => openFilePicker(e)}></AttachFile>
       
        <DeleteOutline
          onClick={() => {
            setOpenDrawer(false);
            setData({});
            setSelectedFiles([])
          }}
        />
      </Footer>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        multiple
      />
    </Dialog>
  );
};

export default ComposeMail;