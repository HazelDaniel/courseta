import nodemailer, { Transporter } from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
import { SentMessageInfo } from "nodemailer";
import { log } from "../../../utils.js";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const transporter1 = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
  ignoreTLS: true,
});

export class Mailer {
  private transporter: Transporter;
  private static _instance: Mailer;

  constructor(transporter?: Transporter) {
    const auth = {
      auth: {
        api_key: process.env.CST_MAIL_API_KEY as string,
        domain: process.env.CST_MAIL_API_HOST as string,
      },
    };
    if (transporter) this.transporter = transporter;
    else this.transporter = nodemailer.createTransport(mailgun(auth));

    // if (process.env.CST_CONTEXT === "test") {
    //   this.transporter = transporter1;
    // }

  }

  static get instance(): Mailer {
    if (!this._instance) return new Mailer();
    return this._instance;
  }

  public sendEmail(
    source: string,
    options: EmailOptions
  ): Promise<SentMessageInfo> {
    const mailOptions = {
      from: source,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          log("error is ", error);
          reject(error);
          return;
        }
        resolve(info);
      });
    });
  }
}

export default Mailer.instance;
