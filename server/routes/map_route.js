const router = require('express').Router();

const {
    getPlaces,
    getReviewContents,
} = require('../controllers/map_controller');

router.route('/map/places')
    .post(getPlaces);
    
router.route('/map/review_content')
    .get(getReviewContents);

module.exports = router;