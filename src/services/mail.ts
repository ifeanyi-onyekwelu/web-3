import nodemailer from "nodemailer"
import HttpError from "@/utils/errors";

class EmailService {
    transporter: any;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendMail (to: string, subject: string, text: string) {
        const mailOptions = {
            from: process.env.MAIL,
            to,
            subject,
            text
        }

        try {
            await this.transporter.sendMail(mailOptions)
        } catch (error: any) {
            throw new HttpError(500, `Error sending mail: ${error}`)
        }
    }

    async sendVerificationEmail(user: any, token:any) {
        const subject = "Email Verification";
        const text = `Please verify your email by clicking on the following link: ${process.env.CLIENT_URL}/verify-email?token=${token}`
        await this.sendMail(user.email, subject, text);
    }

    async sendLoginNotification(user: any) {
        const subject = "New Login Notification";
        const text = `Hello ${user.fullName},\n\nWe noticed a new login to your account. If this wasn't you, please contact support immediately.`
        await this.sendMail(user.email, subject, text);
    }
}


export default EmailService;