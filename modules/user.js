const mongoose = require('mongoose');
require('dotenv').config();
var dburl = process.env.MONGO_DB_URL;
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true});
var conn = mongoose.Collection;
var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required:true,
        index:{
            unique: true,
        }
    },
    email: {
        type: String,
        required:true,
        index:{
            unique: true,
        },
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required:true
    },
    image: {
        type: String
    },
    date:{
        type: Date,
        default:Date.now
    }
});

var userModel = mongoose.model('user',userSchema);
module.exports=userModel;