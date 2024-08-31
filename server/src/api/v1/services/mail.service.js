import nodemailer from "nodemailer";
import mailgun from "nodemailer-mailgun-transport";
import { log } from "../../../utils.js";
const transporter1 = nodemailer.createTransport({
    host: "localhost",
    port: 1025,
    ignoreTLS: true,
});
export class Mailer {
    constructor(transporter) {
        const auth = {
            auth: {
                api_key: process.env.CST_MAIL_API_KEY,
                domain: process.env.CST_MAIL_API_HOST,
            },
        };
        if (transporter)
            this.transporter = transporter;
        else
            this.transporter = nodemailer.createTransport(mailgun(auth));
        if (process.env.CST_CONTEXT === "test") {
            this.transporter = transporter1;
        }
    }
    static get instance() {
        if (!this._instance)
            return new Mailer();
        return this._instance;
    }
    sendEmail(source, options) {
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
