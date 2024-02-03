const axios = require('axios');
const { createConfig } = require('../utils/gmail.utils');
const nodemailer = require('nodemailer');
const CONSTANTS = require('../config/constants');
const { google } = require('googleapis');


require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(
  '42346626808-2ko2sds5hhljs721a04h0uk549vgta57.apps.googleusercontent.com',
  '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',
  'https://developers.google.com/oauthplayground',
);

oAuth2Client.setCredentials({ refresh_token: '1//04Ipi0TpPLnngCgYIARAAGAQSNwF-L9IrnGrCC5wCCPC-LCxwBeDO7-OTG4lXstQVHuYIN5qLRd6xUyl_1yL1b92f0pj7Bzq8-Tc' });

async function sendMail(req, res) {
    try {
        const { to, subject, text} = req.body;

        if (!to || !subject || !text ) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const accessToken = await oAuth2Client.getAccessToken();
        let token = await accessToken.token;

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                ...CONSTANTS.auth,
                accessToken: token,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            to: to,
            subject: subject,
            text: text,
            from: 'krimouking007@gmail.com',
        };

        const result = await transport.sendMail(mailOptions);
        res.send(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
}


async function getUser(req, res){
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/profile`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    }
    catch(error){
        console.log(error);
        res.send(error);        
    }
}

async function getMails(req, res) {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/threads?maxResults=100`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
}

async function getDrafts(req, res) {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/drafts`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        res.json(response.data);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
}

async function readMail(req, res) {
    try{
        const url = `https://gmail.googleapis.com/gmail/v1/users/${req.params.email}/messages/${req.params.messageId}`;
        const { token } = await oAuth2Client.getAccessToken();
        const config = createConfig(url, token);
        const response = await axios(config);
        
        let data = await response.data;
        res.json(data);
    }
    catch(error){
        console.log(error);
        res.send(error);
    }
}

module.exports = {
    getUser,
    getMails,
    getDrafts,
    readMail,
    sendMail
};