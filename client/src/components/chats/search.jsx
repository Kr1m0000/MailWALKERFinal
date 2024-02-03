import './style.css';
import { SelectedChatContext } from '../../context/ChatProvider'; 
import { UidContext } from "../AppContext";
import axios from 'axios';
import { useContext, useState } from 'react';






const UserList = ({ users, searchValue }) => {
    const uid = useContext(UidContext);
    const apiUrl = process.env.REACT_APP_API_URL;
    const [loadingChat, setLoadingChat] = useState(false);

    const { 
      setSelectedChat,
      user,
      chats,
      setChats, } = useContext(SelectedChatContext);


    const accessChat = async (userId) => {

      try {
        setLoadingChat(true);

      
        
        const { data } = await axios.post(
          `${apiUrl}api/chat/${uid}`,
           { userId }
        );

        if (!chats.find((c) => c._id === data._id)) {//
          setChats([data, ...chats]);
        }
        setSelectedChat(data);
        setLoadingChat(false);
      } catch (error) {
        console.error(error);
      }
    };

  const filteredUsers = users.filter(user => user.pseudo.startsWith(searchValue));
    console.log(searchValue)
  return (
  <div className="user-list">
    {(filteredUsers.length > 0 || searchValue === "@All") ? (
      (searchValue === "@All" ? users : filteredUsers)
        .filter(user => user._id !== uid) // Filter out user with the same ID as uid
        .map((user, index) => (
          <div className="user-box" key={user._id} onClick={() => accessChat(user._id)}>
            <img src={user.picture} alt="img" />
            <p className='pseudo'>{user.pseudo}</p>
            <p className='online'>
            {user.email}
            </p>     
          </div>
        ))
    ) : (
      <div className="aucun">
        <p>Aucun utilisateur ne correspond à ce pseudo</p>
      </div>
    )}
  </div>
);

};
export default UserList;