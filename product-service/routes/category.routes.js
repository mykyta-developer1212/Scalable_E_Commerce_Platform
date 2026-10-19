const express = require("express");
const router = express.Router();

const controller = require("../controllers/category.controller");

router.get(["/", "/categories"], controller.getCategories);

router.get(["/:id", "/categories/:id"], controller.getCategory);

router.post(["/", "/categories"], controller.createCategory);

router.put(["/:id", "/categories/:id"], controller.updateCategory);

router.delete(["/:id", "/categories/:id"], controller.deleteCategory);

module.exports = router;