require('dotenv').config();
// const validator = require('validator');
// const User = require('../models/user_model');
const Review = require('../models/review_model');
// const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds

const getReviewCategories = async (req, res) => {
  // const {place} = req.body;
  const place = 'FLUGEL';
  // console.log(food);
  if(!place) {
    res.status(400).send({error:'Request Error: food is required.'});
    return;
  }
  const matchReviews = await Review.getReviewCategories(place);
  res.status(200).send({data: matchReviews});
};

module.exports = {
  getReviewCategories
};
