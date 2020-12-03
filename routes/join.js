var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var bcrypt = require('bcryptjs');
var jwt=require('jsonwebtoken');
var passcadModule=require('../modules/password_category');
var passModule=require('../modules/add_password');
var getPassCad=passcadModule.find({});
const { check, validationResult } = require('express-validator');
router.use(express.static(__dirname+"./public/"));


function checkLoginUser(req,res,next)
{
  var userToken=localStorage.getItem('userToken');
  try
  {
    if(req.session.username)
      var decoded = jwt.verify(userToken,'LoginToken');
    else
      res.redirect('/');
  }
  catch(err)
  {
    res.redirect('/');
  }
  next();
}

if (typeof localStorage === "undefined" || localStorage === null)
{
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

router.get('/',checkLoginUser,function(req, res, next) {
    var loginUser=localStorage.getItem('loginUser');
    if(loginUser=="")
      res.redirect('/');
    passModule.aggregate([
        {
            $lookup:
            {
                from:"password_categories",
                localField:"password_category",
                foreignField:"password_category",
                as:"pass_cat_details"
            }
        },
        {
            $unwind: "$pass_cat_details"
        }
    ]).exec(function(err,data){
        if(err)
            throw err;
        console.log(data);
        res.send(data);
    });
});

module.exports=router;