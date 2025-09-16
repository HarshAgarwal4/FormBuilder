import bcrypt from 'bcrypt'

async function hashPassword(password) {
    let saltRounds = 10;
    try{
        let r = await bcrypt.hash(password , saltRounds)
        return r
    }catch(err){
        console.log(r)
        return false
    }
}

async function verifyPassword(password , hashPassword) {
    let r = await bcrypt.compare(password , hashPassword)
    return r
}

export {hashPassword , verifyPassword}