import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';

const Page = () => {
  const [password, setPassword] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const useStyles = makeStyles((theme) => ({
    container: {
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    card: {
      maxWidth: 400,
      textAlign: 'center',
      margin: 'auto',
    },
    textField: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    button: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUnlock = () => {
    if (password === '09012024') {
      setShowMessage(true);
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Card className={classes.card}>
        <CardContent>
          {showMessage ? (
            <div>
              <Typography variant="h4">Dear Sunshine,</Typography>
              <Typography variant="h6" paragraph>
                I love you so much.
                Thank you for being my everything.
              </Typography>
              <Typography variant="h6">With all my love,</Typography>
              <Typography variant="h5">k</Typography>
            </div>
          ) : (
            <div>
              
              <TextField
                label="Enter Password"
                type="password"
                variant="outlined"
                className={classes.textField}
                value={password}
                onChange={handlePasswordChange}
              />
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={handleUnlock}
              >
                Unlock Love Message
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Page;
