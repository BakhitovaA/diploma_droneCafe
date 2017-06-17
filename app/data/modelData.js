const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    name: String,
    email: String,
    balance: Number
});

const MealSchema = new Schema({
    title: String,
    image: String,
    rating: Number,
    ingredients: [String],
    price: Number
});

const OrderSchema = new Schema({
    userId: mongoose.Schema.ObjectId,
    mealId: mongoose.Schema.ObjectId,
    status: String,
    price: Number
});

const Client = mongoose.model('Client', ClientSchema, 'clients');
const Meal = mongoose.model('Meal', MealSchema, 'meals');
const Order = mongoose.model('Order', OrderSchema, 'orders');

module.exports = {
    Client,
    Meal,
    Order
};