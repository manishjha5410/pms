var express=require('express');
const passModel = require('../modules/add_password');
var router = express.Router();
const mongoose=require('mongoose');

router.post('/add',(req,res,next)=>{
    var password_category=req.body.password_category;
    var password_details=req.body.password_details;
    var project_name=req.body.project_name;
    var passDetails=new passModel({
        _id:mongoose.Types.ObjectId(),
        password_category:password_category,
        password_details:password_details,
        project_name:project_name
    });

    passDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Password Details inserted successfully",
            result:data
        });
    })
    .catch(err=>{
        res.status(err.status).json(err);
    });
});

router.get('/getDetails',(req,res,next)=>{
    passModel
    .find()
    .select("password_category password_details project_name")
    .populate("password_category","password_category")
    .then(data=>{
        res.status(200).json({
            message:"Success",
            result:data
        });
    })
    .catch(err=>{
        res.status(err.status).json(err);
    });
});

router.delete('/delete',(req,res,next)=>{
    var id = req.body.id;
    passModel.findByIdAndRemove(id)
    .then(data=>{
        res.status(201).json({
            message:"Category Deleted successfully",
            result:data
        });
    })
    .catch(err=>{
        res.status(err.status).json(err);
    });
});

module.exports=router;