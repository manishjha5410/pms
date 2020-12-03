var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var jwt=require('jsonwebtoken');
var passcadModule=require('../modules/password_category');
var passModule=require('../modules/add_password');
var getPassCad=passcadModule.find({});
const { check, validationResult } = require('express-validator');
const session = require('express-session');
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



router.get('/',checkLoginUser, function(req, res, next) {
  var loginUser=req.session.username;
  if(loginUser=="")
      res.redirect('/');
    getPassCad.exec(function(err,data){
      if(err)
        throw err;
      res.render('add-new-password', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'false',records:data,success:''});
    });
});

router.post('/',checkLoginUser, function(req, res, next) {
  var loginUser=req.session.username;
  if(loginUser=="")
    res.redirect('/');
  var pass_cat=req.body.pass_cat;
  var project_name=req.body.project_name;
  var pass_details=req.body.pass_details;
  passcadModule.find({password_category:pass_cat},function(err, result){
    if(err)
      throw err;
    var password_details=new passModule({
      _id:mongoose.Types.ObjectId(),
      project_name:project_name,
      password_details:pass_details,
      password_category:result[0]._id
    });
    console.log(password_details);
    password_details.save(function(err,doc){
      if(err)
        throw err;
      getPassCad.exec(function(err1,data){
        if(err)
          throw err1;
        res.render('add-new-password', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'false',records:data,success:"Password Details Inserted Successfully"});
      });
    });
  })
});

module.exports=router;