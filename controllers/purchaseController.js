const Razorpay=require('razorpay');
const Order=require('../models/orders');

exports.purchasePremium=async(req,res)=>{
    try{
        var rzp=new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order)=>{
            // console.log(err);
            if (err) {
                console.error("Razorpay Error: ", err); 
                return res.status(500).json({ error: "Razorpay order creation failed", details: JSON.stringify(err) });
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING'}).then(()=>{
                res.status(201).json({order, key_id: rzp.key_id});
            })
            .catch((err=>{
                res.status(401).json({Error: err.message});
            }));
        })
    }
    catch(err){
        res.status(401).json({Error: "purchase controller not working"});
    }
}

exports.updateStatus=async (req,res)=>{
    try{
        const {payment_id, order_id} =req.body;
        const order=await Order.findOne({where :{orderid: order_id}})
        const p1= order.update({paymentid: payment_id, status: "SUCCESS"});
        const p2= req.user.update({ispremiumuser: true});

        Promise.all([p1,p2]).then(()=>{
            res.status(200).json({message: 'Transaction successfull', premium: req.user.ispremiumuser});
        })
        .catch((err)=>{
            console.log(err.message);
        });
    }
    catch(err){
        res.status(401).json({Error: err.message});
    }
}