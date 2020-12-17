const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    signUp,
    signIn,
    // getUserProfile,
    getUserInfo,
} = require('../controllers/user_controller');

router.route('/user/signup')
    .post(signUp);
    // .post(wrapAsync(signUp));

router.route('/user/signin')
    .post(signIn);
    // .post(wrapAsync(signIn));

router.route('/user/profile')
    .get(getUserInfo);
    // .get(getUserProfile);
    // .get(wrapAsync(getUserProfile));

module.exports = router;