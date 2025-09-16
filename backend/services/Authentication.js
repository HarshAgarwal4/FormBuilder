import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

async function setUser(user) {
    const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    try{
        const token = await jwt.sign(payload , process.env.JWT_SECRET)
        return token
    }catch(err){
        console.log(err)
        return false
    }
}

function getUser(token) {
    if(!token) return false
    try{
        let r = jwt.verify(token , process.env.JWT_SECRET)
        return r
    }
    catch(err){
        console.log(err)
        return false
    }
}

export {getUser , setUser}