const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = process.env.HTTP_NGROK;

        break;
      case "production":
        this.link = "link for production";
        break;

      default:
        this.link = process.env.HTTP_DEFAULT;
        break;
    }
  }

  createTemplateEmail(email, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "neopolitan",
      product: {
        name: "Your contacts",
        link: this.link,
      },
    });
    const templateEmail = {
      body: {
        name: email,
        intro:
          "Welcome to Your contacts! We're very excited to have you on board.",
        action: {
          instructions: "To get started with Your contacts, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    };
    return mailGenerator.generate(templateEmail);
  }

  async sendVerifyEmail(email, verifyToken) {
    const emailHTML = this.createTemplateEmail(email, verifyToken);
    const msg = {
      to: email,
      subject: "Verify your email",
      html: emailHTML,
    };
    try {
      const result = await this.sender.send(msg);
      console.log(result);
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
module.exports = EmailService;
