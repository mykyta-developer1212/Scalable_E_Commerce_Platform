const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventory.controller");

router.get("/", controller.getInventory);

router.get("/:productId", controller.getInventoryItem);

router.post("/", controller.createInventoryItem);

router.patch("/:productId", controller.updateQuantity);

router.delete("/:productId", controller.deleteInventoryItem);

module.exports = router;