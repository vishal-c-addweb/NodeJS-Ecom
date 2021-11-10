const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.AUTH_USERNAME,
        pass: process.env.AUTH_PASSWORD
    }
});

export async function mailService(email:string,userName:string,password:string) {
    // send email
    try {
        await transporter.sendMail({
            from: process.env.AUTH_USERNAME,
            to: email,
            subject: 'Email From New Creation',
            text: "you are successfully register in New Creation\n"+`your userName & password for login is userName:${userName},password:${password}`
        });
    } catch(e) {
        console.log(e);
    }
}
