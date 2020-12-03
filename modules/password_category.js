var mongoosePaginate = require('mongoose-paginate');
const mongoose = require('mongoose');
require('dotenv').config();
var dburl = process.env.MONGO_DB_URL;
mongoose.connect(dburl,{useNewUrlParser:true,useUnifiedTopology: true,useCreateIndex:true});
var conn = mongoose.Collection;
var passcadSchema = new mongoose.Schema({
    password_category: {
        type: String,
        required:true,
        index:{
            unique: true,
        }
    },
    date:{
        type: Date,
        default:Date.now
    }
});

passcadSchema.plugin(mongoosePaginate);
var passcadModel = mongoose.model('password_categories',passcadSchema);
module.exports=passcadModel;