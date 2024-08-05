const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');

router.get('/signup', expenseController.getSignup);
router.post('/signup', expenseController.postSignup);

router.get('/login', expenseController.getLogin);
router.post('/login', expenseController.postLogin);

module.exports=router;