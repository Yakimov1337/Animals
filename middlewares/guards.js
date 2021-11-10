function isUser() {
    return (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/auth/register');
        }
    };
}

function isGuest() {
    return (req, res, next) => {
        if (!req.user) {
            next();
        } else {
            res.redirect('/auth/login');
        }
    };
}

module.exports = {
    isUser,
    isGuest
}