const router = require('express').Router();
const userService = require('../services/userService');

router.get('/', async (req, res) => {
    if (req.user) {
        const posts = await req.storage.getOwnPosts(req.user._id);
        res.render('user/my-posts', { posts });

    } else {
        res.render('user/my-posts');

    }
});


module.exports = router;