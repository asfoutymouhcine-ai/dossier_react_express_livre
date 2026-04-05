const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    orderDate: { type: Date, default: Date.now },
    status: { type: String, default: "pending" },
    total: Number,

    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },

    items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "OrderItem"
        }
    ]
});

module.exports = mongoose.model("Order", OrderSchema);