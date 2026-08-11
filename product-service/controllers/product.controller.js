const service = require("../services/product.service");

async function getProducts(req, res) {
    try {
        const data = await service.getAllProducts();

        res.json(data);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "DB error"
        });
    }
}

async function getProduct(req, res) {
    try {
        const data = await service.getProductById(req.params.id);

        if (!data) {
            return res.status(404).json({
                error: "Product not found"
            });
        }

        res.json(data);
    } catch (err) {
        console.error(err);

        res.status(500).json({
            error: "DB error"
        });
    }
}

module.exports = {
    getProducts,
    getProduct
};