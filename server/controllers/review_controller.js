require('dotenv').config();
// const validator = require('validator');
// const User = require('../models/user_model');
const Review = require('../models/review_model');
// const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds

const getReviewCategories = async (req, res) => {
  // const {place} = req.body;
  const categoryService = '服務';
  const categoryEnvironment = '環境';
  const place = 'ChIJwQPcmc-rQjQRtXDQA__PPwg';
  // const place = 'ChIJV-_wCdCrQjQRqOP_SmDYbZs';
  // console.log('In controller')
  // console.log(categoryService, categoryEnvironment, place);

  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const reviewService = await Review.getReviewService(categoryService, place);
  const reviewEnvironment = await Review.getReviewEnvironment(categoryEnvironment, place);
  res.status(200).send({
    data: {
      place_id: reviewService[0].place_id,
      place_name: reviewService[0].place_name,
      service: {
        total_cnt: reviewService[0].total_cnt,
        positvie_cnt: reviewService[0].positvie_cnt,
        neutral_cnt: reviewService[0].neutral_cnt,
        negative_cnt: reviewService[0].negative_cnt
      },
      environment: {
        total_cnt: reviewEnvironment[0].total_cnt,
        positvie_cnt: reviewEnvironment[0].positvie_cnt,
        neutral_cnt: reviewEnvironment[0].neutral_cnt,
        negative_cnt: reviewEnvironment[0].negative_cnt
      }
    }
  });
};

const getPlaceRatingDistribution = async (req, res) => {
  const {place} = req.body;
  const {food} = req.body;
  // const {place} = req.query;
  // const place = 'ChIJhyEhFcWrQjQRgght_BCEXyU';
  if(!place || !food) {
    res.status(400).send({error:'Request Error: place and food is required.'});
    return;
  }
  const distribution = await Review.getPlaceRatingDistribution(place, food);
  res.status(200).send({data: distribution});
};

const getReviewContentByPlace = async (req, res) => {
  const {place} = req.body;
  // const {place} = req.query;
  // const place = 'ChIJaU_-FyqrQjQRbLmzDXFaj5E';
  console.log(place);
  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const reviewContents = await Review.getReviewContentByPlace(place);
  res.status(200).send({data: reviewContents});
};

const getPlaceTags = async (req, res) => {
  const {place} = req.body;
  // const {place} = req.query;
  // const place = 'ChIJaU_-FyqrQjQRbLmzDXFaj5E';
  console.log(place);
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
  // const place = 'ChIJC0ET6dGrQjQRXAeCB9_CIQ0';
  // const category = '與會人';
  // console.log(place, category);

  if(!place||!category) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  const people = await Review.getPlacePeople(place, category);
  res.status(200).send({data: people});
};

const getReviewFeatures = async (req, res) => {
  // const {place} = req.body;
  const place = 'ChIJC0ET6dGrQjQRXAeCB9_CIQ0';

  if(!place) {
    res.status(400).send({error:'Request Error: place is required.'});
    return;
  }
  // const feature = await Review.getReviewFeature(place);
  const featureService = await Review.getReviewFeatureService(place);
  const featureEnvironment = await Review.getReviewFeatureEnvironment(place);
  const featurePrice = await Review.getReviewFeaturePrice(place);
  const featureCpvalue = await Review.getReviewFeatureCpvalue(place);
  const featureMeal = await Review.getReviewFeatureMeal(place);
  // res.status(200).send({data: featureService});
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

module.exports = {
  // getReviewCategories,
  getPlaceRatingDistribution,
  getReviewContentByPlace,
  getPlaceTags,
  getPlacePeople,
  getReviewFeatures
};
