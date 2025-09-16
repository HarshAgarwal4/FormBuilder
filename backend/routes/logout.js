import express from 'express'
import { logout } from '../controllers/logout.js'

let logoutRouter = express.Router()

logoutRouter.post('/logout' , logout)

export {logoutRouter}