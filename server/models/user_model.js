require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {query, transaction, commit, rollback} = require('./mysqlcon');
const salt = parseInt(process.env.BCRYPT_SALT);

const signUp = async (name, email, password, expire) => {
    try {
        await transaction();

        const emails = await query('SELECT email FROM user WHERE email = ? FOR UPDATE', [email]);
        if (emails.length > 0){
            await commit();
            return {error: 'Email Already Exists'};
        }

        const loginAt = new Date();

        const user = {
            provider: 'native',
            email: email,
            password: bcrypt.hashSync(password, salt),
            name: name
        };
        const queryStr = 'INSERT INTO user SET ?';

        const result = await query(queryStr, user);
        user.id = result.insertId;

        await commit();

        // JWT
        const userinfo = {
            id: result.insertId, 
            provider: user.provider,
            name: user.name,
            email: user.email
        };
        const accessToken = jwt.sign({userinfo}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' }) // 30 days
        // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10800s' }) // 3 hrs 

        return {accessToken, loginAt, user};
    } catch (error) {
        await rollback();
        return {error};
    }
};

const nativeSignIn = async (email, password, expire) => {
    try {
        await transaction();

        const users = await query('SELECT * FROM user WHERE email = ?', [email]);
        const user = users[0];

        if (!bcrypt.compareSync(password, user.password)){
            await commit();
            return {error: 'Password is wrong'};
        }

        const loginAt = new Date();

        await commit();
     
        // JWT
        const userinfo = {
          id: user.id, 
          provider: user.provider,
          name: user.name,
          email: user.email
        };
        const accessToken = jwt.sign({userinfo}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30d' }) // 30 days
        // const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10800s' }) // 3 hrs 

        return {accessToken, loginAt, user};
    } catch (error) {
        await rollback();
        return {error};
    }
};

const likePlace = async (user, place) => {
    try {
        await transaction();
      
        const userlike = {
          user_id: user,
          place_id: place,
          status: 1
        };
      
        const queryStr = 'INSERT INTO user_like SET ?';
      
        const like = await query(queryStr, userlike);
        userlike.id = like.insertId;
      
        await commit();

        const placeInfo = await query(
            "SELECT t1.place_id, t1.place_name, t1.place_lat, t1.place_lng \
            FROM place AS t1 \
            WHERE t1.place_id=?", [place]);

        if (placeInfo.length === 0){
            await commit();
            return {error: 'Not Found'};
        }

        userlike.place_name = placeInfo[0].place_name;
        userlike.place_lat = placeInfo[0].place_lat;
        userlike.place_lng = placeInfo[0].place_lng;
      
        return userlike;

    } catch (error) {
        await rollback();
        return {error};
    }
};

module.exports = {
    signUp,
    nativeSignIn,
    likePlace,
};