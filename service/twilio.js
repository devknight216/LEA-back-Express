// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const verificationSid = process.env.TWILIO_VERIFICATION_SID;
const client = require('twilio')(accountSid, authToken);

const sendSMS = (body, to) => {   
    client.messages
        .create({
            body,
            from: phoneNumber,
            to
        })
        .then(message => console.log(message.sid))
        .catch(err => console.log(err));
}

const sendCode = (to) => {
    client.verify.services(verificationSid)
                 .verifications
                 .create({to, channel: 'sms'})
                 .then(verification => res.status(200).json({message: verification.status}))
                 .catch(err => res.json({message: err}));
}

const checkCode = (to, code) => {
    client.verify.services(verificationSid)
      .verificationChecks
      .create({to, code})
      .then(verification_check => res.status(200).json({message: verification_check.status}))
      .catch(err => res.json({message: err}));
}

module.exports = {
    sendSMS,
    sendCode,
    checkCode
}