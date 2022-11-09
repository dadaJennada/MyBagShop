const mongoose = require('mongoose')
const Item = require('./item.js')

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    img:{
        type:String,
    },
});


module.exports = new mongoose.model('ShoppingAdmin',adminSchema);
