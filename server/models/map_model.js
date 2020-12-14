const {query, transaction, commit, rollback} = require('./mysqlcon');

const getReviewContents = async (food) => {
    const reviewContents = await query(
      "SELECT review_id \
       FROM review \
       WHERE review_content LIKE ?", ['%'+food+'%']);

    // const reviewContents = await query(
    //     "SELECT place_id, place_name, review_id, review_content \
    //      FROM review3 \
    //      WHERE review_content LIKE ?", ['%'+food+'%']);

    if (reviewContents.length === 0) {
        // return {error: 'Invalid Access Token'};
        return {result: 'Not Found'};
    } else {
        return reviewContents;
    }
};

const getReviews = async (food) => {
    // const reveiwsMatch = await getReviewContents(food);
    // console.log(reveiwsMatch);

    const reviewGroupByCnt = await query(
      "SELECT t1.place_id, t1.place_name, t2.place_lat, t2.place_lng, t2.place_rating, \
        COUNT(t1.review_id) AS total_count, \
        SUM(CASE WHEN t1.review_content LIKE ? THEN 1 ELSE 0 END) AS match_count, \
        t2.place_addr, t3.token_key \
       FROM review AS t1 \
       LEFT JOIN place AS t2 ON t1.place_id = t2.place_id \
       LEFT JOIN place_token AS t3 ON t1.place_id = t3.place_id \
       GROUP BY place_id \
       HAVING match_count > 0 \
       ORDER BY match_count DESC", ['%'+food+'%']);

    // const reviewGroupByCnt = await query(
    // "SELECT t1.place_id, t1.place_name, t2.place_lat, t2.place_lng, t2.place_rating, \
    //     count(t1.review_id) AS review_count, \
    //     t2.place_addr \
    //     FROM review AS t1 LEFT JOIN place AS t2 ON t1.place_id = t2.place_id \
    //     WHERE review_content LIKE ? \
    //     GROUP BY place_id \
    //     ORDER BY review_count DESC", ['%'+food+'%']);

    if (reviewGroupByCnt.length === 0) {
        // return {error: 'Invalid Access Token'};
        return {result: 'Not Found'};
    } else {
        // console.log(results); // check
        return reviewGroupByCnt;
    }
};
// console.log(getReviews('牛'));
// console.log('HERE');

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
        // console.log(results); // check
        return ratingDistribution;
    }
};

module.exports = {
    getReviews,
    getReviewContents,
    getPlaceRatingDistribution,
};