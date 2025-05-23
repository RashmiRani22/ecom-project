const express = require('express');
const router = express.Router() //mini instance
const Product = require('../models/Product')
const Review = require('../models/Review')
const {validateReview} = require('../middleware')

router.post('/products/:productid/review' , validateReview,  async(req,res)=>{
    try{
        let {productid} = req.params;
        let {rating,comment} =req.body;
        const product = await Product.findById(productid);
        const review = new Review({rating,comment});

        // Average Rating Logic
        const newAverageRating = ((product.avgRating * product.reviews.length) + parseInt(rating)) / (product.reviews.length + 1);
        product.avgRating = parseFloat(newAverageRating.toFixed(1));

        product.reviews.push(review);
        await review.save();
        await product.save();
        req.flash('success' , 'Review added successfully')
        res.redirect(`/products/${productid}`);
    }
    catch(e){
        res.status(500).render('error' , {err:e.message});
    }
});


module.exports = router;