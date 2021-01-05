const router = require('express').Router();

const {
    getReviews,
    getReviewContents,
} = require('../controllers/map_controller');

router.route('/map/review')
    .post(getReviews);
    
router.route('/map/review_content')
    .get(getReviewContents);

module.exports = router;