var express = require('express');
var router = express.Router();
var productModel = require('../../modules/product');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

exports.getAllproducts = (req,res,next)=>{
    productModel
    .find()
    .select("product_name product_price image")
    .exec()
    .then(data=>{
        res.status(200).json({
            message:"Success",
            result:data
        });
    })
    .catch(err=>{
        res.status(err.status).json(err);
    });
};

exports.addproducts = (req,res,next)=>{
    var product_name=req.body.name;
    var price = req.body.price;
    var quantity = req.body.quantity;
    console.log(req.userData);

    var productDetails = new productModel({
        _id:mongoose.Types.ObjectId(),
        product_name:product_name,
        price:price,
        quantity:quantity,
        image:req.file.filename
    })

    productDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Password Details inserted successfully",
            result:data
        });
    })
    .catch(err=>{
        res.json(err);
    });
}