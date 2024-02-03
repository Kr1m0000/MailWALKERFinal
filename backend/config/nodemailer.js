const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'mailwalker.noreply@gmail.com',
        clientId: '472245683355-34u3sjqutb46mv5mujsqmk3piskh6d4k.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04abGlB4wN1PYCgYIARAAGAQSNwF-L9Ir5l597oFew6owJZEThTyUga_xy3DYu2RLXo4rLAqqPhAl8daOpb4nap3BvrCkQUt8-90',
        accessToken: 'ya29.a0AfB_byBWshqhkiofQ3fwxczR4gSGPYDMm30c79FhfDqQFCBhiQpjm6CjY1WASYqo_PWVkZ-cgOiBCRRXMNR6Ez37-GuiZPGPgVUzFfPSko_gkU9S40SY3_GJ4IGDhyeurrzr091DpQZoPJP5t7x9ZgP3CClakPQaAHjHaCgYKAeoSARMSFQHGX2MiOd-32-zWAp4f6nAXLv4pqA0171',
    },
});

module.exports = transporter;
