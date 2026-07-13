const service = require("../services/inventory.service");

async function getInventory(req, res) {
  try {
    const data = await service.getInventory();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function getInventoryItem(req, res) {
  try {
    const data = await service.getInventoryItem(req.params.productId);

    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function updateQuantity(req, res) {
  try {
    const { quantity } = req.body;

    const data = await service.updateQuantity(
      req.params.productId,
      quantity
    );

    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function createInventoryItem(req, res) {
  try {
    const { productId, quantity } = req.body;

    const data = await service.createInventoryItem(productId, quantity);

    res.status(201).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

async function deleteInventoryItem(req, res) {
  try {
    await service.deleteInventoryItem(req.params.productId);

    res.json({ message: "Inventory item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB error" });
  }
}

module.exports = {
  getInventory,
  getInventoryItem,
  updateQuantity,
  createInventoryItem,
  deleteInventoryItem
};