const mongoose = require('mongoose');
const ShoppingItem = require('./item.js');
const Useritem = require('./userItem.js');

const userSchema = new mongoose.Schema({
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
    items:{
        type : [mongoose.Schema.Types.ObjectId],
        ref:'Item',
    },
});

module.exports = new mongoose.model('User',userSchema);