import { Context } from "hono";
import { ProductService } from "./service.js";

export class ProductController {
  static async allProducts(c: Context) {
    const products = await ProductService.allProducts();
    return c.json(products);
  }
}
