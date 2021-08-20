const nodemailer = require("nodemailer");

// Create Transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    }
  });
const contactus = (req, res) => {

    const {firstname, lastname, email, phone, subject, message} = req.body;
    const companyaddress = process.env.COMPANY_ADDRESS;
    transporter.sendMail({
        to: companyaddress,
        subject: `There is a message from ${email}`,
        html: `<div style='text-align: center'>
                    <h2>You have a message from ${firstname} ${lastname}</h2>
                    <h3>Phone number: ${phone}</h3>
                    <h3>Subject: ${subject}</h3>
                    <h3>Message: ${message}</h3>
                </div>`
      }).then((resp) => {
        res.json({message: resp});
      })
      .catch(err => res.json({message: err}));
}


module.exports = {
    contactus
}