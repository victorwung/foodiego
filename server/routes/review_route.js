const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    // getReviewCategories,
    getReviewContentByPlace,
    getPlaceTags,
} = require('../controllers/review_controller');

// router.route('/review/categories')
//     // .post(getReviews);
//     .get(getReviewCategories);

router.route('/review/contents')
    .post(getReviewContentByPlace);
    // .get(getReviewContentByPlace);

router.route('/review/tags')
    .post(getPlaceTags);
    // .get(getPlaceTags);

module.exports = router;