import { success } from "zod";
import productService from "../services/product.service.js";
import uploadFile from "../utils/fileUploader.js";

const getAllProducts = async (req, res) => {
  // console.log(req.query);
  try {
    const products = await productService.getAllProducts(req.query);

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully.",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve products.",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully.",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve product.",
    });
  }
};

const createProduct = async (req, res) => {
  const userId = req.user._id;
  // console.log(userId);

  const files = req.files;
  // console.log(files)

  try {
    const product = await productService.createProduct(req.body, files, userId);

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
    res.json(uploadedFiles);
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to create product.",
    });
  }
};

const updateProduct = async (req, res) => {
  const id = req.params.id;
  const input = req.body;
  
  try {
    const product = await productService.updateProduct(id, input, req.files);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update product.",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.deleteProduct(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete product.",
    });
  }
};

const getBrands = async (req, res) => {
  try {
    const brands = await productService.getBrands();
    return res.status(200).json({
      success: true,
      message: "Brands rettrieved succesfully.",
      count: brands.length,
      brands,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve brands.",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully.",
      count: categories.length,
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve categories.",
    });
  }
};

const getTotalCount = async (req, res) => {
  try {
    const totalCount = await productService.getTotalCount();
    return res.status(200).json({
      success: true,
      message: "Successfull to count total number of products",
      Count_Of_Products: totalCount,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to count number of products.",
    });
  }
};

export default {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getBrands,
  getCategories,
  getTotalCount,
};
