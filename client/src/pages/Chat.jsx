import React, { useState, Suspense, useContext } from "react";
import { Header, SideBar } from "../components/chats";
import { Box, styled } from "@mui/material";
import {  Routes } from "react-router-dom";
import SuspenseLoader from "../components/chats/common/SuspenseLoader";
import SingleChat from '../components/chats/Chats'; 
import SideNavBar from "../components/emails/SideNavBar";

const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Chat = () => {
  const [openDrawer, setOpenDrawer] = useState(true);


  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />

      <Wrapper>
        <SideNavBar />
        <SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} />
        <MainContent>
          
          <Suspense fallback={<SuspenseLoader />}>
          <SingleChat/>
          </Suspense>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Chat;
