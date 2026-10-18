import jwt from "jsonwebtoken"
import config from "../config/config.js";

const createToken = (data) => {
    const token = jwt.sign(data, config.jwtSecret, {expiresIn: '30d'});
    return token;
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwtSecret);
};

// In JWT authentication, jwt.verify() normally returns the decoded payload, not a Boolean value.
// const verifyToken = (token) => {
//     try {
//         jwt.verify(token, config.jwtSecret);
//         return true;
//     } catch (error) {
//         return false;
//     }
// };
 
export default {createToken, verifyToken};