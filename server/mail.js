// create reusable transporter object
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log(process.env.PASS);
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kubabir.dev@gmail.com',
        pass: process.env.PASS,
    },
});

exports.mail = async function (to) {
    // setup email data
    let mailOptions = {
        from: 'kubabir2002@gmail',
        to: 'kubabir@outlook.com',
        subject: 'Alarm Triggered!',
        text: 'Your alarm system has been triggered. Please go to the admin page to view the logs.',
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
