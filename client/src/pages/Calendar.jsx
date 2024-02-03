import React, { Suspense, useContext } from "react";
import { Header } from "../components/chats";
import { Box, styled } from "@mui/material";
// import { Outlet, Route, Routes } from "react-router-dom";
import SuspenseLoader from "../components/chats/common/SuspenseLoader";

import SideNavBar from "../components/emails/SideNavBar";
import MyCalendar from "../components/calendar/calendar";

const Wrapper = styled(Box)`
  display: flex;
  position: relative;
  width: 100%;
`;

const MainContent = styled(Box)`
  flex: 2;
  overflow: hidden;
`;

const Calendar = (props) => {
  return (
    <>
      <Header />

      <Wrapper>
        <SideNavBar />
        {/* <SideBar toggleDrawer={toggleDrawer} openDrawer={openDrawer} /> */}
        <MainContent>
          <Suspense fallback={<SuspenseLoader />}>
            <MyCalendar
              style={{
                
              
                marginLeft: "50px",
                marginTop: "100px",
                alignItems: "center",
              }}
            />
          </Suspense>
        </MainContent>
      </Wrapper>
    </>
  );
};

export default Calendar;
