const jwt = require('jsonwebtoken');


const checkTokenWeb = (req, res, next) => {
    const { session } = req;
    const url = req.originalUrl.toLowerCase();
    if (!session) {
        if (url.includes('/login')) {
            next();
        } else {
            return res.redirect('/login')
        }
    } else {
        const { token } = session;
        if (!token) {
            if (url.includes('/login')) {
                return next();
            } else {
                return res.redirect('/login');
            }
        } else {
            jwt.verify(token, 'secret', (err, decoded) => {
                if (err) {
                    if (url.includes('/login')) {
                       return next();
                    } else {
                        return res.redirect('/login');
                    }
                } else {
                    if (url.includes('/login')) {
                       return next();
                    } else {
                        return res.redirect('/informationuser/' + userId);
                    }
                }
            });
        }
    }
}

module.exports = { checkTokenWeb };