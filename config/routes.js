const authController = require('../controllers/authController');
const homeController = require('../controllers/homeController');
const postController = require('../controllers/postController');
const userController = require('../controllers/userController.js');
const pathController = require('../controllers/pathController.js');




module.exports = (app) => {
    app.use('/', homeController),
    app.use('/auth', authController),
    app.use('/post', postController),
    app.use('/user', userController);
    app.use('*', pathController);
};