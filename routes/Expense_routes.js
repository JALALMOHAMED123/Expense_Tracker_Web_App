const express=require('express');
const router=express.Router();
const expenseController=require('../controllers/expenseController');
const userauth=require('../middleware/auth');

router.get('/api/paginatedExpenses', userauth.authenticate, expenseController.getpagination); 

router.post('/createExpense', userauth.authenticate, expenseController.postExpense);

router.delete('/delete/:id', userauth.authenticate,expenseController.deleteExpense);

router.get('/leaderboard', userauth.authenticate, expenseController.getleaderboard);

router.get('/api/dailyExpense', userauth.authenticate, expenseController.fetchExpense);

router.get('/user/download', userauth.authenticate, expenseController.download);
router.get('/user/downloadhistory', userauth.authenticate, expenseController.historydownload);

module.exports=router;