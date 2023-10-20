const nodeMailer = require("nodemailer");
const messageTemplates = require("../model/templates");

exports.send = async (data) => {
    const message = messageTemplates.recovery(data);
    const transporter = nodeMailer.createTransport({
        host: process.env.MAIN_DOMAIN,
        port: 465,
        secure: true,
        dkim: {
            domainName: process.env.MAIN_DOMAIN,
            keySelector: "default",
            privateKey: `-----BEGIN RSA PRIVATE KEY-----\n
            
            \n-----END RSA PRIVATE KEY-----`,
        },
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    transporter.sendMail(
        {
            from: "Company Name<no-reply@companyname.com>",
            to: data.email,
            replyTo: "Company Name<contact@companyname.com>",
            subject: "You have requested to reset your password",
            ...message,
        },
        (err) => {
            if (err) return false;
        }
    );
    return true;
};
