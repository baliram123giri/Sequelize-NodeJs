const nodemailer = require("nodemailer")
const ejs = require("ejs")
const path = require("path")

async function sendEmail(options, { host, port, service, email: smtp_email, password }) {

    const transporter = nodemailer.createTransport({
        host,
        port,
        service,
        auth: {
            user: smtp_email,
            pass: password,
        }
    })

    const { email, data, subject, template } = options
    const templatePath = path.join(__dirname, "../mails", template)

    //render tempate with ejs
    const html = await ejs.renderFile(templatePath, data)
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html
    }
    await transporter.sendMail(mailOptions)
}

module.exports = { sendEmail }