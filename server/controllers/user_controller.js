require('dotenv').config();
const validator = require('validator');
const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
const User = require('../models/user_model');
const expire = process.env.TOKEN_EXPIRE; // 30 days by seconds

const signUp = async (req, res) => {
    let {name} = req.body;
    const {email, password} = req.body;

    if(!name || !email || !password) {
        res.status(400).send({error:'Request Error: name, email and password are required.'});
        return;
    }

    if (!validator.isEmail(email)) {
        res.status(400).send({error:'Request Error: Invalid email format'});
        return;
    }

    name = validator.escape(name);

    const result = await User.signUp(name, email, password, expire);
    if (result.error) {
        res.status(403).send({error: result.error});
        return;
    }

    const {accessToken, loginAt, user} = result;

    if (!user) {
        res.status(500).send({error: 'Database Query Error'});
        return;
    }

    res.status(200).send({
        data: {
            access_token: accessToken,
            access_expired: expire,
            login_at: loginAt,
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email
            }
        }
    });
};

const nativeSignIn = async (email, password) => {
    if(!email || !password){
        return {error: 'Request Error: email and password are required.', status: 400};
    }

    try {
        return await User.nativeSignIn(email, password, expire);
    } catch (error) {
        return {error};
    }
};

// const facebookSignIn = async (accessToken) => {
//     if (!accessToken) {
//         return {error: 'Request Error: access token is required.', status: 400};
//     }

//     try {
//         const profile = await User.getFacebookProfile(accessToken);
//         const {id, name, email} = profile;

//         if(!id || !name || !email){
//             return {error: 'Permissions Error: facebook access token can not get user id, name or email'};
//         }

//         return await User.facebookSignIn(id, name, email, accessToken, expire);
//     } catch (error) {
//         return {error: error};
//     }
// };

const signIn = async (req, res) => {
    const data = req.body;

    let result;
    switch (data.provider) {
        case 'native':
            result = await nativeSignIn(data.email, data.password);
            break;
        case 'facebook':
            result = await facebookSignIn(data.access_token);
            break;
        default:
            result = {error: 'Wrong Request'};
    }

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        res.status(status_code).send({error: result.error});
        return;
    }

    const {accessToken, loginAt, user} = result;
    if (!user) {
        res.status(500).send({error: 'Database Query Error'});
        return;
    }

    res.status(200).send({
        data: {
            access_token: accessToken,
            access_expired: expire,
            login_at: loginAt,
            user: {
                id: user.id,
                provider: user.provider,
                name: user.name,
                email: user.email,
                // picture: user.picture
            }
        }
    });
};

// const getUserProfile = async (req, res) => {
//   let accessToken = req.get('Authorization');
// 	if (accessToken) {
// 		accessToken = accessToken.replace('Bearer ', '');
// 	} else {
// 		res.status(400).send({error: 'Wrong Request: authorization is required.'});
// 		return;
//     }
//     const profile = await User.getUserProfile(accessToken);
//     if (profile.error) {
//         res.status(403).send({error: profile.error});
//         return;
//     } else {
//         res.status(200).send(profile);
//     }
// };

const getUserInfo = async (req, res) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  console.log("BearerHeader");
  console.log(bearerHeader);

  if(typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if(err) {
        // res.sendStatus(403);
        res.status(403).send({error: 'Wrong Request: invalid access token.'});
      } else {
        console.log(authData);
        // res.status(200).send({data: authData});
        res.status(200).json({
          data: authData
        });
      }
    });
  } else {
    // Forbidden
    // res.sendStatus(403);
    res.status(400).send({error: 'Wrong Request: authorization is required.'});
		return;
  }
};

const likePlace = async (req, res) => {
    let user = 1;
    // let place = 'ChIJC0ET6dGrQjQRXAeCB9_CIQ0';
    // let {user} = req.body;
    // console.log(place);
    let {place} = req.body;
    console.log('here:',place);
    if(!user||!place){
        return {error: 'Request Error: user and place is required.', status: 400};
    }
    const likeplace =  await User.likePlace(user, place);
    res.status(200).send({data: likeplace});
};

module.exports = {
    signUp,
    signIn,
    // getUserProfile,
    getUserInfo,
    likePlace
};
