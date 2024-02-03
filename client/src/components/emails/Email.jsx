import React, { useState, useEffect, useContext } from 'react';
import { ListItem, Checkbox, Typography, Box, styled } from '@mui/material';
import { StarBorder, Star , EditOutlined, CancelScheduleSendOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import ComposeMail from './ComposeMail';
const Wrapper = styled(ListItem)`
    padding: 0 0 0 10px;
    background: #f2f6fc;
    cursor: pointer;
    overflow: hidden;

    & > div {
        display: flex;
        flex-wrap: wrap;  /* Added to wrap the content to the next line */
        width: 100%;
    }

    & > div > p {
        font-size: 14px;
        max-width: 100%;  /* Set maximum width for paragraphs */
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;  /* Add margin to separate lines */
    }
`;


const Indicator = styled(Typography)`
    font-size: 12px !important;
    background: #ddd;
    color: #222;
    border-radius: 4px;
    margin-right: 6px;
    padding: 0 4px;
`;

const DateText = styled(Typography)({
    marginLeft: 'auto',
    marginRight: 20,
    fontSize: 12,
    color: '#5F6368',
});


const Email = ({ uid, email, selectedEmails, setSelectedEmails, mailboxEndpoint }) => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [userEmail, setUserEmail] = useState('');
    const [isStarred, setIsStarred] = useState('');

    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const response = await axios.get(`${apiUrl}api/user/${uid}`);
                setUserEmail(response.data.email);
            } catch (error) {
                console.error('Error fetching user email:', error);
            }
        };

        fetchUserEmail();
    }, [uid, apiUrl]);
 
    let starred;
    useEffect(() => {   
      if (userEmail) {
        if (email.from==userEmail){     
            starred=email.folders[0].starred
        }
        if (email.to==userEmail){ 
            starred=email.folders[1].starred
        }
     }
      setIsStarred(starred)  
    },[userEmail] )
  
    const toggleStarredEmail = async (id) => {
        
        try {
            await axios.post(`${apiUrl}api/email/starredMail/${uid}`, { 
                emailId:id
            });         
        } catch (error) {
            console.error('Error :', error);
        }   
    }

    const handleStarClick = async () => { 
        setIsStarred(prevState => !prevState);
        await toggleStarredEmail(email); 
    };

    const handleChange = () => {
        if (selectedEmails.includes(email._id)) {
            setSelectedEmails(prevState => prevState.filter(id => id !== email._id));
        } else {
            setSelectedEmails(prevState => [...prevState, email._id]);
        }
    }

    const [draft,setdraft]=useState(false)
    const handleDraft= () => {
        setdraft(true);
    }
    const CancelClick = async () => { 
        alert("annuler l'envoi")
        try {
            await axios.post(`${apiUrl}api/email/cancelScheduled/${email._id}`, { 
            });         
        } catch (error) {
            console.error('Error :', error);
        }  
      };
    return (
       <Wrapper >
            <Checkbox size="small" checked={selectedEmails.includes(email._id)} onChange={handleChange} />
            {mailboxEndpoint=="api/email/drafts" && ( <EditOutlined fontSize='small' onClick={()=>{handleDraft()}} ></EditOutlined>)}
            {mailboxEndpoint=="api/email/snoozed" && (<CancelScheduleSendOutlined fontSize='medium' onClick={()=>{CancelClick()}} ></CancelScheduleSendOutlined>)}
{   mailboxEndpoint!=="api/email/bin" && 
                (isStarred ? 
                    <Star 
                        fontSize="small" 
                        style={{ color: 'orange', marginRight: 10 }}
                        onClick={()=>{handleStarClick()}} 
                    />
                : 
                    <StarBorder 
                        fontSize="small" 
                        style={{ marginRight: 10 }} 
                        onClick={()=>{handleStarClick()}}
                    /> )
            
}
            <Box
              onClick={() => navigate("/email/view", { state: { email: email , mailboxEndpoint:mailboxEndpoint} })}
            >
                <Typography style={{ width: 200 }}>{email.from.split('@')[0]}</Typography>

                <Typography>
                    {email.subject && <strong>{email.subject}</strong>}
                    {email.subject ? ' - ' : '(no subject) - '}
                    {(email.body.length > 64 ) ? email.body.substring(0, 64) + '...' : email.body}
                </Typography>

                <DateText>
                    {new window.Date(email.createdAt).getDate()}&nbsp;
                    {new window.Date(email.createdAt).toLocaleString('default', {
                        month: 'long',
                    })}
                </DateText>
            </Box>
          { draft==true && <ComposeMail open={draft} setOpenDrawer={setdraft} email={email} origine='draft'/>}
        </Wrapper>
    );
};

export default Email;
