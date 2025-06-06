const express = require('express');
const router = express.Router() //mini instance
const {isLoggedIn} = require('../middleware');
const Product = require('../models/Product');
const User = require('../models/User')



// route too see the cart
router.get('/user/cart' ,isLoggedIn , async(req,res)=>{
    let user = await User.findById(req.user._id).populate('cart');
    const totalAmount = user.cart.reduce((sum , curr)=> sum+curr.price , 0)
    const productInfo = user.cart.map((p)=>p.desc).join(',');
    res.render('cart/cart' , {user, totalAmount , productInfo });
})

// actually adding the product to the cart
router.post('/user/:productId/add' , isLoggedIn , async(req,res)=>{
    let {productId} = req.params;
    let userId = req.user._id ; 
    let product = await Product.findById(productId);
    let user = await User.findById(userId);
    user.cart.push(product);
    await user.save();
    res.redirect('/user/cart');
})



 

module.exports = router;