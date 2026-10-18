const roleBasedAuth = (role) => (req, res, next) => {
    // console.log(req.user);

    if(req.user.roles.includes(role)) return next();
    res.status(403).send("Access denied.")
};

export default roleBasedAuth;