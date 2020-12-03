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
  var loginUser=req.session.username;
  var perPage=5;
  var page =  1;

  if(loginUser=="")
    res.redirect('/');
  passModule.find({}).populate("password_category","password_category").skip((perPage * page) - perPage).limit(perPage).exec(function(err,data){
    if(err)
      throw err;
    passModule.countDocuments({}).exec((err1,count)=>{
      if(err1)
        throw err1;
      console.log(data);
      res.render('view-all-password', { title: 'Password Management system',current:page,pages: Math.ceil(count / perPage),loginUser:loginUser,msg:'',res:'false',records:data });
    });
  });
});

  router.get('/:page',checkLoginUser,function(req, res, next) {
    var loginUser=req.session.username;
    var perPage=5;
    var page = req.params.page || 1;

    if(loginUser=="")
    {
      res.redirect('/');
    }
    passModule.find({}).skip((perPage * page) - perPage).limit(perPage).exec(function(err,data){
      if(err)
        throw err;
      passModule.countDocuments({}).exec((err1,count)=>{
        if(err1)
          throw err1;
        console.log(count);
        res.render('view-all-password', { title: 'Password Management system',current:page,pages: Math.ceil(count / perPage),loginUser:loginUser,msg:'',res:'false',records:data });
      });
    });
  });

module.exports=router;