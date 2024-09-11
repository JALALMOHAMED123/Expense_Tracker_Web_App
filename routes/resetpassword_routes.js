const express=require('express');
const router=express.Router();
const userauth=require('../middleware/auth');
const resetpasswordController=require('../controllers/resetpasswordController');

// router.get('/password/forgotpassword', expenseController.forgetpassword);
router.get('/password/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

router.get('/password/resetpassword/:id', resetpasswordController.resetpassword)

router.use('/password/forgotpassword', resetpasswordController.forgotpassword)

module.exports=router;