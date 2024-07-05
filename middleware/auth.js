const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    }
    else {
        res.redirect("/");
    }
}

const ensureGuest = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/dashboard");
    }
    next();
}

module.exports = {
    ensureAuth,
    ensureGuest,
}