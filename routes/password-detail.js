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

router.get('/edit/:id',checkLoginUser, function(req, res, next) {
    var loginUser=req.session.username;
    var id =req.params.id;
    var getPassDetails=passModule.findByIdAndUpdate({_id:id});
    getPassDetails.exec(function(err,data){
        res.render('edit_password_detail', { title: 'Password Management System',loginUser: loginUser,record:data,error:'' });
    });
  });


  var arr = [ check('project_name','Enter Project Name').isLength({min:1}),check('password_details','Enter password Details Name').isLength({min:1}) ];

  router.post('/edit/:id',arr, function(req, res, next) {
    const errors = validationResult(req);
    var loginUser=req.session.username;
    var project_name=req.body.project_name;
    var password_details=req.body.password_details;
    var id=req.body.id;
    if(!errors.isEmpty())
      passModule.findById(id,function(err,data){
        if(err)
          throw err;
        data.project_name=project_name;
        data.password_details=password_details;
        data.date=Date.now();
        res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,record:data,error:'Please fill all the details!!' });
      });
    else
    {
      var updatePassword=passModule.findByIdAndUpdate(id,{project_name:project_name,password_details:password_details});
      updatePassword.exec(function(err,data){
        if(err)
          throw err;
          res.render('edit_password_detail', { title: 'Password Management System',loginUser:loginUser,record:data,error:'Data updated successfully!!' });
      });
    }
  });

  router.get('/delete/:id',function(req,res,next){
    var id=req.params.id;
    var deletepassword=passModule.findByIdAndDelete(id);
    deletepassword.exec(function(err){
      if(err)
        throw err;
      res.redirect('/view-all-password');
    });
  });

module.exports=router;