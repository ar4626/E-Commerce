const nodemailer = require('nodemailer');
const asynchandler = require('express-async-handler')

const sendEmail = asynchandler(async (data, req, res) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PWD,
        },
    });

    console.log(data.to);
    // async..await is not allowed in global scope, must use a wrapper
    let info = await transporter.sendMail({
        from: '"Hey👻" <abc@gmail.com>', // sender address
        to: data.to, // list of receivers
        subject: data.subject, // Subject line
        text: data.text, // plain text body
        html: data.htm, // html body
    });

    console.log("Message sent: %s", info.messageId);

})

module.exports = {
    sendEmail,
}