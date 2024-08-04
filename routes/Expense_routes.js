const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');

router.get('/signup', expenseController.getSignup);


module.exports=router;