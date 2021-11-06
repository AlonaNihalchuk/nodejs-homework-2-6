const Mailgen = require("mailgen");

class EmailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        // from .env
        this.link =
          " https://5040-2a01-117f-420a-8d00-d85-9700-d1e-8a7c.ngrok.io";

        break;
      case "production":
        // from .env
        this.link = "link for production";
        break;

      default:
        // from .env
        this.link = "http://127.0.0.1:3000";
        break;
    }
  }

  createTemplateEmail(emailName, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: "neopolitan",
      product: {
        name: "Your contacts",
        link: this.link,
      },
    });
    const email = {
      body: {
        emailName,
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
    return mailGenerator.generate(email);
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
