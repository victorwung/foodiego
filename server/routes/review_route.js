const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    // getReviewCategories,
    getPlaceRatingDistribution,
    getReviewContentByPlace,
    getPlaceTags,
    getPlacePeople,
    getReviewFeatures,
} = require('../controllers/review_controller');

// router.route('/review/categories')
//     // .post(getReviews);
//     .get(getReviewCategories);

router.route('/review/rating')
    .post(getPlaceRatingDistribution);
    // .get(getPlaceRatingDistribution);

router.route('/review/contents')
    .post(getReviewContentByPlace);
    // .get(getReviewContentByPlace);

router.route('/review/tags')
    .post(getPlaceTags);
    // .get(getPlaceTags);

router.route('/review/people')
    .post(getPlacePeople);
    // .get(getPlacePeople

router.route('/review/features')
    // .post(getReviewFeature);
    .get(getReviewFeatures);

module.exports = router;