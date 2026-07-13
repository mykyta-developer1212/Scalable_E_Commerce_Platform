const service = require("../services/product.service");

async function getProducts(req, res) {
  try {
    const data = await service.getAllProducts();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function getProduct(req, res) {
  try {
    const data = await service.getProductById(req.params.id);

    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function createProduct(req, res) {
  try {
    const data = await service.createProduct(req.body);
    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function updateProduct(req, res) {
  try {
    const data = await service.updateProduct(req.params.id, req.body);

    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function deleteProduct(req, res) {
  try {
    await service.deleteProduct(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};