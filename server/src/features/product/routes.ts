import { Routes } from "../../class/RouterClass.js";
import { ProductController } from "./controller.js";

const { router: productRoutes } = new Routes([
  {
    path: "/",
    description: "Get all active products",
    method: "get",
    tags: ["Products"],
    responses: {
      200: {
        content: { "application/json": { schema: {} } },
        description: "List of active products",
      },
    },
    controllerFN: ProductController.getProducts,
  },
]);

export { productRoutes };
