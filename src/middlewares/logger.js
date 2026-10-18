const logger = (req, res, next) => {
    const url = req.originalUrl;
    const method = req.method;
    console.log(`URL: ${url} Method: ${method}`);

    next();
};

export default logger; 