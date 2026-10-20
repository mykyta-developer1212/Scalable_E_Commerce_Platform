require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const USER_URL = process.env.USER_URL;
const PRODUCT_URL = process.env.PRODUCT_URL;
const ORDER_URL = process.env.ORDER_URL;

if (!USER_URL || !PRODUCT_URL || !ORDER_URL) {
    console.error(
        "Помилка: USER_URL, PRODUCT_URL та ORDER_URL мають бути в .env"
    );
}

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

            console.log(
                `Retry ${i + 1}/${attempts}:`,
                error.message
            );

            if (i < attempts - 1) {
                await new Promise(resolve =>
                    setTimeout(resolve, 1000)
                );
            }
        }
    }

    throw lastError;
}

async function proxyRequest(res, url, options = {}) {
    try {
        console.log("Request:", url);

        const response = await fetchRetry(url, options);

        console.log(
            "Status:",
            response.status,
            response.statusText
        );

        if (response.status === 204) {
            return res.status(204).end();
        }

        const contentType =
            response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const data = await response.json();

            return res.status(response.status).json(data);
        }

        const text = await response.text();

        if (!response.ok) {
            console.error(
                "Service returned:",
                text.substring(0, 500)
            );
        }

        return res.status(response.status).send(text);
    } catch (error) {
        console.error("Gateway error:", error);

        if (error.name === "AbortError") {
            return res.status(504).json({
                message: "Service timeout"
            });
        }

        return res.status(503).json({
            message: "Service temporarily unavailable",
            error: error.message
        });
    }
}

function deletionForbidden(req, res) {
    return res.status(403).json({
        message: "Deleting products and orders is forbidden"
    });
}

app.get("/", (req, res) => {
    res.json({
        message: "API Gateway is running"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "API Gateway working"
    });
});

app.post("/users/register", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/register`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.post("/users/login", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.get("/users", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/users`
    );
});

app.get("/users/:id", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/users/${encodeURIComponent(req.params.id)}`
    );
});

app.put("/users/:id", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/users/${encodeURIComponent(req.params.id)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.delete("/users/login/:login", async (req, res) => {
    const login = req.params.login;

    if (!login || !login.trim()) {
        return res.status(400).json({
            message: "Login is required"
        });
    }

    await proxyRequest(
        res,
        `${USER_URL}/users/login/${encodeURIComponent(login)}`,
        {
            method: "DELETE"
        }
    );
});

app.get("/profile", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/profile`,
        {
            headers: {
                Authorization: req.headers.authorization || ""
            }
        }
    );
});

app.put("/profile", async (req, res) => {
    await proxyRequest(
        res,
        `${USER_URL}/profile`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: req.headers.authorization || ""
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.get("/products", async (req, res) => {
    await proxyRequest(
        res,
        `${PRODUCT_URL}/products`
    );
});

app.get("/products/:id", async (req, res) => {
    await proxyRequest(
        res,
        `${PRODUCT_URL}/products/${encodeURIComponent(req.params.id)}`
    );
});

app.post("/products", async (req, res) => {
    await proxyRequest(
        res,
        `${PRODUCT_URL}/products`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.put("/products/:id", async (req, res) => {
    await proxyRequest(
        res,
        `${PRODUCT_URL}/products/${encodeURIComponent(req.params.id)}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.delete("/products/:id", deletionForbidden);

app.get("/orders", async (req, res) => {
    await proxyRequest(
        res,
        `${ORDER_URL}/orders`
    );
});

app.get("/orders/:id", async (req, res) => {
    await proxyRequest(
        res,
        `${ORDER_URL}/orders/${encodeURIComponent(req.params.id)}`
    );
});

app.post("/orders", async (req, res) => {
    await proxyRequest(
        res,
        `${ORDER_URL}/orders`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.put("/orders/:id/status", async (req, res) => {
    await proxyRequest(
        res,
        `${ORDER_URL}/orders/${encodeURIComponent(req.params.id)}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );
});

app.delete("/orders/:id", deletionForbidden);

module.exports = app;