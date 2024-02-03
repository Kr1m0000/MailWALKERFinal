import React, { useEffect, useState } from 'react';
import Routes from './components/routes';
import { UidContext } from './components/AppContext';
import axios from 'axios';
// import "./App.css";
import { SelectedChatProvider } from './context/ChatProvider';

const App = () => {
  const [uid, setUid]= useState(null);

  useEffect(()=> {
    const fetchToken = async () => {
      await axios({
      method: 'get',
      url: `${process.env.REACT_APP_API_URL}jwtid`,
      withCredentials: true, 
    })
    .then((res) => {
      console.log(res);
      setUid(res.data);
      })
    .catch((err) => console.log("no token"))
  };
  fetchToken();
}, [uid]);

  return (
    <UidContext.Provider value={uid}>
       <SelectedChatProvider> 
            <Routes/>
        </SelectedChatProvider>
    </UidContext.Provider>
  );
};

export default App;