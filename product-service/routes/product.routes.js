const express = require("express");

const router = express.Router();

const controller = require("../controllers/product.controller");

router.get(["/", "/products"], controller.getProducts);
router.get(["/:id", "/products/:id"], controller.getProduct);

module.exports = router;