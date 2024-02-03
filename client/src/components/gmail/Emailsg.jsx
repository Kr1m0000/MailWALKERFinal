import React, { useState, useEffect} from "react";
import {
  Box,
  List,
  Checkbox,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DeleteOutline, Refresh } from "@mui/icons-material";
import axios from "axios";
import Emailg from "./Emailg";

const Emailsg = ({ openDrawer }) => {
  const [receivedEmails, setReceivedEmails] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchReceivedEmails = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}api/gmail/mail/list/mailwalker.testapi@gmail.com`
      );
      setReceivedEmails(response.data.threads);
      setLoading(false);
      console.log(response.data.threads);
    } catch (error) {
      console.error(`Error fetching received Gmail emails: `, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivedEmails(); // Call the function directly when the component renders
  }, [apiUrl]);

  const selectAllEmails = (e) => {
    if (e.target.checked) {
      const allEmailIds = receivedEmails.map((email) => email.id);
      setSelectedEmails(allEmailIds);
    } else {
      setSelectedEmails([]);
    }
  };

  const refreshEmails = () => {
    setLoading(true);
    fetchReceivedEmails();
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
        <DeleteOutline />
        <IconButton onClick={refreshEmails} color="black">
          <Refresh />
        </IconButton>
        <p className="primary-subheading" style={{paddingLeft: '60px'}}>This is a Gmail API test with the address: mailwalker.testApi@gmail.com</p>
      </Box>
      <List style={{ maxHeight: "500px", overflowY: "auto" }}>
        {receivedEmails.map((email) => (
          <Emailg
            key={email.id}
            email={email}
            selectedEmails={selectedEmails}
            setSelectedEmails={setSelectedEmails}
          />
        ))}
      </List>
    </Box>
  );
};

export default Emailsg;
