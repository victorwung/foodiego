require('dotenv').config();
const MapPlace = require('../models/map_model');

const getPlaces = async (req, res) => {
  const {food} = req.body;
  if(!food) {
    res.status(400).send({error:'Request Error: food is required.'});
    return;
  }
  const matchReviews = await MapPlace.getPlaces(food);
  const places = [];
  let total = 0;
  for (let i = 0; i < matchReviews.length; i ++) {
    let cur_obj = {};
    cur_obj['place_id'] = matchReviews[i].place_id;
    cur_obj['place_name'] = matchReviews[i].place_name;
    cur_obj['place_lat'] = matchReviews[i].place_lat;
    cur_obj['place_lng'] = matchReviews[i].place_lng;
    cur_obj['place_rating'] = matchReviews[i].place_rating;
    cur_obj['total_count'] = matchReviews[i].total_count;
    cur_obj['match_count'] = matchReviews[i].match_count;
    total += matchReviews[i].match_count;
    cur_obj['place_addr'] = matchReviews[i].place_addr;
    place_tokens = matchReviews[i].token_key;
    if (!place_tokens) {
      cur_obj['place_tags'] = [];
    } else {
      cur_obj['place_tags'] = matchReviews[i].token_key.split(',', 5);
    }
    places.push(cur_obj);
  }
  res.status(200).send({
    total: total,
    data: places
  });
};

const getReviewContents = async (req, res) => {
  const {food} = req.body;
  if(!food) {
    res.status(400).send({error:'Request Error: food is required.'});
    return;
  }
  const matchReviewContents = await MapPlace.getReviewContents(food);
  res.status(200).send({data: matchReviewContents});
};

module.exports = {
    getPlaces,
    getReviewContents
};
