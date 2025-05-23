if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const seedDB = require('./seed');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/User');
const MongoStore = require('connect-mongo');


const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth')
const cartRoutes = require('./routes/cart')
const productApi = require('./routes/api/productapi');
const paymentRoutes = require('./routes/payment');

const dbURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/shopping-sam-app';

mongoose.set('strictQuery', true);
mongoose.connect(dbURL)
    .then(() => console.log('DB Connected'))
    .catch((err) => console.log(err));

let secret = process.env.SECRET;
let store = MongoStore.create({
   secret:secret,
    mongoUrl: dbURL,
    touchAfter:24*60*60
})




//session
let configSession = {
  store: store,
  secret: secret,
    resave: false,
    saveUninitialized: true,
    cookies: { 
        httpOnly: true ,
        expires: Date.now() + 24*7*60*60*1000 , 
        maxAge:24*7*60*60*1000
    }
}

app.engine('ejs' , ejsMate);
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname , 'views')); // views folder 
app.use(express.static(path.join(__dirname , 'public'))); // public folder
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(session(configSession)); 
app.use(flash());
// passport vaali
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// PASSPORT WAALI
passport.use(new LocalStrategy(User.authenticate()));

//seedDB();

app.get('/' , (req,res)=>{
    res.render('home');
})

app.use(productRoutes); //so that harr incoming request ke liye path check kiya jaae
app.use(reviewRoutes);  //so that harr incoming request ke liye path check kiya jaae
app.use(authRoutes);  //so that harr incoming request ke liye path check kiya jaae
app.use(cartRoutes);  //so that harr incoming request ke liye path check kiya jaae
app.use(productApi);
app.use(paymentRoutes);



app.listen(8080 , ()=>{
    console.log("server connected at port 8080")
})