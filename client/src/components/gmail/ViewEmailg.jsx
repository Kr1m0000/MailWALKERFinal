import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Typography, styled } from "@mui/material";
import { useLocation } from "react-router-dom";
import { ArrowBack, Delete } from "@mui/icons-material";
import { emptyProfilePic } from "../constants/constant";
import axios from "axios";

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

const DateText = styled(Typography)({
  margin: "0 50px 0 auto",
  fontSize: 12,
  color: "#5E5E5E",
});

const ViewEmailg = ({ openDrawer }) => {
  const { state } = useLocation();
  const { email } = state;
  const [emailDetails, setEmailDetails] = useState(null);

  useEffect(() => {
    const fetchEmailDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/gmail/mail/read/mailwalker.testapi@gmail.com/${email.id}`
        );
        setEmailDetails(response.data);
      } catch (error) {
        console.error("Error fetching email details: ", error);
      }
    };

    fetchEmailDetails();
  }, [email.id]);

  return (
    <Box
      style={
        openDrawer
          ? { marginLeft: 200, width: "84%" }
          : { marginLeft: 16, width: "98%" }
      }
    >
      <IconWrapper>
        <ArrowBack
          fontSize="small"
          color="action"
          onClick={() => window.history.back()}
        />
        <Delete fontSize="small" color="action" style={{ marginLeft: 40 }} />
      </IconWrapper>
      {emailDetails ? (
        <>
          <Subject>
          
                {emailDetails.payload.headers.find(
                    (header) => header.name === "Subject"
                  )?.value || "N/A"} 
                  <Indicator component="span">{emailDetails.labelIds[0]}</Indicator>
          </Subject>
          <Box style={{ display: "flex" }}>
            <Image src={emptyProfilePic} alt="profile" />
            <Container>
              <Box>
                <Typography>
                  {emailDetails.payload.headers.find(
                    (header) => header.name === "From"
                  )?.value || "N/A"}
                  <Box component="span">
                    &nbsp;&#60;
                    {emailDetails.payload.headers.find(
                      (header) => header.name === "To"
                    )?.value || "N/A"}
                    &#62;
                  </Box>
                </Typography>
                <DateText>
                  {new Date(Number(emailDetails.internalDate)).getDate()}&nbsp;
                  {new Date(Number(emailDetails.internalDate)).toLocaleString(
                    "default",
                    { month: "long" }
                  )}
                  &nbsp;
                  {new Date(Number(emailDetails.internalDate)).getFullYear()}
                </DateText>
              </Box>
              
              <Typography
                variant="body1"
                style={{ width: "100%", whiteSpace: "pre-wrap" }}
              >
                  
                  <br/>
                  <br/>
                {email?.snippet ? `${email.snippet}  ` : "(no snippet)  "}
                
              </Typography>
            </Container>
          </Box>
        </>
      ) : (
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
      )}
    </Box>
  );
};

export default ViewEmailg;
