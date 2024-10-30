import { loginUser, logout, registerUser } from './auth';
import { loadProductsFromCart } from './cart';
import { createUpdateProduct, getProductBySlug, getProductsByPage } from './products';

export const server = {
  // actions

  // Auth
  loginUser,
  logout,
  registerUser,

  getProductsByPage,
  getProductBySlug,

  loadProductsFromCart,
  createUpdateProduct
};
