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
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        //   my email
        user: "goitnodejs@meta.ua",
        pass: process.env.PASSWORD,
      },
    };
    const transporter = nodemailer.createTransport(config);
    return await transporter.sendMail({
      ...msg,
      //   my email
      from: "goitnodejs@meta.ua",
    });
  }
}
module.exports = {
  CreateSenderSendgrid,
  CreateSenderNodemailer,
};
