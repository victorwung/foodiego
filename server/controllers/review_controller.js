require('dotenv').config();
const Review = require('../models/review_model');

const getPlaceRatingDistribution = async (req, res) => {
  const {place} = req.body;
  const {food} = req.body;

  if(!place || !food) {
    res.status(400).send({error:'Request Error: place and food is required.'});
    return;
  }
  const distribution = await Review.getPlaceRatingDistribution(place, food);
  res.status(200).send({data: distribution});
};

const getReviewContentByPlace = async (req, res) => {
  const {place} = req.body;

  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const reviewContents = await Review.getReviewContentByPlace(place);
  res.status(200).send({data: reviewContents});
};

const getPlaceTags = async (req, res) => {
  const {place} = req.body;

  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const placeTags = await Review.getPlaceTags(place);
  res.status(200).send({data: placeTags});
};

const getPlacePeople = async (req, res) => {
  const {place} = req.body;
  const category = '與會人';

  if(!place||!category) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const people = await Review.getPlacePeople(place, category);
  res.status(200).send({data: people});
};

const getReviewFeatures = async (req, res) => {
  const {place} = req.body;

  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }

  const featureService = await Review.getReviewFeatureService(place);
  const featureEnvironment = await Review.getReviewFeatureEnvironment(place);
  const featurePrice = await Review.getReviewFeaturePrice(place);
  const featureCpvalue = await Review.getReviewFeatureCpvalue(place);
  const featureMeal = await Review.getReviewFeatureMeal(place);

  res.status(200).send({
    data: {
      place_id: place,
      service: {
        total_cnt: featureService[0].total_cnt,
        positvie_cnt: featureService[0].positvie_cnt,
        neutral_cnt: featureService[0].neutral_cnt,
        negative_cnt: featureService[0].negative_cnt
      },
      environment: {
        total_cnt: featureEnvironment[0].total_cnt,
        positvie_cnt: featureEnvironment[0].positvie_cnt,
        neutral_cnt: featureEnvironment[0].neutral_cnt,
        negative_cnt: featureEnvironment[0].negative_cnt
      },
      price: {
        total_cnt: featurePrice[0].total_cnt,
        positvie_cnt: featurePrice[0].positvie_cnt,
        neutral_cnt: featurePrice[0].neutral_cnt,
        negative_cnt: featurePrice[0].negative_cnt
      },
      cpvalue: {
        total_cnt: featureCpvalue[0].total_cnt,
        positvie_cnt: featureCpvalue[0].positvie_cnt,
        neutral_cnt: featureCpvalue[0].neutral_cnt,
        negative_cnt: featureCpvalue[0].negative_cnt
      },
      meal: {
        total_cnt: featureMeal[0].total_cnt,
        positvie_cnt: featureMeal[0].positvie_cnt,
        neutral_cnt: featureMeal[0].neutral_cnt,
        negative_cnt: featureMeal[0].negative_cnt
      }
    }
  });
};

const getReviewFeatureStars = async (req, res) => {
  const {place} = req.body;
  
  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const stars = await Review.getReviewFeatureStars(place);
  res.status(200).send({data: stars});
};

const getPlaceInfo = async (req, res) => {
  const {food} = req.body;
  const {place} = req.body;

  if(!food||!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const placeInfo = await Review.getPlaceInfo(food, place);
  res.status(200).send({data: placeInfo});
};

module.exports = {
  getPlaceRatingDistribution,
  getReviewContentByPlace,
  getPlaceTags,
  getPlacePeople,
  getReviewFeatures,
  getReviewFeatureStars,
  getPlaceInfo
};
