

async function logout(req, res) {
    let userId = req.cookies?.UID
    try {
        if (userId) {
            let a = res.clearCookie('UID', {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                path: '/'
            })
            req.user = null
            return res.send({ status: 1, msg: "Logged Out successfully" })
        } else {
            return res.send({ status: 0 })
        }
    } catch (err) {
        console.log(err)
        return res.send({ status: 0 })
    }
}

export { logout }