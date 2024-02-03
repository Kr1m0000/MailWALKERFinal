import './style.css';
import { SelectedChatContext } from '../../context/ChatProvider'; 
import { UidContext } from "../AppContext";
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import axios from 'axios';
import { useContext, useState, useEffect } from 'react';
import { Box} from "@mui/material";
import { GoX } from "react-icons/go";
import React from 'react';




const ChatFiles = ({ children , isOpen, onClose }) => {
const [chatBackgroundColor, setChatBackgroundColor] = useState('#fde7c6'); // Définit la couleur initiale du fond du chat sur blanc


    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [messages, setMessages] = useState([]); 
    const apiUrl = process.env.REACT_APP_API_URL;
    const uid = useContext(UidContext);

    const { 
      selectedChat,
      user,
      chats,
      setChats, } = useContext(SelectedChatContext);


        const fetchfiles = async () => {

            if (!selectedChat) { //Si aucun chat n'est sélectionné, la fonction se termine immédiatement.
            return;
            }

            try {

            

            const { data } = await axios.get( //envoie une requête GET à l'API pour récupérer les messages du chat sélectionné.
                //data contient la réponse du serveur à la requête GET  
                `${apiUrl}api/message/${selectedChat._id}/files`,
                
            );

            setMessages(data);
            

            } catch (error) { 
            console.log(error);

            }
        };

  useEffect(() => {
    fetchfiles();
  }, [selectedChat]); // Exécute fetchfiles chaque fois que selectedChat change


    



    function getFileType(file) {
    const extension = file.split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'JPG':
      case 'JPEG':
      case 'PNG':
      case 'GIF':
         return 'image';
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
      case 'ppt':
      case 'pptx':
      case 'xls':
      case 'xlsx':
      case 'csv':
      case 'py':
      case 'js':
      case 'html':
      case 'css':
      case 'odp':
        return 'document';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'flv':
        return 'video';
      case 'mp3':
        return 'audio';
      default:
        return 'unknown';
    }
  }

  const [isOpenn, setIsOpen] = useState(false);

    return (
<>
  <span onClick={() => setIsOpen(!isOpen)}>{children}</span>
  {isOpen && (
    <div className="drawer">
      <div className="drawer-overlay">
        <div className="drawer-content">
          <div className="drawer-header">Multimedia</div>
          <div className="modal-close-button-files">
            <GoX className="close-icon" style={{ fontSize: '2em' }} onClick={onClose} />
          </div>
          <div className="drawer-header"><ImageSearchIcon/></div>

          <div className="boxfiles">
            <Box
              display="grid"
              gridTemplateColumns="repeat(1, 1fr)"
              gridAutoRows="150px"
              gap={2}
              w="100%"
              h="100%"
              bg="#4E4F50"
              color={"white"}
            >
              {messages.filter(m => ['image', 'video'].includes(getFileType(m.file))).map((m, index) => {
                let fileUrl = '';
                if (m.file) {
                  fileUrl = `${apiUrl}${m.file.replace(/\\/g, '/')}`;
                }
                return (
                  getFileType(m.file) === 'image' ? (
                    <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                      <img src={fileUrl} alt="Message content" style={{ width: '100%', height: '100%' }} />
                    </a>
                  ) : getFileType(m.file) === 'video' ? (
                    <video style={{ width: '100%', height: '100%' }} controls>
                      <source src={fileUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : null
                );
              })}
            </Box>
          </div>

          <div className="drawer-header"><PlagiarismIcon/></div>

          <div className="boxfiles">
           <p
            display="grid"
            gridTemplateColumns="1fr"
            gridAutoRows="150px"
            gap={2}
            w="100%"
            h="100%"
            bg="#4E4F50"
            color={"white"}
          >
            {messages.filter(m => getFileType(m.file) === 'document').map((m, index) => {
              let fileUrl = '';
              let fileName = '';
              if (m.file) {
                fileUrl = `${apiUrl}${m.file.replace(/\\/g, '/')}`;
                fileName = m.file.split('\\').pop();
              }
              return (
                <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer">
                  <p>{fileName.split('.')[0].substring(0, 10)}.{fileName.split('.')[1]}</p>
                </a>
              );
            })}
          </p>
          </div>
            
         

          <div className="drawer-header">
            {selectedChat.isGroupChat ? ' membres du groupe' : null}
            <p className="user-list-membres">
              {selectedChat.isGroupChat ? selectedChat.users.map((u) => u.pseudo).join(', ') : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
</>
    );
};

export default ChatFiles;