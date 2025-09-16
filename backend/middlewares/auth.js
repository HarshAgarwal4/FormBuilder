import cookieParser from "cookie-parser"
import { getUser } from "../services/Authentication.js"
const allowedPaths = ['/']

async function isLoggedIn (req, res,next) {
    if(allowedPaths.includes(req.path) || req.path.startsWith('/user') || req.path.startsWith('/form')) return next()
    const  uid = req.cookies?.UID
    if(!uid) return res.send({status: 8 , msg:"UnAuthenticated"})
    const user = getUser(uid)
    if(!user) return res.send({status:8 , msg:"UnAuthenticated"})
    req.user = user;
    next()
}

export {isLoggedIn}