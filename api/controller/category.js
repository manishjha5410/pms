var express=require('express');
var router = express.Router();
var passcadModule=require('../../modules/password_category');
var getPassCategory = passcadModule.find({},{"_id":0,"password_category":1});

exports.getCategory = (req,res,next) => {
    getPassCategory.exec()
    .then(data=>{
        res.status(200).json({
            message:"OK",
            result:data
        });
    })
    .catch(err=>{
        res.json(err);
    });
}

exports.add = (req,res,next) => {
    var passCategory = req.body.pass_cat;
    var passCatDetails = new passcadModule({password_category:passCategory});
    passCatDetails.save()
    .then(data=>{
        res.status(201).json({
            message:"Category inserted successfully",
            result:data
        });
    })
    .catch(err=>{
        res.json(err);
    });
}

exports.add_update = (req,res,next) => {
    var id =req.params.id;
    var passwordCategory = req.body.pass_cat;
    passcadModule.findById(id,function(err,data){
        data.password_category=passwordCategory;
        data.save()
        .then(data=>{
            res.status(201).json({
                message:"Category Updated successfully",
                result:data
            });
        })
        .catch(err=>{
            res.json(err);
        });
    });
}

exports.update =(req,res,next) => {
    var id =req.params.id;
    var passwordCategory = req.body.pass_cat;
    passcadModule.findById(id,function(err,data){
        data.password_category=passwordCategory;
        data.save()
        .then(data=>{
            res.status(201).json({
                message:"Category Updated successfully",
                result:data
            });
        })
        .catch(err=>{
            res.json(err);
        });
    });
}

exports.delete = (req,res,next) => {
    var id = req.params.id;
    passcadModule.findByIdAndRemove(id)
    .then(data=>{
        res.status(201).json({
            message:"Category Deleted successfully",
            result:data
        });
    })
    .catch(err=>{
        res.json(err);
    });
}