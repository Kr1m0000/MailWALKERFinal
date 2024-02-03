import React, { useState, Suspense, useContext } from "react";
import { SideBar } from "../components/emails";
import { Header } from "../components/chats";
import { Box, styled } from "@mui/material";
import { Route, Routes, Navigate } from "react-router-dom";
import SuspenseLoader from "../components/emails/common/SuspenseLoader";
import Emails from "../components/emails/Emails";
import SideNavBar from "../components/emails/SideNavBar";
import ViewEmail from "../components/emails/ViewEmail";

const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 1;
  overflow: hidden;
`;

const Main = () => {
  const [openDrawer, setOpenDrawer] = useState(true);


  const toggleDrawer = () => {
    setOpenDrawer((prevState) => !prevState);
  };

  return (
    <>
      <Header toggleDrawer={toggleDrawer} />
      

      <Wrapper>
        <SideNavBar />
        <Routes>
                <Route path="/view" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/view" />} />
                <Route path="/bin" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/bin" />} />
                 <Route path="/inbox" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/inbox" />} /> 
                 <Route path="/sent" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/sent" />} />
                 <Route path="/starred" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/starred" />} />
                 <Route path="/drafts" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/drafts" />} />
                 <Route path="/snoozed" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/snoozed" />} />
                 <Route path="/spam" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/spam" />} />
                 <Route path="/allmail" element={<SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} mailboxEndpoint="api/email/allmail" />} />
                 <Route
                index // This makes this route the default child route
                element={<Navigate to="inbox" replace />} // Redirect to /email/inbox
              />
        </Routes>
        <MainContent>
          <Suspense fallback={<SuspenseLoader />}>
            <Routes>
                <Route path="/view" element={<ViewEmail openDrawer={openDrawer} mailboxEndpoint="api/email/view" />} />
                <Route path="/bin" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/bin" />} />
                <Route path="/inbox" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/inbox" />} />
                <Route path="/sent" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/sent" />} />
                <Route path="/starred" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/starred" />} />
                <Route path="/drafts" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/drafts" />} />
                <Route path="/snoozed" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/snoozed" />} />
                <Route path="/spam" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/spam" />} />
                <Route path="/allmail" element={<Emails openDrawer={openDrawer} mailboxEndpoint="api/email/allmail" />} />
                <Route
                index // This makes this route the default child route
                element={<Navigate to="inbox" replace />} // Redirect to /email/inbox
              />
            </Routes>
          </Suspense>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Main;
