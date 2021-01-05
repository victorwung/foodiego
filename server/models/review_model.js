const {query, transaction, commit, rollback} = require('./mysqlcon');

const getPlaceRatingDistribution = async (place, food) => {
    const ratingDistribution = await query(
      "SELECT place_id, place_name, COUNT(review_id) AS total_cnt, ROUND(AVG(t.rating),1) AS avg_rating,\
        SUM(CASE WHEN t.rating IN (4,5) THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t.rating IN (3) THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t.rating IN (1,2) THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review t \
       WHERE place_id = ? AND review_content LIKE ? ", [place, '%'+food+'%']);

    if (ratingDistribution.length === 0) {
        return {result: 'Not Found'};
    } else {
        return ratingDistribution;
    }
};

const getReviewContentByPlace = async (place) => {
    const reviewContents = await query(
      "SELECT t.place_id, t.review_id, t.user_name, t.review_content, t.rating, t.rel_date \
       FROM review AS t\
       WHERE t.place_id=?", [place]);

    if (reviewContents.length === 0) {
        return {result: 'Not Found'};
    } else {
        return reviewContents;
    }
};

const getPlaceTags = async (place) => {
    const placeTags = await query(
      "SELECT t.place_id, t.place_name, t.token_key, t.token_value \
       FROM place_token AS t \
       WHERE t.place_id=?", [place]);

    if (placeTags.length === 0) {
        return {result: 'Not Found'};
    } else {
        return placeTags;
    }
};

const getPlacePeople = async (place, category) => {
    const people = await query(
            "SELECT t.place_id, t.place_name, COUNT(t.review_id) AS total_cnt, \
              SUM(CASE WHEN t.subcategory_name='家人' THEN 1 ELSE 0 END) AS family_cnt, \
              SUM(CASE WHEN t.subcategory_name='朋友' THEN 1 ELSE 0 END) AS friend_cnt, \
              SUM(CASE WHEN t.subcategory_name='兒童' THEN 1 ELSE 0 END) AS child_cnt, \
              SUM(CASE WHEN t.subcategory_name='情侶' THEN 1 ELSE 0 END) AS mate_cnt, \
              SUM(CASE WHEN t.subcategory_name='寵物' THEN 1 ELSE 0 END) AS pet_cnt \
             FROM \
              (SELECT t1.place_id, t1.place_name, t1.review_id, t2.subcategory_name, t1.review_content \
              FROM review t1 \
              JOIN (SELECT DISTINCT subcategory_name, word FROM review_category WHERE category_name=?) t2 \
              ON t1.review_content LIKE CONCAT('%',word,'%') \
              WHERE place_id=?) AS t", [category, place]);
    if (people.length === 0) {
        return {result: 'Not Found'};
    } else {
        return people;
    }
};

const getReviewFeatureService = async (place) => {
    const service = await query(
      "SELECT t1.place_id, COUNT(t1.review_id) AS total_cnt, \
        SUM(CASE WHEN t1.service_score >=0.3 THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t1.service_score <0.3 AND t1.service_score>=-0.4 THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t1.service_score <-0.4 THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review_feature t1 \
       WHERE t1.place_id=? AND t1.service is not null;", [place]);

    if (service.length === 0) {
        return {result: 'Not Found'};
    } else {
        return service;
    }
};

const getReviewFeatureEnvironment = async (place) => {
    const environment = await query(
      "SELECT t1.place_id, COUNT(t1.review_id) AS total_cnt, \
        SUM(CASE WHEN t1.environment_score >=0.3 THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t1.environment_score <0.3 AND t1.environment_score>=-0.4 THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t1.environment_score <-0.4 THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review_feature t1 \
       WHERE t1.place_id=? AND t1.environment is not null;", [place]);

    if (environment.length === 0) {
        return {result: 'Not Found'};
    } else {
        return environment;
    }
};

const getReviewFeaturePrice = async (place) => {
    const price = await query(
      "SELECT t1.place_id, COUNT(t1.review_id) AS total_cnt, \
        SUM(CASE WHEN t1.price_score >=0.3 THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t1.price_score <0.3 AND t1.price_score>=-0.4 THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t1.price_score <-0.4 THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review_feature t1 \
       WHERE t1.place_id=? AND t1.price is not null;", [place]);

    if (price.length === 0) {
        return {result: 'Not Found'};
    } else {
        return price;
    }
};

const getReviewFeatureCpvalue = async (place) => {
    const cpvalue = await query(
      "SELECT t1.place_id, COUNT(t1.review_id) AS total_cnt, \
        SUM(CASE WHEN t1.cpvalue_score >=0.3 THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t1.cpvalue_score <0.3 AND t1.cpvalue_score>=-0.4 THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t1.cpvalue_score <-0.4 THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review_feature t1 \
       WHERE t1.place_id=? AND t1.cpvalue is not null;", [place]);

    if (cpvalue.length === 0) {
        return {result: 'Not Found'};
    } else {
        return cpvalue;
    }
};

const getReviewFeatureMeal = async (place) => {
    const cpvalue = await query(
      "SELECT t1.place_id, COUNT(t1.review_id) AS total_cnt, \
        SUM(CASE WHEN t1.meal_score >=0.3 THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t1.meal_score <0.3 AND t1.meal_score>=-0.4 THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t1.meal_score <-0.4 THEN 1 ELSE 0 END) AS negative_cnt \
       FROM review_feature t1 \
       WHERE t1.place_id=? AND t1.meal is not null;", [place]);

    if (cpvalue.length === 0) {
        return {result: 'Not Found'};
    } else {
        return cpvalue;
    }
};

const getReviewFeatureStars = async (place) => {
    const stars = await query(
        "SELECT t1.place_id, \
          (SUM(t1.service_star)/COUNT(t1.service)) AS service_star, COUNT(t1.service) AS service_cnt, \
          (SUM(t1.environment_star)/COUNT(t1.environment)) AS environment_star, COUNT(t1.environment) AS environment_cnt, \
          (SUM(t1.price_star)/COUNT(t1.price)) AS price_star, COUNT(t1.price) AS price_cnt, \
          (SUM(t1.cpvalue_star)/COUNT(t1.cpvalue)) AS cpvalue_star, COUNT(t1.cpvalue) AS cpvalue_cnt, \
          (SUM(t1.meal_star)/COUNT(t1.meal)) AS meal_star, COUNT(t1.meal) AS meal_cnt \
         FROM review_feature_star t1 \
         WHERE t1.place_id=?;", [place]);

    if (stars.length === 0) {
        return {result: 'Not Found'};
    } else {
        return stars;
    }
};

const getPlaceInfo = async (food, place) => {
    const info = await query(
        "SELECT t1.place_id, t1.place_name, t2.place_lat, t2.place_lng, \
            t2.place_rating, t2.place_addr, t2.place_phone, \
            COUNT(t1.review_id) AS total_count, \
            SUM(CASE WHEN t1.review_content LIKE ? THEN 1 ELSE 0 END) AS match_count \
            FROM review AS t1 \
            LEFT JOIN place AS t2 ON t1.place_id = t2.place_id \
            WHERE t1.place_id=?", ['%'+food+'%', place]);

    if (info.length === 0) {
        return {result: 'Not Found'};
    } else {
        return info;
    }
};

module.exports = {
    getPlaceRatingDistribution,
    getReviewContentByPlace,
    getPlaceTags,
    getPlacePeople,
    getReviewFeatureService,
    getReviewFeatureEnvironment,
    getReviewFeaturePrice,
    getReviewFeatureCpvalue,
    getReviewFeatureMeal,
    getReviewFeatureStars,
    getPlaceInfo,
};