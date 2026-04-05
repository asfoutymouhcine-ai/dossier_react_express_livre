const mongoose = require("mongoose");

const OrderItemSchema = new mongoose.Schema({
    quantity: { type: Number, required: true },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    }
});

module.exports = mongoose.model("OrderItem", OrderItemSchema);