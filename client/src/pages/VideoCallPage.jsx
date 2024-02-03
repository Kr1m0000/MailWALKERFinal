import React, { useContext } from "react";
import { Header } from "../components/chats";
import { Box, styled } from "@mui/material";

import SideNavBar from "../components/emails/SideNavBar";
import Rejoindre from "../components/videoCall/Rejoindre";


const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const VideoCallPage = () => {


 


 


  return (
    <>
      <Header/>
      <Wrapper>
        {/* <SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/bin" /> */}
        <SideNavBar />
        <MainContent >
          <Rejoindre />
        </MainContent>
      </Wrapper>
    </>
  );
};

export default VideoCallPage;
