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
    var decoded = jwt.verify(userToken,'LoginToken');
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



router.get('/', checkLoginUser,function(req, res, next) {
  var loginUser=req.session.username;
  console.log(loginUser==undefined);
  if(loginUser==undefined)
    res.render('error');
  passModule.countDocuments({}).exec((err,count)=>{
    passcadModule.countDocuments({}).exec((err,countasscat)=>{
      if(err)
        throw err;
      userModule.findOne({username:loginUser},function(err1,result){
        if(err1)
          throw err1;
        else if(loginUser==undefined)
          res.render('error');
        res.render('dashboard', { title: 'Password Management System', loginUser:loginUser,msg:'',totalPassword:count, totalPassCat:countasscat,image:result.image});
      });
    });
  });
});

module.exports=router;