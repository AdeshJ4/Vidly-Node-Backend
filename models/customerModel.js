const mongoose = require('mongoose');
const Joi = require ('joi');

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50 
    },
    phone: {
        type: Number,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false
    }
});


function validateCustomer (customer){
    const joiSchema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean().required()
    });

    return joiSchema.validate(customer);
}

exports.customerSchema = customerSchema;
exports.Customer = mongoose.model("Customer", customerSchema);
exports.validateCustomer = validateCustomer;