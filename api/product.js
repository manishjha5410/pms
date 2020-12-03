var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var productModel= require('../modules/product');
var multer  = require('multer')
var checkAuth = require('./middleware/auth');
const productsController = require('./controller/product');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null,Date.now()+'-'+file.originalname)
    }
})

const filefilter = (req, file, cb)=>{
    if(file.mimetype==="image/jpeg" || file.mimetype==="image/jpg" || file.mimetype==="image/png")
        cb(null,true);
    else
        cb(null,false);
}

var upload = multer({
    storage:storage,
    limits:{
        fileSize:1024*1024*5
    },
    filefilter:filefilter
});

router.get('/getAllProducts',checkAuth,productsController.getAllproducts);

/*
    file path,limit:How many mb,filter:jpg,png,pdf
*/

router.post("/add",upload.single('productImage'),checkAuth,productsController.addproducts);

module.exports=router;