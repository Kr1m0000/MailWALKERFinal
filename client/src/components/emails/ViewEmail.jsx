import React, { useState, useEffect, useContext } from "react";
import { Box, Typography, styled, Button } from "@mui/material";
import { EditOutlined } from "@mui/icons-material";
import {  useLocation } from "react-router-dom";
import { emptyProfilePic } from "../constants/constant";
import {  ArrowBack,  Delete,  Reply as ReplyIcon,  ShortcutOutlined as ShortcutOutlinedIcon,  TurnRightOutlined as TurnRightOutlinedIcon,  TurnLeftOutlined as TurnLeftOutlinedIcon} from "@mui/icons-material";
import ComposeMail from "./ComposeMail";
import axios from "axios";
import { UidContext } from "../AppContext";
import Chip from '@mui/material/Chip'; 
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';


const IconWrapper = styled(Box)({
  padding: 15,
});

const Subject = styled(Typography)({
  fontSize: 22,
  margin: "10px 0 20px 75px",
  display: "flex",
});

const Indicator = styled(Box)`
  font-size: 12px !important;
  background: #ddd;
  color: #222;
  border-radius: 4px;
  margin-left: 6px;
  padding: 2px 4px;
  align-self: center;
`;

const Image = styled("img")({
  borderRadius: "50%",
  width: 40,
  height: 40,
  margin: "5px 10px 0 10px",
  backgroundColor: "#cccccc",
});

const Container = styled(Box)({
  marginLeft: 15,
  width: "100%",
  "& > div": {
    display: "flex",
    "& > p > span": {
      fontSize: 12,
      color: "#5E5E5E",
    },
  },
});

const Date = styled(Typography)({
  margin: "0 50px 0 auto",
  fontSize: 12,
  color: "#5E5E5E",
});

const isImage = (filename) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|svg)$/i;
  return imageExtensions.test(filename);
};

const buttonStyle = {
  borderRadius: "12px",
  backgroundColor: "transparent",
  borderColor: "grey",
  color: "black", // Couleur du texte
  textTransform: "none",
  margin: "0 8px",
  marginTop: "50px",
  marginLeft: "13%",
  marginBottom: "5%",
};

