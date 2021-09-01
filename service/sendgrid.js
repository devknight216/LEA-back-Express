
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.SENDGRID_EMAIL_ADDRESS;

const sendEmail = ( to, subject, text, html ) => {
    const msg = {
        to,
        from: fromEmail,
        subject,
        text,
        html,
      };
    sgMail
        .send(msg)
        .then(() => {}, error => {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    });
}

module.exports = {
    sendEmail
}