const db = require("../db/db");

async function getAllProducts() {
    const result = await db.query(
        "SELECT * FROM products ORDER BY id ASC"
    );

    return result.rows;
}

async function getProductById(id) {
    const result = await db.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    return result.rows[0];
}

module.exports = {
    getAllProducts,
    getProductById
};