import React, { useEffect, useState, useContext, useCallback } from "react";
import { Box, List, Checkbox, CircularProgress, IconButton } from "@mui/material";
import RecyclingIcon from '@mui/icons-material/Recycling';

import Email from "./Email";
import {  DeleteOutline, Refresh } from "@mui/icons-material";
import { UidContext } from "../AppContext";
import axios from "axios";
import { EMPTY_TABS } from "../constants/constant";
import NoMails from "./common/NoMails";

const Emails = ({ openDrawer, mailboxEndpoint }) => {
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;
  const uid = useContext(UidContext);

  const fetchReceivedEmails = useCallback(async () => {
    try {
        const response = await axios.get(
            `${apiUrl}${mailboxEndpoint}/${uid}`
        );
        const EmailRecupere = response.data;
        EmailRecupere.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        console.log("Updated Email List:", EmailRecupere);

        setReceivedEmails(EmailRecupere);
        setLoading(false);
    } catch (error) {
        console.error(
            `Error fetching received emails from ${mailboxEndpoint}:`,
            error
        );
        // Handle error
        setLoading(false);
    }
}, [apiUrl, mailboxEndpoint, userEmail]);




  const refreshEmails = useCallback(() => {
    setLoading(true);
    setSelectedEmails([]);
    fetchReceivedEmails();
  }, [fetchReceivedEmails]);


  useEffect(() => {
    const fetchUserEmail = async () => {
        try {
            const response = await axios.get(`${apiUrl}api/user/${uid}`);
            setUserEmail(response.data.email);
        } catch (error) {
            console.error("Error fetching user email:", error);
        }
    };

    fetchUserEmail();
    fetchReceivedEmails();
}, [uid, apiUrl, fetchReceivedEmails]);  // Include fetchReceivedEmails in the dependency array


  const selectAllEmails = (e) => {
    if (e.target.checked) {
      const allEmailIds = receivedEmails.map((email) => email._id);
      setSelectedEmails(allEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const deleteSelectedEmails = async () => {
    try {
        await axios.post(`${apiUrl}api/email/bin/${uid}`, {
            emailIdToDrop: selectedEmails,
        });

        const response = await axios.get(`${apiUrl}${mailboxEndpoint}/${uid}`);
        console.log("Updated Email List:", response.data);
     //  fetchReceivedEmails();
      // setSelectedEmails([]);

        refreshEmails();
        
        
    } catch (error) {
        console.error("Error moving/deleting selected emails:", error);
    };
  }

  const recycleSelectedEmails = async () => {
    try {
      await axios.post(`${apiUrl}api/email/undoDelete/${uid}`, { 
       emailInBin:selectedEmails
    });
     refreshEmails();
    } catch (error) {
      console.error("Error moving/deleting selected emails:", error);
    }
  };

  return loading ? (
    <CircularProgress
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  ) : (
    <Box
      style={
        openDrawer
          ? { marginLeft: 200, width: "84%" }
          : { marginLeft: 16, width: "98%" }
      }
    >
      <Box
        style={{
          padding: "20px 10px 0px 10px",
          display: "flex",
          alignItems: "center",
        }}
      > 
       <Checkbox size="small" onChange={selectAllEmails} />
       {
       mailboxEndpoint=="api/email/bin" && (
        <IconButton onClick={recycleSelectedEmails} color="black"  >
        <RecyclingIcon />
        </IconButton>
       )
       }
        <IconButton onClick={deleteSelectedEmails} color="black">
        <DeleteOutline />
        </IconButton>

        <IconButton onClick={refreshEmails} color="black">
          <Refresh />
        </IconButton>
      </Box>
      <List style={{ maxHeight: "500px", overflowY: "auto" }}>
        {receivedEmails.map((email) => (
          <Email
            uid={uid}
            email={email}
            key={email._id}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
            mailboxEndpoint={mailboxEndpoint}

          />
        ))}
      </List>
      {receivedEmails.length === 0 && (
        <NoMails message={EMPTY_TABS[mailboxEndpoint]} />
      )}
    </Box>
  );
};

export default Emails;
