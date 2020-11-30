const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

// const {
//     signUp,
//     signIn,
//     getUserProfile,
// } = require('../controllers/user_controller');

// router.route('/user/signup')
//     .post(wrapAsync(signUp));

// router.route('/user/signin')
//     .post(wrapAsync(signIn));

// router.route('/user/profile')
//     .get(wrapAsync(getUserProfile));

const {
    getReviews,
} = require('../controllers/map_controller');

router.route('/map/review')
    .get(getReviews);
    // .get(wrapAsync(getMusicHot));

module.exports = router;