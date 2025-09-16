function giveAccessTo(role = []) {
    return function (req, res, next) {
        if (!req.user || !req.user.role) return res.send('unauthorized access')
        if (!role.includes(req.user.role)) return res.send('unauthorized access')
        next()
    }
}

export {giveAccessTo}