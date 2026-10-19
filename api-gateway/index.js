require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());

const USER_URL = process.env.USER_URL ? process.env.USER_URL.replace(/\/\$/, "") : "";
const PRODUCT_URL = process.env.PRODUCT_URL ? process.env.PRODUCT_URL.replace(/\/\$/, "") : "";
const ORDER_URL = process.env.ORDER_URL ? process.env.ORDER_URL.replace(/\/\$/, "") : "";

async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => {
        controller.abort();
    }, timeout);

    try {
        return await fetch(url, {
            ...options,
            signal: controller.signal
        });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchRetry(url, options = {}, attempts = 2) {
    let lastError;
    for (let i = 0; i < attempts; i++) {
        try {
            return await fetchWithTimeout(url, options, 10000);
        } catch (error) {
            lastError = error;
            console.log(`Retry ${i + 1}/${attempts}:`, error.message);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    throw lastError;
}

async function proxyRequest(res, url, options = {}) {
    try {
        console.log("Request:", url);
        const response = await fetchRetry(url, options);
        console.log("Status:", response.status, response.statusText);

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            return res.status(response.status).json(data);
        }

        const text = await response.text();
        console.error("Service returned:", text.substring(0, 500));
        return res.status(response.status).send(text);
    } catch (error) {
        console.error("Gateway error:", error);
        if (error.name === "AbortError") {
            return res.status(504).json({ message: "Service timeout" });
        }
        return res.status(503).json({
            message: "Service temporarily unavailable",
            error: error.message
        });
    }
}

app.get("/", (req, res) => {
    res.json({ message: "API Gateway is running" });
});

app.get("/health", (req, res) => {
    res.json({ status: "API Gateway working" });
});

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

usersRouter.post("/login", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

usersRouter.get("/profile", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/profile`, {
        headers: { Authorization: req.headers.authorization }
    });
});

usersRouter.put("/profile", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/profile`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: req.headers.authorization
        },
        body: JSON.stringify(req.body)
    });
});

usersRouter.get("/", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/users`);
});

usersRouter.get("/:id", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/users/${req.params.id}`);
});

usersRouter.put("/:id", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/users/${req.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

usersRouter.delete("/:id", async (req, res) => {
    await proxyRequest(res, `${USER_URL}/users/${req.params.id}`, {
        method: "DELETE"
    });
});

app.use("/users", usersRouter);

const productsRouter = express.Router();

productsRouter.get("/", async (req, res) => {
    await proxyRequest(res, `${PRODUCT_URL}/products`);
});

productsRouter.get("/:id", async (req, res) => {
    await proxyRequest(res, `${PRODUCT_URL}/products/${req.params.id}`);
});

productsRouter.post("/", async (req, res) => {
    await proxyRequest(res, `${PRODUCT_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

productsRouter.put("/:id", async (req, res) => {
    await proxyRequest(res, `${PRODUCT_URL}/products/${req.params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

productsRouter.delete("/:id", async (req, res) => {
    await proxyRequest(res, `${PRODUCT_URL}/products/${req.params.id}`, {
        method: "DELETE"
    });
});

app.use("/products", productsRouter);

const ordersRouter = express.Router();

ordersRouter.get("/", async (req, res) => {
    await proxyRequest(res, `${ORDER_URL}/orders`);
});

ordersRouter.get("/:id", async (req, res) => {
    await proxyRequest(res, `${ORDER_URL}/orders/${req.params.id}`);
});

ordersRouter.post("/", async (req, res) => {
    await proxyRequest(res, `${ORDER_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

ordersRouter.put("/:id/status", async (req, res) => {
    await proxyRequest(res, `${ORDER_URL}/orders/${req.params.id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body)
    });
});

ordersRouter.delete("/:id", async (req, res) => {
    await proxyRequest(res, `${ORDER_URL}/orders/${req.params.id}`, {
        method: "DELETE"
    });
});

app.use("/orders", ordersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API Gateway running on ${PORT}`);
});

module.exports = app;