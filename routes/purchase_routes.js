const express=require('express');
const router=express.Router();
const userauth=require('../middleware/auth');

const purchaseController=require('../controllers/purchaseController');

router.get('/PremiumMemberShip', userauth.authenticate,purchaseController.purchasePremium);
router.post('/UpdatePremiumMemberShip', userauth.authenticate,purchaseController.updateStatus);

module.exports=router;