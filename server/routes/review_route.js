const router = require('express').Router();

const {
    getPlaceRatingDistribution,
    getReviewContentByPlace,
    getPlaceTags,
    getPlacePeople,
    getReviewFeatures,
    getReviewFeatureStars,
    getPlaceInfo,
} = require('../controllers/review_controller');

router.route('/review/rating')
    .post(getPlaceRatingDistribution);

router.route('/review/contents')
    .post(getReviewContentByPlace);

router.route('/review/tags')
    .post(getPlaceTags);

router.route('/review/people')
    .post(getPlacePeople);

router.route('/review/features')
    .get(getReviewFeatures);

router.route('/review/feature/stars')
    .post(getReviewFeatureStars);

router.route('/review/placeinfo')
    .post(getPlaceInfo);

module.exports = router;