const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    manufracturer:{
        type:String,
        retuired:true,
    },
    categery:{
        type:String,
        required:true,
    },
    rating:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    }
});

module.exports = new mongoose.model('Item',itemSchema);