var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var userModel = require('../modules/user');
const bcrypt=require('bcryptjs');
var jwt = require('jsonwebtoken');
require('dotenv').config();
var Key = process.env.SECRET_KEY;

router.get("/view",(req,res,next)=>{
    userModel.find()
    .exec()
    .then(user =>{
        res.status(201).json({
            message:"Success",
            user:user
        });
    })
    .catch(err =>{
        res.json({error:err});
    });
})

router.post("/signup",(req,res,next)=>{
    var username=req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var Confpassword = req.body.Confpassword;

    if(password!==Confpassword)
    {
        res.status(404).json({
            message:"Password Not match!",
        });
    }
    else
    {
        bcrypt.hash(password,10,function(err,hash){
            if(err)
            {
                res.status(500).json({
                    message:"Server issue,Try later!",
                    error:err
                });
            }
            else
            {
                var userDetails = new userModel({
                    username:username,
                    email:email,
                    password:hash
                });
                console.log(userDetails);
                userDetails.save()
                .then(data=>{
                    res.status(201).json({
                        message:"User Registered successfully",
                        result:data
                    });
                })
                .catch(err=>{
                    res.json(err);
                });
            }
        })
    }
});

router.post("/login",(req,res,next)=>{
    var username=req.body.username;
    var password = req.body.password;

    userModel.find({username:username})
    .exec()
    .then(user =>{
        if(user.length<1)
            res.status(404).json({
                message:"User Not Exists",
            });
        else
        {
            bcrypt.compare(password,user[0].password,(err,result) => {
                if(result)
                {
                    var image = user[0].image?user[0].image:"";
                    var token = jwt.sign({
                        username:user[0].username,
                        id:user[0]._id,
                        email:user[0].email,
                        image:image
                        },
                        Key,
                        {
                            expiresIn:"1hrs"
                        }
                    );
                    res.status(201).json({
                        message:"User Found",
                        token:jwt.decode(token)
                    });
                }
                else
                    res.status(404).json({
                        message:"Password Not match",
                    });
            });
        }
    })
    .catch(err =>{
        res.json({error:err});
    });
});

module.exports=router;