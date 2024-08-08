const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const userauth=require('../middleware/auth');

router.get('/', (req,res)=> res.redirect('/signup') );
router.get('/signup', expenseController.getSignup);
router.post('/signup', expenseController.postSignup);

router.get('/login', expenseController.getLogin);
router.post('/login', expenseController.postLogin);

router.get('/api/expenses', userauth.authenticate, expenseController.fetchExpense);
router.get('/Expense', expenseController.getExpense);
router.post('/createExpense', expenseController.postExpense);

router.delete('/delete/:id', expenseController.deleteExpense);

module.exports=router;