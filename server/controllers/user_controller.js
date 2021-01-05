require('dotenv').config();
const validator = require('validator');
const jwt = require("jsonwebtoken");
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
                email: user.email
            }
        }
    });
};

const getUserInfo = async (req, res) => {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];

  if(typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;

    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
      if(err) {
        res.status(403).send({error: 'Wrong Request: invalid access token.'});
      } else {
        res.status(200).json({
          data: authData
        });
      }
    });
  } else {
    res.status(400).send({error: 'Wrong Request: authorization is required.'});
		return;
  }
};

const likePlace = async (req, res) => {
    let {user} = req.body;
    let {place} = req.body;
    if(!user||!place){
        return {error: 'Request Error: user and place is required.', status: 400};
    }
    const likeplace =  await User.likePlace(user, place);
    res.status(200).send({data: likeplace});
};

module.exports = {
    signUp,
    signIn,
    getUserInfo,
    likePlace
};
