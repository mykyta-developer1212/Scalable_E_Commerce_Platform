require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

const USER_URL = process.env.USER_URL;
const PRODUCT_URL = process.env.PRODUCT_URL;
const ORDER_URL = process.env.ORDER_URL;

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

            const response = await fetchWithTimeout(
                url,
                options,
                10000
            );

            return response;

        } catch (error) {

            lastError = error;

            console.log(
                `Retry ${i + 1}/${attempts}:`,
                error.message
            );

            await new Promise(resolve =>
                setTimeout(resolve, 1000)
            );

        }

    }

    throw lastError;

}

async function proxyRequest(res, url, options = {}) {

    try {

        console.log("Request:", url);

        const response = await fetchRetry(
            url,
            options
        );

        console.log(
            "Status:",
            response.status,
            response.statusText
        );

        const contentType =
            response.headers.get("content-type");

        if (
            contentType &&
            contentType.includes("application/json")
        ) {

            const data = await response.json();

            return res
                .status(response.status)
                .json(data);

        }

        const text = await response.text();

        console.error(
            "Service returned:",
            text.substring(0, 500)
        );

        return res
            .status(response.status)
            .send(text);

    } catch (error) {

        console.error(
            "Gateway error:",
            error
        );

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
        `${USER_URL}/users/${req.params.id}`
    );

});

app.put("/users/:id", async (req, res) => {

    await proxyRequest(
        res,
        `${USER_URL}/users/${req.params.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );

});

app.delete("/users/:id", async (req, res) => {

    await proxyRequest(
        res,
        `${USER_URL}/users/${req.params.id}`,
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
                Authorization: req.headers.authorization
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
                Authorization: req.headers.authorization
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
        `${PRODUCT_URL}/products/${req.params.id}`
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
        `${PRODUCT_URL}/products/${req.params.id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );

});

app.delete("/products/:id", async (req, res) => {

    await proxyRequest(
        res,
        `${PRODUCT_URL}/products/${req.params.id}`,
        {
            method: "DELETE"
        }
    );

});

app.get("/orders", async (req, res) => {

    await proxyRequest(
        res,
        `${ORDER_URL}/orders`
    );

});

app.get("/orders/:id", async (req, res) => {

    await proxyRequest(
        res,
        `${ORDER_URL}/orders/${req.params.id}`
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
        `${ORDER_URL}/orders/${req.params.id}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req.body)
        }
    );

});

app.delete("/orders/:id", async (req, res) => {

    await proxyRequest(
        res,
        `${ORDER_URL}/orders/${req.params.id}`,
        {
            method: "DELETE"
        }
    );

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `API Gateway running on ${PORT}`
    );

});