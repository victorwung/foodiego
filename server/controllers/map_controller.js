require('dotenv').config();
// const validator = require('validator');
// const User = require('../models/user_model');
const MapReview = require('../models/map_model');
// const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds

const getReviewContents = async (req, res) => {
  // const {food} = req.body;
  const food = '牛';
  if(!food) {
    res.status(400).send({error:'Request Error: food is required.'});
    return;
  }
  const matchReviewContents = await MapReview.getReviewContents(food);
  res.status(200).send({data: matchReviewContents});
  // res.status(200).json(matchReviewContents);
};

const getReviews = async (req, res) => {
  const {food} = req.body;
  // console.log(food);
  if(!food) {
    res.status(400).send({error:'Request Error: food is required.'});
    return;
  }
  const matchReviews = await MapReview.getReviews(food);
  res.status(200).send({data: matchReviews});
};

module.exports = {
    getReviews,
    getReviewContents
};
