const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");

router.post("/", controller.createOrder);

router.get("/", controller.getOrders);

router.get("/:id", controller.getOrder);

router.put("/:id/status", controller.updateStatus);

router.get("/user/:userId", controller.getHistory);

module.exports = router;