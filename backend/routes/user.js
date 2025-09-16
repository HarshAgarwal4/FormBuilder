import express from 'express'
import { fetchUser, login, sendOTPtoEmail, signUp } from '../controllers/user.js'
let userRoutes = express.Router()

userRoutes.post('/user/register' , signUp)
userRoutes.post('/user/login' , login)
userRoutes.post('/user/send-otp' , sendOTPtoEmail)
userRoutes.get('/user/me' , fetchUser)

export {userRoutes}