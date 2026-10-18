import jwt from "../utils/jwt.js"

const auth = (req, res, next) => {
    const cookie = req.headers.cookie;

    if(!cookie){
        return res.status(401).json({
            success: false, 
            message: "User not authenticated."
        })
    }
    const token = cookie.split("=")[1];

    if(!token){
        return res.status(401).json({
            success: false, 
            message: "user not authenticated."
        })
    }

    try {
        const data = jwt.verifyToken(token);
        req.user = data;
        next();

    } catch (error) {
        res.status(401).json({
            success: false, 
            message: "Invalid token!"
        })
    }
    // console.log(token);

    
};

export default auth;