const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');

router.get('/', (req,res)=> res.redirect('/signup') );
router.get('/signup', expenseController.getSignup);
router.post('/signup', expenseController.postSignup);

router.get('/login', expenseController.getLogin);
router.post('/login', expenseController.postLogin);

// router.get('/Expense', expenseController.isAuth, expenseController.getExpense);

router.get('/api/expenses', expenseController.fetchExpense);
router.get('/Expense', expenseController.getExpense);
router.post('/createExpense', expenseController.postExpense);

router.get('/delete/:id', expenseController.deleteExpense);

module.exports=router;