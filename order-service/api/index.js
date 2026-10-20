require("dotenv").config();
const express = require("express");

const app = express();

app.use(express.json());

const orderRoutes = require("../routes/orderRoutes");
app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3003;

app.get("/health", (req, res) => {
    res.json({
        status: "Order Service working!"
    });
});

module.exports = app;