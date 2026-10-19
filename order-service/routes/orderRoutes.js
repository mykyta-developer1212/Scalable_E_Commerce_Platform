const express = require("express");
const router = express.Router();

const controller = require("../controllers/orderController");

router.get(["/", "/orders"], controller.getOrders);

router.get(["/:id", "/orders/:id"], controller.getOrder);

router.get(["/user/:userId", "/orders/user/:userId"], controller.getHistory);

module.exports = router;