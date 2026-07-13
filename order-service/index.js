require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const orderRoutes = require("./routes/orderRoutes");

app.use("/orders", orderRoutes);

const PORT = process.env.PORT || 3003;

app.get("/health", (req, res) => {
    res.json({
        status: "User Service working"
    });
});

app.listen(PORT, () => {
    console.log(`Order Service running on ${PORT}`);
});