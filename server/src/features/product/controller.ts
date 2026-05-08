import { Context } from "hono";
import { ProductService } from "./service.js";

export class ProductController {
  static async getProducts(c: Context) {
    const products = await ProductService.getAllProducts();
    return c.json(products);
  }
}
