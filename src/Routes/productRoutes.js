const express = require("express");
const router = express.Router();
const productController = require ("../controllers/productController");


//Endpoit manual
router.get("/", productController.getProductos);
router.post("/", productController.postProducto);
router.put("/:id", productController.updateProducto);
router.delete("/:id", productController.deleteProducto);

module.exports = router; 