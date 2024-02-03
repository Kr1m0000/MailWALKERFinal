const OTPGenerator = require ('otp-generator');
const { Infobip, AuthType } = require('@infobip-api/sdk');
const UserModel =require('../models/user.model');


const sendSms = async (phoneNumber, otpCode) => {
  const infobipClient = new Infobip({
    baseUrl: process.env.INFOBIP_URL,
    apiKey: process.env.INFOBIP_KEY,
    authType: AuthType.ApiKey,
  });

  const message = `Your confirmation code is: ${otpCode}. Thank you for using MailWALKER.`;

  try {
    const infobipResponse = await infobipClient.channels.sms.send({
      type: 'text',
      messages: [{
        destinations: [{ to: phoneNumber }],
        from: 'MailWalker',
        text: message,
      }],
    });

    if (infobipResponse.status === 200) {
      console.log('Message sent successfully');
    } else {
      console.log('Message not sent');
    }
  } catch (error) {
    console.error(error);
  }
};

const generateAndSendOTP = async (user) => {
  const otpCode = OTPGenerator.generate(6, { upperCase: false, specialChars: false });
  user.otpCode = otpCode;
  user.otpCodeExpiration = Date.now() + 5 * 60 * 1000;
  await user.save();
  await sendSms(user.phoneNumber, otpCode);
};



module.exports = { generateAndSendOTP };
