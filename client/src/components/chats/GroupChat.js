import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { SelectedChatContext } from '../../context/ChatProvider'; 
import { UidContext } from "../AppContext";
import './style.css';




// Utilisation


const GroupChatModal = ({ children , isOpen, onClose }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

 

 const apiUrl = process.env.REACT_APP_API_URL;
 const { chats, setChats, user } = useContext(SelectedChatContext);

    const uid = useContext(UidContext);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
        alert("User already added");
       
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      
      const { data } = await axios.get(`${apiUrl}api/user?search=${query}`);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
        console.log(error);
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
        alert("Please enter a name and select users to create a chat");
      return;
    }

    try {
      
      const { data } = await axios.post(
        `${apiUrl}api/chat/group/${uid}`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        }
      );
      setChats([data, ...chats]);
      onClose();
      alert("Chat Created");
    } catch (error) {
      alert("Error creating chat");
    }
  };

  return (
   <>
<button onClick={isOpen}>{children}</button>

    {isOpen && (
    <div className="modala">
      <div className="modal-contenta">
        <h2 className="modal-headera">Create Group Chat</h2>
        <button className="modal-close-buttona" onClick={onClose}>Close</button>
        <div className="modal-bodya">
          <div className="form-controla">
            <input type="text" placeholder="Chat Name" onChange={(e) => setGroupChatName(e.target.value)} />
          </div>
          <div className="form-controla">
            <input type="text" placeholder="Add Users ex: Jugo,..." onChange={(e) => handleSearch(e.target.value)} />
          </div>
          {/* <div className="user-list-groupa">
            {selectedUsers.map((user) => (
              <div key={user._id} onClick={() => handleDelete(user)}>
                <p style={{marginLeft:"10px"}}>{user.pseudo}</p>
              </div>
            ))}
          </div> */}
          <div className="scrollable-content">
          {loading ? (
            <div>Loading...</div>
          ) : (
            searchResult
              ?.filter(user => user.pseudo.toLowerCase().startsWith(search.toLowerCase()))
              .slice(0, 5)
              .map((user) => (
                <div key={user._id} onClick={() => handleGroup(user)}>
                  <p style={{fontSize:"20px"}}>
                    {user.pseudo}
                    {selectedUsers.some(selectedUser => selectedUser._id === user._id) && <span className="selected-indicator"></span>}
                  </p>
                </div>
              ))
          )}
        </div>
        </div>
        <div className="modal-footera">
          <button onClick={handleSubmit}>Create Chat</button>
        </div>
      </div>
    </div>
    )}
  
</>
  );
};

export default GroupChatModal;