const ViewEmail = (openDrawer) => {
  const [reply, setReply] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const { state } = useLocation();
  const { email, mailboxEndpoint } = state;
  const apiUrl = process.env.REACT_APP_API_URL;
  const [emailRecupere, setemailRecupere] = useState([]);
  const [draft, setdraft] = useState(false);
  const [charge, setcharge] = useState(false);
  const emailBoxes = [];
  const uid = useContext(UidContext);
  let taille;

  const handleReply = async () => {
    setReply(true);
  };
  const handleTransfer = async () => {
    setTransfer(true);
  };

  const handleDraft = () => {
    setdraft(true);
  };

  const handleDownloadAttachment = async (emailId, attachmentId, filename) => {
    try {
        // Demande au serveur de récupérer la pièce jointe sous forme de blob
        const response = await axios.get(`${apiUrl}api/email/serveAttachment/${filename}`, {
            responseType: 'blob',
        });
        // Crée un objet Blob avec les données de la réponse
        const blob = new Blob([response.data]);

        // Crée un lien pour télécharger la pièce jointe
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        // Ajoute le lien au document et déclenche le téléchargement
        document.body.appendChild(link);
        link.click();

        // Nettoie le lien du document
        document.body.removeChild(link);

    } catch (error) {
        console.error('Erreur lors du téléchargement de la pièce jointe', error);
    }
};

  const deleteSelectedEmails = async () => {
    try {
      window.history.back();
      await axios.post(`${apiUrl}api/email/bin/${uid}`, {
        emailIdToDrop: [email._id],
      });
    } catch (error) {
      console.error("Error moving/deleting selected emails:", error);
    }
  };

  async function chargementdemail(id) {
    if (id != null) {
      let emails = [];
      const response = await axios.post(
        `${apiUrl}api/email/gethistorique/${id}`
      );
      if (response.data) {
        response.data.unshift(email);
      }
      emails = response.data;
      setemailRecupere(emails);
    }
  }

  if (email.idLastEmail && charge != true) {
    chargementdemail(email.idLastEmail);
    setcharge(true);
  }

  if (emailRecupere.length == 0) {
    taille = 1;
  } else {
    taille = emailRecupere.length;
  }
  
    for (let i = 0; i < taille; i++) {
      let emailData;
      if (emailRecupere.length == 0) {
        //alert('ici')
        emailData = email;
      } else {
        emailData = emailRecupere[i];
      }
      emailBoxes.push(
        <Box
          key={i}
          style={
            openDrawer 
              ? { marginLeft: 200, width: "84%"}
              : { marginLeft: 16, width: "98%" }
          }
        >
          {i === 0 && (
            <IconWrapper style={{backgroundColor:'white'}}>
              <Button style={{ color: "black" }}>
                <ArrowBack
                  fontSize="large"
                  color="black"
                  onClick={() => window.history.back()}
                />
              </Button>
              <Button style={{ color: "black" }}>
                <Delete
                  fontSize="large"
                  color="black"
                  onClick={deleteSelectedEmails}
                />
              </Button>
              <Button style={{color: 'black'}}>
                {mailboxEndpoint == "api/email/drafts" && (
                <EditOutlined
                  fontSize="large"
                  onClick={() => {handleDraft();}}></EditOutlined>)}
              </Button>
              
            </IconWrapper>
          )}
          <Box style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Subject>
            {emailData.subject} <Indicator component="span">Inbox</Indicator>
          </Subject>
          <Box style={{ display: "flex" }}>
            <Image src={emptyProfilePic} alt="profile" />
            <Container>
              <Box>
                <Typography>
                  {email.from.split("@")[0]}
                  <Box component="span">&nbsp;&#60;{emailData.from}&#62;</Box>
                </Typography>
                <Date>
                  {new window.Date(email.createdAt).getDate()}&nbsp;
                  {new window.Date(email.createdAt).toLocaleString("default", {
                    month: "long",})}&nbsp;
                  {new window.Date(email.createdAt).getFullYear()}
                </Date>
              </Box>
              <Typography
                variant="body1"
                style={{ width: "90%", whiteSpace: "pre-wrap" }}
              >
                <br/><br/>
                {emailData.body}
              </Typography>
                    <br /> <br /> 
                    <div>
    {email.fichiers.map((attachment, index) => (
        <div key={index} style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            {isImage(attachment.filename) ? (
                <img
                    src={`${apiUrl}uploads/${attachment.filename}`}
                    alt={attachment.filename}
                    style={{
                        maxHeight: '200px',
                        marginRight: '8px',
                        border: '3px solid #111',
                        borderRadius: '20px',
                        transition: 'filter 0.3s ease',
                    }}
                    onMouseOver={(e) => (e.target.style.filter = 'blur(2.5px)')}
                    onMouseOut={(e) => (e.target.style.filter = 'blur(0)')}
                    onClick={() => handleDownloadAttachment(email._id, attachment._id, attachment.filename)}
                />
            ) : (
                <Chip
                    label={attachment.filename}
                    onClick={() => handleDownloadAttachment(email._id, attachment._id, attachment.filename)}
                    avatar={<CloudDownloadIcon style={{ cursor: 'pointer', color: '#3f51b5' }} />}
                    style={{ marginRight: '8px' }}
                />
            )}
        </div>
    ))}
</div>
            </Container>
          </Box>

          {mailboxEndpoint !== "api/email/drafts" &&
            mailboxEndpoint !== "api/email/bin" &&
            mailboxEndpoint !== "api/email/snoozed" &&
            mailboxEndpoint !== "api/email/spam" &&
            i === 0 && (
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  style={buttonStyle}
                  onClick={handleReply}
                  endIcon={<TurnLeftOutlinedIcon />}
                >
                  {" "}
                  Reply{" "}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={buttonStyle}
                  onClick={handleTransfer}
                  startIcon={<TurnRightOutlinedIcon />}
                >
                  {" "}
                  Transfer
                </Button>
              </div>
            )}
          {reply === true && (<ComposeMail open={true} setOpenDrawer={setReply} email={email} origine="reply"/>)}
          {transfer === true && ( <ComposeMail open={transfer} setOpenDrawer={setTransfer} email={email} origine="transfer" />)}
          {draft === true && (<ComposeMail open={draft} setOpenDrawer={setdraft} email={email} origine="draft" /> )}
     
          </Box>
         
        </Box>
      );
    }

return emailBoxes;

};

export default ViewEmail;