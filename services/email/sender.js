const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();

class CreateSenderSendgrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    return await sgMail.send({ ...msg, from: "alonafrontend@gmail.com" });
  }
}
class CreateSenderNodemailer {
  async send(msg) {
    const config = {
      host: "smtp.rambler.ru",
      port: 465,
      secure: true,
      auth: {
        //   ok?
        user: "alonanihalchukdev@rambler.ru",
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({
      ...msg,
      //   my email
      from: "alonanihalchukdev@rambler.ru",
    });
  }
}
module.exports = {
  CreateSenderSendgrid,
  CreateSenderNodemailer,
};
