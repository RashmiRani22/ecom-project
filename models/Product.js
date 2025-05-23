const mongoose = require('mongoose');
const Review = require('./Review');

const productSchema = new mongoose.Schema({
     name: {
        type:String,
        trim:true,
        required:true
    } , 
    img:{
        type:String,
        trim:true,
         default: '/images/product.jpg'
    } ,
    price: {
        type:Number,
        min:0,
         default: 0
    } ,
    desc: {
        type:String,
        trim:true
    },
    avgRating: {
        type: Number,
        default:0 
    },
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ], 
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

});

// middleware jo BTS mongodb operations karwane par use hota hai and iske andar pre nd post middleware hote hai which are basically used over the schema and before the model is js class.

productSchema.post('findOneAndDelete' , async function(product){
    if(product.reviews.length > 0){
        await Review.deleteMany({_id:{$in:product.reviews}})
    }
})



let Product = mongoose.model('Product' , productSchema);
module.exports = Product;