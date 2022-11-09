const express = require('express');
const mongoose = require('mongoose');
const Admin = require('./models/admin.js');
const Item = require('./models/item.js');
const User = require('./models/user.js')
const MainItem = require('./models/userItem.js')
const Slc = require('./models/temp');
// import {Slc} from './models/temp';
const session = require('express-session');
const app = express()
mongoose.connect('mongodb://localhost:27017/Shopping', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log("DataBase Connected Succcessfully");
})
.catch((err) => {
    console.log("OOps there is ann error in connection", err);
})
app.set('view engine','ejs');
app.use(session({ secret: 'shopping', resave: false, saveUninitialized: false }));
app.use(express.urlencoded({extended:true}))
app.use(express.static('root'))
app.listen(3000,(req,res)=>{
    console.log("Listening on port 3000");
})


app.get('/',(req,res)=>{
    res.render('login.ejs');
})

app.get('/register',(req,res)=>{
    res.render('register');
})


app.post('/admin',async (req,res)=>{
    const {username,password,repassword} = req.body;
    const admin = await Admin.findOne({username});
    const user = await User.findOne({username}).populate('items'); 
    if(!admin && !user){
        res.redirect('/')
    }
    if(admin){
        req.session.logged = true;
        req.session.username = username;
        console.log(admin);
        const items = await Item.find({})
        const slcN = Slc.slcN;
        const slcM = Slc.slcM;
        // console.log(Slc)
        if(items.length==0){
            res.render('admin.ejs',{admin,items});
        }
        else{
            res.render('adminItems',{admin,items,slcN,slcM})
        }
    }
    else{
        
        if(user){
            req.session.logged = true;
            req.session.username = username;
            const items = await MainItem.find({});
            const slcN = Slc.slcN;
            const slcM = Slc.slcM;
            const userItems = user.items;
            // console.log(userItems)
            var check = 0;
            var wcheck = 0;
            // console.log(Slc)
            res.render('user',{user,items,slcN,slcM,userItems,check,wcheck})
        }
    }

})

app.post('/register',async (req,res)=>{
    const {username,password,repassword} = req.body;
    const user = new User({
        username:username,
        password:password,
    });
    // console.log(typeof user.items);
    await user.save();
    const items = await MainItem.find({});
    const slcN = Slc.slcN;
    const slcM = Slc.slcM;
    const userItems = user.items;
    var check = 0;
    var wcheck = 0;
    res.render('user',{user,slcN,slcM,items,userItems,check,wcheck});
})

app.get('/addITem',async (req,res)=>{
    const admin = await Admin.findOne({username:req.session.username})
    res.render('add',{admin});
})

app.post('/addItem',async(req,res)=>{
    // console.log(req.body);
    const temp = req.body;
    const item = new Item({
        name:temp.name,
        manufracturer:temp.manufracturer,
        categery:temp.categery,
        price:temp.price,
        rating:temp.rating,
        img : temp.img,
        about : temp.about,
    });
    await item.save()
    const admin =await Admin.findOne({username:req.session.username});
    // admin.items.push(item);
    // console.log(admin.items);
    // res.send('Item Added');
    res.redirect('/adminItems');
})


app.get("/adminItems",async (req,res)=>{
    if(req.session.logged==false){
        res.redirect('/');
    }
    const username = req.session.username;
    const admin = await Admin.findOne({username});
    const items = await MainItem.find({});
    // console.log(items);
    const slcN = Slc.slcN;
    const slcM = Slc.slcM;
    res.render('adminItems',{admin,items,slcN,slcM});
})

app.get('/useradminItems',async (req,res)=>{
    const username = req.session.username;
    const user = await User.findOne({username:username});
    const items = await MainItem.find({});
    const slcN = Slc.slcN;
    const slcM = Slc.slcM;
    const userItems = user.items;
    // console.log(userItems)
    var check = 0;
    var wcheck = 0;
            // console.log(Slc)
    res.render('user',{user,items,slcN,slcM,userItems,check,wcheck})
})


app.get('/show/:id',async(req,res)=>{
    if(!req.session.logged){
        res.redirect('/')
    }
    const item = await MainItem.findOne({_id:req.params.id});
    const admin = await Admin.findOne({username:req.session.username});
    res.render('show',{admin,item});
})

app.get('/editItem/:id',async(req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const admin = await Admin.findOne({username:req.session.username})
    const item = await MainItem.findOne({_id:req.params.id});
    res.render("edit",{admin,item});
})

app.post('/editItem/:id',async(req,res)=>{
    if(!req.session.logged){
        res.redirect('/')
    }
    // const img = req.body.img;
    const item = await MainItem.findOne({_id:req.params.id});
    const editItem = req.body;
    console.log(req.body);
    item.name = editItem.name;
    item.manufracturer = editItem.manufracturer;
    item.categery = editItem.categery;
    item.rating = editItem.rating;
    item.price = editItem.price;
    item.img = editItem.img;
    item.about = editItem.about;
    await item.save();
    res.redirect('/adminItems');
});

app.get('/deleteItem/:id',async(req,res)=>{
    if(!req.session.logged){
        red.redirect('/');
    }
    const item = await MainItem.findOne({_id:req.params.id});
    await item.remove();
    res.redirect('/adminItems');
})

app.get('/buy/:id',async (req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const user = await User.findOne({username:req.session.username}).populate('items');
    const item = await MainItem.findOne({_id:req.params.id});
    // const items = await Item.find();
    const useritem = item;
    await useritem.save();
    user.items.push(useritem);
    const userItems = user.items;
    const items = await MainItem.find();
    await user.save();
    const slcN = Slc.slcN;
    const slcM = Slc.slcM;
    var check = 0;
    var wcheck=0;
    for(let itm of userItems){
        console.log(itm._id,item._id);
        console.log(itm.name,item.name);
    }
    res.render('user',{user,slcN,slcM,userItems,check,wcheck,items})
})

app.get('/usershow/:id',async (req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const user =  await User.findOne({username:req.session.username}).populate('items');
    // console.log('user', user);
    const item = await MainItem.findOne({_id:req.params.id});
    const userItems = user.items;
    const items = user.items
    // console.log(item);
    // console.log(user);
    // console.log(item,userItems)
    console.log(userItems);
    for(let i=0;i<userItems.length;i++){
        console.log(i,userItems[i]._id.toString(),item._id.toString());
    }
    var check = 0;
    res.render('usershow',{user,item,userItems,check,items});
})

app.get('/userbag',async (req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const user = await User.findOne({username:req.session.username}).populate('items');
    const items = user.items;
    if(items.length==0){
        res.render('userbag',{user});
    }
    else{
        res.render('userItemsBag',{user,items});
    }
})

app.get('/remUserItem/:id',async(req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const id = req.params.id;
    const user = await User.findOne({username:req.session.username}).populate('items');
    const items = user.items;
    // console.log(items);
    for(let i=0;i<items.length;i++){
        if(items[i]._id.toString()==id){
            items.splice(i,1);
            break;
        }
    }
    user.items = items;
    await user.save();
    res.redirect('/userbag');
})

app.get('/userUpdate',async(req,res)=>{
    if(!req.session.logged){
        res.redirect('/');
    }
    const user = await User.findOne({username:req.session.username});

})


app.get('/logout',(req,res)=>{
    req.session.logged = false;
    req.session.destroy();
    res.redirect('/');
})

