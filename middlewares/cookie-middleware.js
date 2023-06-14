const cookieMiddleware = (req, res, next) => {
    // Check if the token is in the response
    if (res.locals.token) {
        // Set the token in a cookie
        res.cookie('token', res.locals.token, {
            maxAge: 60 * 60 * 24, // 1 day
            httpOnly: true, // The cookie can only be accessed by the server
        });
    }
    next();
};

module.exports = cookieMiddleware;
