var express = require('express');
var router = express.Router();
var path=require('path');
var userModule=require('../modules/user');
var bcrypt = require('bcryptjs');
var multer = require('multer');
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

function checkUserName(req,res,next)
{
  var username=req.body.uname;
  var checkexitusername = userModule.findOne({username:username});
  checkexitusername.exec((err,data)=>{
    if(err)
      throw err;
    else if(data)
    {
      return res.render('signup', { title: 'Password Management system',msg:'Username already exist',res:'false'});
    }
    next();
  })
}

function checkEmail(req,res,next)
{
  var email=req.body.email;
  var checkexitemail = userModule.findOne({email:email});
  checkexitemail.exec((err,data)=>{
    if(err)
      throw err;
    else if(data)
    {
      return res.render('signup', { title: 'Password Management system',msg:'Email already exist',res:'false' });
    }
    next();
  })
}

function checkPassword(req,res,next)
{
  var password = req.body.password;
  var confpassword = req.body.confpassword;
  if(password!=confpassword)
  {
    return res.render('signup', { title: 'Password Management system',msg:'Password not match!',res:'false' });
  }
  else
  {
    if(5>=password.length)
      return res.render('signup', { title: 'Password Management system',msg:'Password must be greater than 5 character!',res:'false' });
    var upper=false,special=false,number=false;
    for(var i=0;i<password.length;i++)
    {
      if(password[i]>='A' && password[i]<='Z')
        upper=true;
    }
    for(var i=0;i<password.length;i++)
    {
      if(password[i]>=0 && password[i]<9)
        number=true;
    }
    for(var i=0;i<password.length;i++)
    {
      if(password[i]=='$' || password[i]=='&' || password[i]=='!' ||password[i]=='@' ||password[i]=='?')
        special=true;
    }
    if(!upper)
      return res.render('signup', { title: 'Password Management system',msg:'Password must contain an uppercase character!',res:'false' });
    if(!number)
      return res.render('signup', { title: 'Password Management system',msg:'Password must contain an number character',res:'false' });
    if(!special)
      return res.render('signup', { title: 'Password Management system',msg:'Password must contain an special character',res:'false' });
  }
  next();
}

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
})

var upload = multer({
  storage:Storage
}).single('file');

router.get('/', function(req, res, next) {
  var loginUser=localStorage.getItem('loginUser');
  if(loginUser=="")
    res.redirect('./dashboard');
  res.render('signup', { title: 'Password Management system',msg:'',res:'false' });
});

router.post('/',upload,checkUserName,checkEmail,checkPassword,function(req, res, next) {
  var username = req.body.uname;
  var email = req.body.email;
    var password = req.body.password;
    var confpassword = req.body.confpassword;
    var imageName = req.file.filename;
    password = bcrypt.hashSync(req.body.password,10);
    var userDetails = new userModule({
      username: username,
      email: email,
      password: password,
      image: imageName
    });

    userDetails.save(function(err,data){
      if(err)
        throw err;
      res.render('signup', { title: 'Password Management system',msg:'User Successfully registered',res:'true'});
    });
});

module.exports=router;