const mongoose = require('mongoose');

const customerSchema = mongoose.Schema({
    name: {
        type: String
    },
    phone: {
        type: Number
    },
    isGold: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model("Customer", customerSchema);