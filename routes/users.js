const express = require('express');
const { NotExtended } = require('http-errors');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const Order = require('../models/order');
var Cart = require('../models/cart');
const catchAsync = require('../utils/catchAsync');

router.get('/register', catchAsync(async (req, res) => {
    res.render('user/register');
}));

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Shop-Flix')
            res.redirect('/products');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', catchAsync(async (req, res) => {
    res.render('user/login');
}));


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async (req, res) => {
    req.flash('success', "Welcome to Shop-Flix");
    const redirectUrl = req.session.returnTo || '/products';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}));

router.get('/logout', catchAsync(async (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        req.flash('success', "Goodbye!");
        res.redirect('/products');
    });
}));

router.get('/orders', (req, res) => {
    Order.find({ user: req.user }, function (err, orders) {
        if (err) {
            return res.write('Error!')
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        return res.render('user/orders', { orders: orders });
    });
});

module.exports = router;