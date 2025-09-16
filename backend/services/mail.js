import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import e from 'express'
dotenv.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.myGMAIL,
        pass: process.env.password
    }
})

async function sendMail(email , subject , body) {
    const mailOptions = {
        from: `"DTE PORTAL" <${process.env.myGMAIL}>`,
        to: email,
        subject: subject,
        text: body
    }
    try{
        await transporter.sendMail(mailOptions)
        return true
    }
    catch(err){
        console.log(err)
        return false
    }
}

export {sendMail}