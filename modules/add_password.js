const mongoose = require('mongoose');
require('dotenv').config();
var dburl = process.env.MONGO_DB_URL;
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true});
var conn = mongoose.Collection;
var passSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    password_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'password_categories',
        required:true,
        index:{
            unique: true,
        }
    },
    password_details: {
        type: String,
        required:true,
    },
    project_name: {
        type: String,
        required:true,
    },
    date:{
        type: Date,
        default:Date.now
    }
});

var passModel = mongoose.model('password_details',passSchema);
module.exports=passModel;