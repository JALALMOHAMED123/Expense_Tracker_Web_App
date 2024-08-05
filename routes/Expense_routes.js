const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');

router.get('/signup', expenseController.getSignup);
router.post('/signup', expenseController.postSignup);


module.exports=router;