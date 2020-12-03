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

router.get('/',checkLoginUser, function(req, res, next) {
    var loginUser=req.session.username;
    if(loginUser=="")
    {
      res.redirect('/');
    }
    var options = {
      offeset: 5,
      limit: 3
    };
    passcadModule.paginate({},options).then(function(result){
      res.render('password_category', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'false',records:result.docs,pages:result.total,current:Math.ceil(result.offset/result.limit) });
    });
  });

router.get('/edit/:id',checkLoginUser,function(req, res, next) {
    var loginUser=req.session.username;
    var passcat_id = req.params.id;
    var passedit= passcadModule.findByIdAndUpdate(passcat_id);
    if(loginUser=="")
    {
      res.redirect('/');
    }
    passedit.exec(function(err,data){
      if(err)
        throw err;
      res.render('edit_pass_category', { title: 'Password Management system',loginUser:loginUser,errors:'',success:'',records:data,id:passcat_id });
    });
  });

  router.post('/edit/',checkLoginUser, function(req, res, next) {
    var loginUser=req.session.username;
    var passcat_id = req.body.id;
    var passcad = req.body.passcad;
    var passedit= passcadModule.findByIdAndUpdate(passcat_id,{password_category:passcad});
    if(loginUser=="")
    {
      res.redirect('/');
    }
    passedit.exec(function(err,data){
      if(err)
      throw err;
      res.redirect('/');
    });
  });

  router.get('/delete/:id',checkLoginUser, function(req, res, next) {
    var loginUser=req.session.username;
    var passcat_id = req.params.id;
    var passdelete = passcadModule.findByIdAndDelete(passcat_id);
    console.log(passcat_id);
    if(loginUser=="")
    {
      res.redirect('/');
    }
    passdelete.exec(function(err){
      if(err)
      throw err;
      res.redirect('/');
    });
  });

module.exports=router;