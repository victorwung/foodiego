const {query, transaction, commit, rollback} = require('./mysqlcon');

const getPlaces = async (food) => {
    const reviewGroupByCnt = await query(
      'SELECT t1.place_id, t1.place_name, t2.place_lat, t2.place_lng, t2.place_rating, \
        COUNT(t1.review_id) AS total_count, \
        SUM(CASE WHEN t1.review_content LIKE ? THEN 1 ELSE 0 END) AS match_count, \
        t2.place_addr, t3.token_key \
       FROM review AS t1 \
       LEFT JOIN place AS t2 ON t1.place_id = t2.place_id \
       LEFT JOIN place_token AS t3 ON t1.place_id = t3.place_id \
       GROUP BY place_id \
       HAVING match_count > 0 \
       ORDER BY match_count DESC', ['%'+food+'%']);

    if (reviewGroupByCnt.length === 0) {
        return {result: 'Not Found'};
    } else {
        return reviewGroupByCnt;
    }
};

const getReviewContents = async (food) => {
    const reviewContents = await query(
      'SELECT review_id \
       FROM review \
       WHERE review_content LIKE ?', ['%'+food+'%']);

    if (reviewContents.length === 0) {
        return {result: 'Not Found'};
    } else {
        return reviewContents;
    }
};

module.exports = {
    getPlaces,
    getReviewContents,
};