import { fi } from "zod/v4/locales";
import Product from "../models/Product.js";
import uploadFile from "../utils/fileUploader.js";

const getAllProducts = async (query) => {
  // console.log(query.sort);
  // query.sort comes from the URL as a string, but Mongoose's .sort() expects a sort specification, such as an object.
  const sort = query.sort ? JSON.parse(query.sort) : { price: 1 };
  const limit = query.limit ?? 10;
  const offset = query.offset ?? 0;

  const { category, brands, name, min, max, createdBy } = query;

  const filters = {};

  // const filters = category ? { category } : {};
  if (category) {
    filters.category = category;
  }

  if (brands) {
    filters.brand = {
      $in: brands.split(","),
    };
  }

  if (name) {
    filters.name = {
      $regex: name,
      $options: "i",
    };
  }

  if (min) filters.price = { $gte: min };
  if (max) filters.price = { ...filters.price, $lte: max };

  if (createdBy) filters.createdBy = createdBy;

  const products = await Product.find(filters)
    .sort(sort)
    .limit(limit)
    .skip(offset);
  return products;
};

// const getFristProduct = async () => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users");
//     const firstProduct = await response.json();
//     return firstProduct[0];
// }

// const getProductById = async(id) => {
//     const response = await fetch("https://jsonplaceholder.typicode.com/users");
//     const products = await response.json();
//     const productByID = products.find((product) => product.id == id);
//     return productByID;
// }

const getProductById = async (id) => {
  const product = await Product.findById(id);
  return product;
};
 
const createProduct = async (data, files, userId) => {
  const uploadFiles = await uploadFile(files);
  console.log(uploadFiles);

  return await Product.create({
    ...data,
    imageUrls: uploadFiles.map((file) => file.url),
    createdBy: userId,
  });
};

const updateProduct = async (id, input, files) => {
  const updatedData = input;
  
  if(files && files.lenght > 0){
    const uploadFiles = await uploadFile(files);
    updatedData.imageUrls = uploadFiles.map((file) => file.url);
  }
  return await Product.findByIdAndUpdate(
    id, 
    updatedData,
    {returnDocument: "after"});
};

const deleteProduct = async (id) => {
  await Product.findByIdAndDelete(id);
};

const getBrands = async () => {
  return await Product.distinct("brand");
};

const getCategories = async () => {
  return await Product.distinct("category");
};

const getTotalCount = async () => {
  return await Product.countDocuments();
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
