const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema({
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    address: String,
    tel: String,
    password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Client", ClientSchema);