import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UidContext } from '../components/AppContext';



export const SelectedChatContext = React.createContext();


export function SelectedChatProvider({ children }) {
  const uid = useContext(UidContext);
  const apiUrl = process.env.REACT_APP_API_URL;


  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // Initialisez user à null

  // Lorsque le composant est monté, récupérez les informations de l'utilisateur du localStorage
useEffect(() => {
  const fetchUserPseudo = async () => {
    if (uid) {
      try {
        const response = await axios.get(`${apiUrl}api/user/${uid}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.error('User ID is null');
    }
  };
  
    fetchUserPseudo();
  
}, [uid]); 

  return (
    <SelectedChatContext.Provider value={{ selectedChat, setSelectedChat, chats, setChats, loading, setLoading , user, setUser, notification, setNotification}}>
      {children}
    </SelectedChatContext.Provider>
  );
}