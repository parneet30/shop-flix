if(process.env.NODE_ENV !== "production") {
  require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const ExpressError=require('./utils/ExpressError');
const {productSchema}=require('./schemas');
const methodOverride = require('method-override');
const mongoStore=require("connect-mongo")(session);


const userRouter=require('./routes/users');
const indexRouter = require('./routes/index');

const app = express();

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/shop-flix';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

// view engine setup
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const secret=process.env.SECRET || 'parneet';

const store=new mongoStore({
  url: dbUrl,
  secret,
  touchAfter: 24*60*60
});

store.on("error",function(e){
  console.log("SESSION STORE ERROR",e);
});

const sessionConfig = {
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7
  }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res, next)=>{
  res.locals.currentUser=req.user;
  res.locals.session=req.session;
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  next();
});

app.use('/', userRouter);
app.use('/', indexRouter);

app.all('*',(req,res,next)=>{
  next(new ExpressError('Page Not Found',404));
});

app.use((err,req,res,next)=>{
  const {statusCode=500}=err;
  if(!err.message) err.message='Oh No, Something Went Wrong';
  res.status(statusCode).render('error',{err});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`serving on port ${port}`);
});

module.exports = app;