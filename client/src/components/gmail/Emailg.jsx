import React from "react";
import { ListItem, Checkbox, Typography, Box, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Wrapper = styled(ListItem)`
  padding: 0 0 0 10px;
  background: #f2f6fc;
  cursor: pointer;
  overflow: hidden;

  & > div {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }

  & > div > p {
    font-size: 14px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 5px;
  }
`;

const Emailg = ({ email, selectedEmails, setSelectedEmails }) => {
  const navigate = useNavigate();

  const handleChange = () => {
    if (selectedEmails.includes(email?._id)) {
      setSelectedEmails((prevState) =>
        prevState.filter((id) => id !== email?._id)
      );
    } else {
      setSelectedEmails((prevState) => [...prevState, email?._id]);
    }
  };

  return (
    <Wrapper>
      <Checkbox
        size="small"
        checked={selectedEmails.includes(email?._id)}
        onChange={handleChange}
      />
      <Box
        onClick={() =>
          navigate("/gmailapi/view", { state: { email } })
        } // Use object shorthand for { state: { email } }
      >
        <Typography>
          {email?.snippet
            ? `${email.snippet}  `
            : "(no snippet)  "}
          {email?.body?.length > 64
            ? email?.body?.substring(0, 64) + "..."
            : email?.body}
        </Typography>
      </Box>
    </Wrapper>
  );
};

export default Emailg;
