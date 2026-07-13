const orderService = require("../services/orderService");

exports.createOrder = async (req, res) => {
    try {
        const { user_id, total } = req.body;

        const order = await orderService.createOrder(user_id, total);

        res.status(201).json(order);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }
};

exports.getOrders = async (req, res) => {

    try {

        const orders = await orderService.getOrders();

        res.json(orders);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

exports.getOrder = async (req, res) => {

    try {

        const order = await orderService.getOrderById(req.params.id);

        if (!order)
            return res.status(404).json({
                message: "Order not found"
            });

        res.json(order);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

exports.updateStatus = async (req, res) => {

    try {

        const order = await orderService.updateStatus(
            req.params.id,
            req.body.status
        );

        if (!order)
            return res.status(404).json({
                message: "Order not found"
            });

        res.json(order);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};

exports.getHistory = async (req, res) => {

    try {

        const history = await orderService.getUserHistory(req.params.userId);

        res.json(history);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

};