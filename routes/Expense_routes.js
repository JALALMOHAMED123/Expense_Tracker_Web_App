const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const purchaseController=require('../controllers/purchaseController');
const userauth=require('../middleware/auth');

router.get('/', (req,res)=> res.redirect('/signup') );
router.get('/signup', expenseController.getSignup);
router.post('/signup', expenseController.postSignup);

router.get('/login', expenseController.getLogin);
router.post('/login', expenseController.postLogin);

router.get('/api/expenses', userauth.authenticate, expenseController.fetchExpense);
router.get('/Expense', expenseController.getExpense);
router.post('/createExpense', userauth.authenticate, expenseController.postExpense);

router.delete('/delete/:id', userauth.authenticate,expenseController.deleteExpense);

router.get('/PremiumMemberShip', userauth.authenticate,purchaseController.purchasePremium);
router.post('/UpdatePremiumMemberShip', userauth.authenticate,purchaseController.updateStatus);

router.get('/leaderboard', expenseController.getleaderboard);

router.get('/password/forgotpassword', expenseController.forgetpassword);
router.get('/download-expenses', checkPremium, expenseController.downloadexpense);

module.exports=router;