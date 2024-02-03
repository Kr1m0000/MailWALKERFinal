import { Drawer, styled } from "@mui/material";
import React, { useEffect, useState, useContext, useCallback } from "react";
import { UidContext } from "../AppContext";
import axios from 'axios';
import { Box, Stack,} from "@mui/material";
import { getSender } from "../../config/ChatLogics";
import SuspenseLoader from "./common/SuspenseLoader";
import { Suspense } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import msggImage from './msgg.png';
import DeleteIcon from '@mui/icons-material/Delete';
import { SelectedChatContext } from '../../context/ChatProvider'; 
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import CreateGroupForm from "./GroupChat";
import GroupChatModal from "./GroupChat";
import io from "socket.io-client";
var  socket, selectedChatCompare;









const StyledDrawer = styled(Drawer)`
    margin-top: 54px;
    
`

const SideBar = ({ toggleDrawer, openDrawer}) => {
      const [isOpen, setIsOpen] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;
    const [loggedUser, setLoggedUser] = useState();//crée un état loggedUser avec une valeur initiale non définie. setLoggedUser est la fonction qui sera utilisée pour mettre à jour cet état
        const [socketConnected, setSocketConnected] = useState(false);

    const uid = useContext(UidContext);

    const { selectedChat, setSelectedChat, chats, setChats, loading, setLoading, user } = useContext(SelectedChatContext);
    const [userId, setUserId] = useState('');

    const [chatName, setChatName] = useState('');


      const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    };


    const fetchChats = useCallback(async () => {
          setLoading(true);

        if (!uid) { 
            console.error("UID is not defined");
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}api/chat/${uid}`);
            setChats(response.data);
            
            setLoading(false);

            
        } catch (error) {
            console.error("Error fetching chats jugoooo:", error);
        }
    }, [uid, apiUrl]); 



useEffect(() => {
  fetchChats(); 
  selectedChatCompare = selectedChat;
}, [selectedChat, uid, fetchChats]);


   
    return (
        <StyledDrawer
            anchor='left'
            open={openDrawer}
            onClose={toggleDrawer}
            hideBackdrop={true}
            ModalProps={{
                keepMounted: true,
            }}
            variant="persistent"
            sx={{
                '& .MuiDrawer-paper': { 
                    
                           position: 'fixed',
        bottom: '62px',
        width: 300,
        marginLeft:8,
        borderRight: 'none',
        background: '#f5F5F5',
        marginTop: '62px',
        height: 'calc(100vh - 64px)',
        fontSize: '12px',


                
                
                },
            }}
        >
            <Box
                pb={2}
                px={2}
                fontSize="20px"
                fontFamily="Work sans "
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
            
                
            <div style={{marginLeft:'20px', marginTop:'12px'}}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClick}
        sx={{
          borderRadius: "8px", // Adjust the border radius as needed
          padding: "10px 20px", // Adjust the padding as needed
          fontSize: "16px", // Adjust the font size as needed
        }}
      >
        Create Group Chat
      </Button>

      {isOpen && <GroupChatModal isOpen={isOpen} onClose={handleClose} />}
    </div>
                            
            </Box>
            <Box sx={{ width: 300, height: '100%', overflow: 'auto' }}>
                <Stack direction="column" spacing={2}  >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                            <SuspenseLoader />
                        </div>
                    ) : (
                        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}><SuspenseLoader /></div>}>
                            {chats.length === 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                                    <img src={msggImage} style={{ width: '100px', height: '100px' }} />
                                    No chats!
                                </div>
                            ) : (
                        chats.map((chat) => (
                            <div 
                                key={chat._id} 
                            style={{ 
                            border: '2px solid black', 
                            padding: '8px', 
                            margin: '8px', 
                            borderRadius: '15px' , 
                            backgroundColor: selectedChat?._id === chat._id ? '#b1b1b1' : '#f5f5f5'
                            }}


                                onClick={() => setSelectedChat(chat) }
                                 
                            >
                                <div className="chat">
                                    <div className="chat__details">
                                        <div className="chat__name">
                                            {chat.latestMessage && chat.latestMessage.file ? (
                                                chat.latestMessage.file.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                                    <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />

                                                        {chat.latestMessage.sender._id === uid 
                                                        ? chat.isGroupChat 
                                                            ? `Vous avez envoyé une photo dans le groupe : ${chat.chatName}`
                                                            : `Vous avez envoyé une photo à : ${chat.users.find(user => user._id !== uid).pseudo}`
                                                            : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une photo`}
                                                            </div>}
                                                    </span>                    
                                                ) : (
                                                    <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />

                                                        {chat.latestMessage.sender._id === uid 
                                                        ? chat.isGroupChat 
                                                            ? `Vous avez envoyé un document dans le groupe : ${chat.chatName}`
                                                            : `Vous avez envoyé un document à : ${chat.users.find(user => user._id !== uid).pseudo}`
                                                            : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé un document`}
                                                            </div>}
                                                    </span> 
                                                )
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('data:audio') ? (
                                                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                           
                                                 <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                            


                                                    { chat.latestMessage.sender._id === uid 
                                                        ? chat.isGroupChat 
                                                            ? `Vous avez envoyé un audio dans le groupe : ${chat.chatName}`
                                                            : `Vous avez envoyé un audio à : ${chat.users.find(user => user._id !== uid).pseudo}`
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé un audio`}
                                                          </div>}
                                                </span> 
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('data:video') ? (
                                                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                        <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />

                                                    {chat.latestMessage.sender._id === uid 
                                                    ? chat.isGroupChat 
                                                        ? `Vous avez envoyé une video dans le groupe : ${chat.chatName}`
                                                        : `Vous avez envoyé une video à : ${chat.users.find(user => user._id !== uid).pseudo}`
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une video`}
                                                            </div>}
                                                </span> 
                                            ) : chat.latestMessage && chat.latestMessage.content.startsWith('http') ? (
                                                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    {chat.latestMessage.sender._id === uid 
                                                    ? chat.isGroupChat 
                                                        ? `Vous avez envoyé un lien dans le groupe : ${chat.name}`
                                                        : `Vous avez envoyé un lien à : ${chat.users.find(user => user._id !== uid).pseudo}`
                                                        : <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <img src={chat.latestMessage.sender.picture} style={{ width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                                {`${chat.latestMessage.sender.pseudo} : vous a envoyé une video`}
                                                            </div>}
                                                </span> 
                                            ) : chat.latestMessage ? (
                                                chat.isGroupChat ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                                    <p style={{fontFamily:"georgia"}}>{chat.chatName}</p>
                                                    <div style={{ position: 'relative', width: '30px', height: '30px', alignSelf: 'center' , marginBottom:"10px" }}>
                                                       {chat.users.slice(0, 3).map((user, index) => (
                                                            <img 
                                                                key={user._id}
                                                                src={user.picture} 
                                                                alt="User avatar"
                                                                style={{ 
                                                                borderRadius: '100%', 
                                                                width: '30px', 
                                                                height: '30px', 
                                                                position: 'absolute', 
                                                                top: `${index * 5}px`, 
                                                                left: `${index * 5}px`
                                                                }}
                                                            />
                                                            ))}
                                                    </div>
                                                    <p>
                                                        {chat.latestMessage.sender._id === uid 
                                                        ? "Vous"
                                                        : chat.latestMessage.sender.pseudo} 
                                                        : {chat.latestMessage.content.length > 50 
                                                        ? chat.latestMessage.content.substring(0, 35) + "..." 
                                                        : chat.latestMessage.content}
                                                    </p>
                                                    </div>
                                                    ) : (
                                                    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                        <p style={{fontFamily:"georgia"}} >{chat.users.find(user => user._id !== uid).pseudo}</p>
                                                        <img src={chat.users.find(user => user._id !== uid).picture} style={{width: '30px', height: '30px', marginRight: '5px', borderRadius:"100%" }} />
                                                        {chat.latestMessage.sender._id === uid 
                                                        ? "Vous"
                                                        : chat.latestMessage.sender.pseudo} 
                                                        : {chat.latestMessage.content.length > 50 
                                                        ? chat.latestMessage.content.substring(0, 35) + "..." 
                                                        : chat.latestMessage.content}
                                                    </span>
                                                    )
                                            ) : (
                                                <span style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                                                {chat.isGroupChat 
                                                    ? <>Démarrer une conversation avec : <p style={{fontFamily:"georgia"}}>{chat.chatName}</p></>
                                                    : <>Démarrer une conversation avec : <p style={{fontFamily:"georgia"}}>{chat.users.find(user => user._id !== uid).pseudo}</p></> }
                                                </span>
                                            )}
                                            
                                        </div>
                                    </div>
                                </div>

                                {/* <DeleteIcon  onClick={() => deleteChat()} selectedChat /> */}
                            </div>
                            
                            
                            ))
                            )}
                        
                        </Suspense>
                        
                        
                        )}

                </Stack>

            </Box>
        </StyledDrawer>
     
    )

}


export default SideBar;