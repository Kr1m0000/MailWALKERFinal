import React, { useContext } from 'react';

import { UidContext } from '../components/AppContext';
import Navbar from  '../components/navbar'


const Home = () => {
  const uid = useContext(UidContext);



  return (
    <>
    
      <div>
        <Navbar/>
       
      </div>
    
    </>
    
    
    
  );
};

export default Home;