const {query, transaction, commit, rollback} = require('./mysqlcon');

const getReviews = async (food) => {
  // const results = await query("SELECT * FROM review WHERE review_content LIKE ?", ['%'+food+'%']);
  const results = await query("SELECT place_id, place_name, count(review_id) AS review_count FROM review WHERE review_content LIKE ? GROUP BY place_id", ['%'+food+'%']);
  if (results.length === 0) {
      // return {error: 'Invalid Access Token'};
      return {result: 'Not Found'};
  } else {
      // console.log(results); // check
      return results;
  }
};
// console.log(getReviews('牛'));
// console.log('HERE');

module.exports = {
    getReviews,
};