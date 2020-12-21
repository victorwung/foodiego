const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    // getReviewCategories,
    getPlaceRatingDistribution,
    getReviewContentByPlace,
    getPlaceTags,
    getPlacePeople,
    getReviewFeatures,
    getReviewFeatureStars,
    getPlaceInfo,
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

router.route('/review/feature/stars')
    .post(getReviewFeatureStars);
    // .get(getReviewFeatureStars);

router.route('/review/placeinfo')
    .post(getPlaceInfo);
    // .get(getPlaceInfo);

module.exports = router;