const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'mailwalker.noreply@gmail.com',
        clientId: '472245683355-34u3sjqutb46mv5mujsqmk3piskh6d4k.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04oqOzHZSR_qxCgYIARAAGAQSNwF-L9IrNBXK6u538DWutUd8mVG21SLTFuXXYXx3Ik44N5WvGRvP3sMBrNAOlxWjtl4eMEuoV1U',
        accessToken: 'ya29.a0AfB_byD4On7YQv1G3i_s5Bzh9SLJI65k2mDkBrEirfRXSLX030bhj1jFmYQhXcGgHemzUT5o7YAFb1YCQO7QEnO6T3pOgosw4CN2SzEk558YBSH5d0hjsPUQkt8601nsUM-zS94U3y2ow3u0NuNd_vNjTPD-pW8Qe7zoaCgYKAaMSARMSFQHGX2MivyawES40dJxnbI_iJINxDA0171',
    },
});

module.exports = transporter;
