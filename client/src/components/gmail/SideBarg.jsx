
import { Drawer, styled } from "@mui/material";
import SideBarContentg from "./SideBarContentg";

const StyledDrawer = styled(Drawer)`
    margin-top: 54px;
`

const SideBarg = ({ toggleDrawer, openDrawer }) => {

    return (
        <StyledDrawer
            anchor='left'
            open={openDrawer}
            onClose={toggleDrawer}
            hideBackdrop={true}
            ModalProps={{
                keepMounted: true,
            }}
            variant="persistent"
            sx={{
                '& .MuiDrawer-paper': { 
                    width: 200,
                    marginLeft:8,
                    borderRight: 'none',
                    background: '#f5F5F5',
                    marginTop: '64px',
                    height: 'calc(100vh - 64px)'
                },
            }}
          >
            <SideBarContentg  />
            <br/>
            <br/>
            
        <p className="primary-subheading" style={{padding:'15px', fontSize:'15px', color:'black', textAlign:'center', backgroundColor:'orange'}} >MailWALKER integrates the Gmail API for sending and viewing emails as a beta function. Currently labeled as a test-API and pending Google validation. </p>
        </StyledDrawer>
    )
}

export default SideBarg;