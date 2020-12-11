const router = require('express').Router();
// const {wrapAsync} = require('../../util/util');

const {
    getReviewCategories,
} = require('../controllers/review_controller');

router.route('/review/categories')
    // .post(getReviews);
    .get(getReviewCategories);

module.exports = router;