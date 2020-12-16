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
    getReviewContents,
    getPlaceRatingDistribution,
} = require('../controllers/map_controller');

router.route('/map/review')
    .post(getReviews);
    // .get(getReviews);
    
router.route('/map/review_content')
    .get(getReviewContents);
    // .post(getReviewContents);

module.exports = router;