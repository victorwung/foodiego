const {query, transaction, commit, rollback} = require('./mysqlcon');

const getReviewService = async (category, place) => {
    console.log('In model');
    console.log(category, place);
    const reviewService = await query(
      "SELECT t.place_id, t.place_name, COUNT(DISTINCT t.review_id) AS total_cnt, \
        SUM(CASE WHEN t.rating IN (4,5) THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t.rating IN (3) THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t.rating IN (1,2) THEN 1 ELSE 0 END) AS negative_cnt \
       FROM \
        (SELECT DISTINCT t1.place_id, t1.place_name, t1.review_id, t1.rating, t1.review_content \
        FROM review t1 \
        JOIN (SELECT DISTINCT word FROM review_category WHERE category_name=?) t2 \
        ON t1.review_content LIKE CONCAT('%',word,'%') \
        WHERE place_id=?) AS t", [category, place]);

    if (reviewService.length === 0) {
        // return {error: 'Invalid Access Token'};
        return {result: 'Not Found'};
    } else {
        // console.log(results); // check
        return reviewService;
    }
};

const getReviewEnvironment = async (category, place) => {
    console.log('In model');
    console.log(category, place);
    const reviewEnvironment = await query(
      "SELECT t.place_id, t.place_name, COUNT(DISTINCT t.review_id) AS total_cnt, \
        SUM(CASE WHEN t.rating IN (4,5) THEN 1 ELSE 0 END) AS positvie_cnt, \
        SUM(CASE WHEN t.rating IN (3) THEN 1 ELSE 0 END) AS neutral_cnt, \
        SUM(CASE WHEN t.rating IN (1,2) THEN 1 ELSE 0 END) AS negative_cnt \
       FROM \
        (SELECT DISTINCT t1.place_id, t1.place_name, t1.review_id, t1.rating, t1.review_content \
        FROM review t1 \
        JOIN (SELECT DISTINCT word FROM review_category WHERE category_name=?) t2 \
        ON t1.review_content LIKE CONCAT('%',word,'%') \
        WHERE place_id=?) AS t", [category, place]);

    if (reviewEnvironment.length === 0) {
        // return {error: 'Invalid Access Token'};
        return {result: 'Not Found'};
    } else {
        // console.log(results); // check
        return reviewEnvironment;
    }
};

const getReviewContentByPlace = async (place) => {
    // console.log('In model getReviewContentBtPlac');
    // console.log(place);
    const reviewContents = await query(
      "SELECT t.place_id, t.review_id, t.user_name, t.review_content, t.rating, t.rel_date \
       FROM review AS t\
       WHERE t.place_id=?", [place]);

    if (reviewContents.length === 0) {
        return {result: 'Not Found'};
    } else {
        // console.log(results); // check
        return reviewContents;
    }
};

const getPlaceTags = async (place) => {
    // console.log('In model getReviewContentBtPlac');
    // console.log(place);
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

module.exports = {
    getReviewService,
    getReviewEnvironment,
    getReviewContentByPlace,
    getPlaceTags,
};