const router = require('express').Router();

const {
    signUp,
    signIn,
    getUserInfo,
    likePlace,
} = require('../controllers/user_controller');

router.route('/user/signup')
    .post(signUp);

router.route('/user/signin')
    .post(signIn);

router.route('/user/profile')
    .get(getUserInfo);

router.route('/user/like')
    .post(likePlace);

module.exports = router;