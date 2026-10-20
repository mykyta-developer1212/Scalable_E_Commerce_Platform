const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");

router.get("/", controller.getOrders);

router.get("/:id", controller.getOrder);

router.get("/user/:userId", controller.getHistory);

module.exports = router;