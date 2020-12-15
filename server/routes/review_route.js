const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    // getReviewCategories,
    getReviewContentByPlace,
} = require('../controllers/review_controller');

// router.route('/review/categories')
//     // .post(getReviews);
//     .get(getReviewCategories);

router.route('/review/contents')
    .post(getReviewContentByPlace);
    // .get(getReviewContentByPlace);

module.exports = router;