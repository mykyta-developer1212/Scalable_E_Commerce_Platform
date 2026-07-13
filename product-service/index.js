require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

app.use("/products", require("./routes/product.routes"));
app.use("/categories", require("./routes/category.routes"));
app.use("/inventory", require("./routes/inventory.routes"));

const PORT = process.env.PORT || 3002;

app.get("/health", (req, res) => {
    res.json({
        status: "User Service working"
    });
});

app.listen(PORT, () => {
    console.log(`Product service running on ${PORT}`);
});