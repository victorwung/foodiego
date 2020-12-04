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
      "SELECT t1.place_id, t1.place_name, t2.place_lat, t2.place_lng, count(t1.review_id) AS review_count \
       FROM review AS t1 LEFT JOIN place AS t2 ON t1.place_id = t2.place_id \
       WHERE review_content LIKE ? \
       GROUP BY place_id", ['%'+food+'%']);

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

module.exports = {
    getReviews,
    getReviewContents,
};