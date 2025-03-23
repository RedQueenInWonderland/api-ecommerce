import axios from "axios";
import { ProductType } from "../types/products.interface";

//api สำหรับเพิ่ม products
export const addProduct = async (product: ProductType) => {
  try {
    const res = await axios.post('/api/products', {
      name: product.name,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
    return res;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to add product');
  }
};

// api สำหรับเรียก products ออกมาดู
export const getProduct = async () => {
  try {
    const res = await axios('api/products');
    return res;
  } catch (error) {
    console.error('Error adding product:', error);
    throw new Error('Failed to get product');
  }
};