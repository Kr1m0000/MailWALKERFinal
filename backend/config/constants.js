require('dotenv').config();

const auth = {
    type: 'OAuth2',
    user: 'mailwalker.testapi@gmail.com',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
};

const mailOptions = {    
    to: 'abdelkrim.tiza@fgei.ummto.dz',
    from: 'krimouking007@gmail.com',
    subject: 'Gmail API using Node JS lesgooo',
};

module.exports = {
    auth,
    mailOptions
};
