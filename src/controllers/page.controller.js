import productService from "../services/product.service.js";

const getHomeView =  (req, res) => {
    const name = req.user.name;
    res.render("index", {
        name
    });
};

const getProductsView = async (req, res) => {
    const products = await productService.getAllProducts({});
    res.render("products", {
        products
    });
};

export default {getHomeView, getProductsView};