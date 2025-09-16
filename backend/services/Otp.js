import { sendMail } from "./mail.js";

function generateOtp () {
    return Math.floor(100000 + Math.random() * (999999-10000)).toString();
}

const otpStroage = new Map()

async function sendOtp(email) {
    const otp = generateOtp()
    if(otpStroage.has(email)){
        otpStroage.delete(email)
        otpStroage.set(email , otp)
    }else{
        otpStroage.set(email , otp)
    }
    console.log(otpStroage)
    setTimeout(() => {
        otpStroage.delete(email)
    }, 5*60*1000);
    try{
        let text = `Welcome to Form Builder. Your OTP code is ${otp} OTP will expire in 5 minutes`
        const subject = 'OTP'
        let r = await sendMail(email , subject , text)
        if(r) return true
        else return false
    }catch(err) {
        console.log(true)
        return false
    }
}

function verifyOTP(email , otp) {
    const storedOTP = otpStroage.get(email)
    console.log(otpStroage)
    console.log(storedOTP , otp)
    if(storedOTP === otp){
        otpStroage.delete(email)
        return true
    }
    else {
        return false
    }
}

export {sendOtp , verifyOTP}