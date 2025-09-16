import { getUser, setUser } from "../services/Authentication.js"
import { verifyPassword } from "../services/encyption.js"
import { sendOtp, verifyOTP } from "../services/Otp.js"
import { TempUserModel } from "../models/user.js"

async function signUp(req, res) {
    let { name, email, otp, password } = req.body
    console.log(email, otp, name, password)
    try {
        let r = verifyOTP(email, otp)
        if (!r) return res.send({ status: 2, msg: "Invalid OTP" })
        else {
            let obj = { name, email, password }
            let obj1 = new TempUserModel(obj)
            await obj1.save()
            return res.send({ status: 1, msg: "account succesfully created" })
        }
    } catch (err) {
        console.log(err)
        return res.send({ status: 0, msg: "signup failed" })
    }
}

async function login(req, res) {
    let { email, password } = req.body;
    if (!email || !password) return res.send({ status: 7, msg: "No data" })
    try {
        let findUser = await TempUserModel.findOne({ email })
        console.log(findUser)
        if (!findUser) return res.send({ status: 3, msg: "User not found" })
        if (findUser) {
            let r = await verifyPassword(password, findUser.password)
            if (!r) return res.send({ status: 2, msg: "Invalid email or password" })
            else {
                let token = await setUser(findUser)
                res.cookie('UID', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                return res.send({ status: 1, msg: "Login succesfull" })
            }
        }
    } catch (err) {
        console.log(err)
        return res.send({ status: 0, msg: "error occured" })
    }
}

async function sendOTPtoEmail(req, res) {
    let { email } = req.body
    try {
        let r = await sendOtp(email)
        if (!r) {
            return res.send({ status: 0, msg: "error in sending OTP" })
        }
        return res.send({ status: 1, msg: "Otp sent succesfully" })
    } catch (err) {
        console.log(err)
        return res.send({ status: 2, msg: "something went wrong" })
    }
}

async function fetchUser(req, res) {
    const token = req.cookies?.UID
    if (!token) return res.send({ status: 0, msg: "Not authenticated" });
    try {
        const payload = getUser(token)
        if (!payload) return res.send({ status: 0, msg: "Not Authenticated" })
        res.send({ status: 1, data: payload })
    } catch (err) {
        res.send({ status: 2, msg: "Invalid Token" })
    }
}

export { signUp, login, sendOTPtoEmail, fetchUser }