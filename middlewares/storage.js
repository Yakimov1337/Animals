const postService = require('../services/postService');



module.exports = () => (req, res, next) => {
    req.storage = {
        ...postService,
    };
    next();
};