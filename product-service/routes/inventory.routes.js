const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventory.controller");

router.get(["/", "/inventory"], controller.getInventory);

router.get(["/:productId", "/inventory/:productId"], controller.getInventoryItem);

router.post(["/", "/inventory"], controller.createInventoryItem);

router.patch(["/:productId", "/inventory/:productId"], controller.updateQuantity);

router.delete(["/:productId", "/inventory/:productId"], controller.deleteInventoryItem);

module.exports = router;