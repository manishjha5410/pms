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
  var loginUser= req.session.username;
  if(loginUser=="")
    res.redirect('/');
  res.render('addNewCategory', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'false',errors:'',success:''});
});

var arr = [ check('passcad','Enter password Category Name').isLength({min:1}) ];

router.post('/',arr,function(req, res, next) {
  var loginUser= req.session.username;
  const errors = validationResult(req);
  if(!errors.isEmpty())
      res.render('addNewCategory', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'false',errors:errors.mapped(),success:''});
  else
  {
    var passcadName =req.body.passcad;

    var passcaddetails = new passcadModule({
      password_category:passcadName
    });

    passcaddetails.save(function(err,doc){
      if(err)
        throw err;
      res.render('addNewCategory', { title: 'Password Management system',loginUser:loginUser,msg:'',res:'true',errors:'',success:'Password Category inserted sucessfully'});
    });
  }
});

module.exports=router;