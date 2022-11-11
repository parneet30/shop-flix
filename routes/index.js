var express = require('express');
var router = express.Router();
var Product=require('../models/product');
const Review=require('../models/review');
const catchAsync=require('../utils/catchAsync');
var Cart=require('../models/cart');
const { render } = require('../app');
const cart = require('../models/cart');
const Order=require('../models/order');
const {isLoggedIn,isSeller,validateProduct,validateReview, isReviewAuthor}=require('../middleware');
const multer=require('multer');
const {storage}=require('../cloudinary');
const upload=multer({ storage });

const {cloudinary}=require("../cloudinary");

router.get('/',catchAsync(async(req,res)=>{
  res.render('shop/home');
}));

/* GET index page. */
router.get('/products', catchAsync(async(req, res) => {
  const products=await Product.find();
  res.render('shop/index', { title: 'Shopping Cart', products });
}));

router.post('/products',isLoggedIn,upload.array('image'),validateProduct,catchAsync(async(req,res)=>{
  const product=new Product(req.body.product);

  product.images =  req.files.map(f => ({url: f.path,filename: f.filename}));

  product.seller=req.user._id;
  await product.save();
  console.log(product);
  req.flash('success','Successfully made a new campground');
  res.redirect(`/products/${product._id}`);
}));

router.get('/products/new',isLoggedIn,catchAsync(async(req,res)=>{
  res.render('shop/new');
}));

router.get('/products/:id', catchAsync(async(req,res)=>{
  const {id}=req.params;
  const product=await Product.findById(id).populate('seller').populate({
    path:'reviews',
    populate:{
      path:'author'
    }
  });


  if(!product){
    req.flash('error','Cannot find that product');
    return res.redirect('/products');
  }
  res.render('shop/show',{product});
}));

router.get('/products/:id/edit',isLoggedIn,isSeller,catchAsync(async(req,res)=>{
  const {id}=req.params;
  const product=await Product.findById(id);
  if(!product){
    req.flash('error','Cannot find that product!');
    return res.redirect('/products');
  }
  res.render('shop/edit',{product});
}));

router.put('/products/:id',isLoggedIn,isSeller,upload.array('image'),validateProduct,(async(req,res)=>{
  const {id}=req.params;
  const product=await Product.findByIdAndUpdate(id,req.body.product);

  const imgs=req.files.map(f => ({url: f.path,filename: f.filename}));
  product.images.push(...imgs);
  await product.save();
  if(req.body.deleteImages) {
    for(let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await product.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    console.log(product);
  }
  req.flash('success','Successfully updated product');
  res.redirect(`/products/${product._id}`);
}));

router.delete('/products/:id',isLoggedIn,isSeller,async(req,res)=>{
  const {id}=req.params;
  await Product.findByIdAndDelete(id);
  req.flash('success','Successfully deleted product');
  res.redirect('/products');
});

// review paths

router.post('/products/:id/reviews',isLoggedIn,validateReview,catchAsync(async(req,res)=>{
  const product=await Product.findById(req.params.id);
  const review=new Review(req.body.review);
  review.author=req.user._id;
  product.reviews.push(review);
  await review.save();
  await product.save();
  req.flash('success','Review posted!');
  res.redirect(`/products/${product._id}`);
}));

router.delete('/products/:id/reviews/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async(req,res)=>{
  const{id,reviewId}=req.params;
  await Product.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash('success','Review Deleted!');
  res.redirect(`/products/${id}`);
}));

router.get('/add-to-cart/:id',catchAsync(async(req,res,next)=>{
  const productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  const product=await Product.findById(productId);
  if(!product){
    req.flash('error','Cannot find that product');
    return res.redirect('/products');
  }
  cart.add(product,productId);
  req.session.cart=cart;
  console.log(req.session.cart);
  res.redirect('/products');
}));

router.get('/reduce/:id',(req,res)=>{
  const productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id',(req,res)=>{
  const productId=req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart=cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart',async(req,res,next)=>{
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products: null});
  }
  var cart=new Cart(req.session.cart);
  res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice, totalQty: cart.totalQty});
});

router.get('/checkout',isLoggedIn, (req,res)=>{
  if(!req.session.cart){
    return res.redirect('/shopping-cart');
  }
  var cart=new Cart(req.session.cart);
  res.render('shop/checkout',{total: cart.totalPrice, cart});
});

router.post('/checkout',isLoggedIn, (req,res)=>{
  var cart=new Cart(req.session.cart);
  var order=new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name
  });
  order.save(function(err, result){
    req.flash('success','Order Placed');
    req.session.cart=null;
    res.redirect('/products');
  });
});

module.exports = router;