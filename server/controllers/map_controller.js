require('dotenv').config();
// const validator = require('validator');
// const User = require('../models/user_model');
// const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds

const getReviews = async (req, res) => {
  // if(!music){
  //     return {error: 'Request Error: music are required.', status: 400};
  // }

  // try {
  //     return await User.nativeSignIn(email, password, expire);
  // } catch (error) {
  //     return {error};
  // }
  console.log('here in reiviews');

  res.status(200).send({
    data: {
        "music": "lalala",
    }
  });

};

module.exports = {
    // signUp,
    // signIn,
    // getUserProfile,
    getReviews
};
