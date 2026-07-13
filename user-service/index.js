const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("./db/db");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3001;
const SECRET = "mySecretKey";

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exists = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users(name, email, password)
            VALUES($1, $2, $3)
            RETURNING id, name, email
            `,
            [name, email, hash]
        );

        console.log("New user registered:", result.rows[0]);

        res.status(201).json({
            message: "User registered",
            user: result.rows[0]
        });

    } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
        message: error.message
    });

    }
});

app.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1",
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const ok = await bcrypt.compare(
            password,
            user.password
        );

        if (!ok) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            SECRET,
            {
                expiresIn: "1h"
            }
        );

        console.log("User login:", user.email);

        res.json({
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

function auth(req, res, next) {

    const header = req.headers.authorization;

    if (!header) {
        return res.status(401).json({
            message: "Token required"
        });
    }

    const token = header.split(" ")[1];

    try {

        req.user = jwt.verify(
            token,
            SECRET
        );

        next();

    } catch {

        res.status(401).json({
            message: "Invalid token"
        });

    }
}

app.get("/profile", auth, async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id=$1",
            [req.user.id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch(error) {

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

});


app.put("/profile", auth, async (req, res) => {

    try {

        const { name, email } = req.body;

        const result = await pool.query(
            `
            UPDATE users
            SET 
                name = COALESCE($1,name),
                email = COALESCE($2,email)
            WHERE id=$3
            RETURNING id,name,email
            `,
            [
                name,
                email,
                req.user.id
            ]
        );

        console.log("Profile updated:", result.rows[0]);

        res.json({
            message:"Profile updated",
            user: result.rows[0]
        });

    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

});

app.get("/users", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT id, name, email FROM users"
        );

        console.log("Users:", result.rows);

        res.json(result.rows);

    } catch(error){

        console.log(error);

        res.status(500).json({
            message:"Server error"
        });

    }

});

app.get("/users/:id", async (req, res) => {

    try {

        const result = await pool.query(
            "SELECT id, name, email FROM users WHERE id = $1",
            [req.params.id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

app.delete("/users/:id", async (req, res) => {

    try {

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "User deleted",
            user: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });

    }

});

app.get("/health", (req, res) => {
    res.json({
        status: "User Service working"
    });
});

app.listen(PORT, () => {
    console.log(`User Service running on ${PORT}`);
});