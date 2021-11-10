const router = require('express').Router();

const { isUser } = require('../middlewares/guards');

router.get('/create', isUser(), (req, res) => {
    res.render('post/create');
});

router.post('/create', isUser(), async (req, res) => {
    const postData = {
        title: req.body.title,
        keyword: req.body.keyword,
        location: req.body.location,
        createDate: req.body.createDate,
        image: req.body.image,
        description: req.body.description,
        author: req.user._id

    };
    try {
        await req.storage.createPost(postData);
        res.redirect('/');
    } catch (err) {
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);

        } else {
            errors = [err.message];
        }

        const ctx = {
            errors: errors,
            postData: {
                title: req.body.title,
                keyword: req.body.keyword,
                location: req.body.location,
                createDate: req.body.createDate,
                image: req.body.image,
                description: req.body.description,
                author: req.user._id
            }
        };
        res.render('post/create', ctx);
    }
});

router.get('/allposts', async (req, res) => {
    const posts = await req.storage.getAllPosts();

    res.render('post/allposts', { posts });
});

router.get('/details/:id', async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);
        if (req.user) {
            post.hasUser = Boolean(req.user);
            post.isAuthor = req.user && req.user._id == post.author._id;
            post.hasVoted = false;
            if (post.votes.find(x => {
                if (x._id == req.user._id) {
                    post.hasVoted = true;
                }
            }));
        }
        
        res.render('post/details', { post });
    } catch (err) {
      
        res.redirect('/404');
    }
});

router.get('/edit/:id', isUser(), async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);
        if (req.user._id != post.author._id) {
            throw new Error('Cannot edit post you haven\'t created!');
        }
        res.render('post/edit', { post });
    } catch (err) {
        console.log(err.message);
        res.redirect('/');
    }
});

router.post('/edit/:id', isUser(), async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);
        if (req.user._id != post.author._id) {
            throw new Error('Cannot edit post you haven\'t created!');
        }

        await req.storage.editPost(req.params.id, req.body);
        res.redirect('/post/details/'+req.params.id);
    } catch (err) {
        let errors;
        if (err.errors) {
            errors = Object.values(err.errors).map(e => e.properties.message);

        } else {
            errors = [err.message];
        }

        const ctx = {
            errors: errors,
            post: {
                title: req.body.title,
                keyword: req.body.keyword,
                location: req.body.location,
                createDate: req.body.createDate,
                image: req.body.image,
                description: req.body.description,
                author: req.user._id
            }
        }
        res.render('post/edit', ctx);
    }
});

router.get('/delete/:id', isUser(),async (req, res) => {
    await req.storage.deletePost(req.params.id);
    res.redirect('/');
});

router.get('/voteup/:id', isUser(), async (req, res) => {
    try {
        const post = await req.storage.getPostById(req.params.id);
        const isAuthor = req.user && req.user._id == post.author._id;
        let hasVoted = false;

        if (post.votes.find(x => {
            if (x._id == req.user._id) {
                hasVoted = true;
            }
        }));
        console.log(isAuthor, hasVoted);
        if (!isAuthor && !hasVoted) {
            await req.storage.voteUp(req.params.id, req.user._id);
        }

        res.redirect('/post/details/' + req.params.id);

    } catch (err) {
        console.log(err.message);
        res.redirect('/post/details/' + req.params.id);
    }
});

router.get('/votedown/:id', isUser(), async (req, res) => {
    try {

        const post = await req.storage.getPostById(req.params.id);

        const isAuthor = req.user && req.user._id == post.author._id;

        let hasVoted = false;
        if (post.votes.find(x => {
            if (x._id == req.user._id) {
                hasVoted = true;
            }
        }));
        if (!isAuthor && !hasVoted) {
            await req.storage.voteDown(req.params.id, req.user._id)
        }
        res.redirect('/post/details/' + req.params.id);
    } catch (err) {
        res.redirect('/post/details/' + req.params.id);
    }
});




module.exports = router;