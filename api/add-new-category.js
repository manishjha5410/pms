var express=require('express');
var router = express.Router();
var passcadModule=require('../modules/password_category');
var getPassCategory = passcadModule.find({},{"_id":0,"password_category":1});
const categoryController = require('./controller/category')


router.get("/getcategory",categoryController.getCategory);

router.post("/addCategory",categoryController.add);

router.put("/add-update/:id",categoryController.add_update);

router.patch("/update/:id",categoryController.update);

router.delete("/delete/:id",categoryController.delete);

module.exports=router;