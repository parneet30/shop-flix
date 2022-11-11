const{productSchema,reviewSchema}=require('./schemas.js');
const ExpressError=require('./utils/ExpressError');
const Product=require('./models/product');
const Review=require('./models/review');

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()) {
        req.session.returnTo=req.originalUrl;
        req.flash('error','You must be signed in !!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateProduct=(req,res,next)=>{
    const {error}=productSchema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
      const msg=error.details.map(el=>el.message).join(',')
      throw new ExpressError(msg,400)
    }else{
      next();
    }
}
  
module.exports.isSeller=async(req,res,next)=>{
    const {id}=req.params;
    const product=await Product.findById(id);
    if(!product.seller.equals(req.user._id)){
      req.flash('error','Access Denied');  
      return res.redirect(`/products/${product._id}`);
    }
    next();
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error','Access Denied');  
    return res.redirect(`/products/${id}`);
  }
  next();
}