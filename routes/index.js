var express = require('express');
var router = express.Router();
var userModule=require('../modules/user');
var multer = require('multer');
var fs = require('fs');
var session=require('express-session');
const { detect } = require('detect-browser');
var browser = detect();
var bcrypt = require('bcryptjs');
var path= require('path');
var jwt=require('jsonwebtoken');
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

router.get('/', function(req, res, next) {
  var loginUser=req.session.username;
  if(req.session.username)
  {
    res.redirect('./dashboard');
  }
  res.render('index', { title: 'Password Management system',msg:'',res:'false'});
});

router.post('/', function(req, res, next) {
  var username = req.body.uname;
  var password = req.body.password;
  userModule.exists({username:username},function(err, result){
    if (err){
      console.log(err)
    }
    else if(result)
    {
      var checkUserName = userModule.findOne({username: username});
      checkUserName.exec((err1,data)=>{
        if(err1)
          throw err1;
        var getUserID= data._id;
        var getpassword=data.password;
        if(bcrypt.compareSync(password,getpassword))
        {
          var token = jwt.sign({userID:getUserID},'LoginToken');
          localStorage.setItem('userToken',token);
          localStorage.setItem('loginUser',username);
          req.session.username=username;
          req.session.browser=browser;
          res.redirect('/dashboard');
        }
        else
        {
          res.render('index', { title: 'Password Management system',msg:'Invalid Username and password',res:'false'});
        }
      });
    }
    else{
      res.render('index', { title: 'Password Management system',msg:'Invalid Username',res:'false'});
    }
  });
});

router.get('/logout',checkLoginUser, function(req, res, next) {
  var loginUser=req.session.username;
  if(loginUser=="")
  {
    res.redirect('/');
  }
  req.session.destroy(function(err) {
    if(err)
      res.redirect('/dashboard');
    res.redirect('/');
  });
});

var Storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: (req,file,cb)=>{
    cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
})

var upload = multer({
  storage:Storage
}).single('file');

router.post('/updateimage',upload,checkLoginUser,(req,res,next) => {
  if(req.file)
  {
    var loginUser=req.session.username;
    var image = req.file.filename;
    userModule.findOne({username:loginUser},function(err,data){
      var imageloc="./public/uploads/"+data.image;
      fs.unlink(imageloc,function(err){
        if(err)
          throw err;
      });
    });
    userModule.findOneAndUpdate({username:loginUser},{image:image},function(err,data){
      if(err)
        throw err;
      res.redirect('/dashboard');
    });
  }
})

module.exports = router;