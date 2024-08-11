const Razorpay=require('razorpay');
const Order=require('../models/orders');

exports.purchasePremium=async(req,res)=>{
    try{
        var rzp=new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount=2500;
        rzp.orders.create({amount, current: "INR"}, (err, order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order_id, status: "PENDING"}).then(()=>{
                req.status(201).json({order, key_id: rzp.key_id});
            })
            .catch((err=>{
                throw new Error(err);
            }));
        })
    }
    catch(err){
        res.status(401).json({Error: "purchase controller not working"});
    }
}

exports.updateStatus=(req,res)=>{
    try{
        const {payment_id, order_id} =req.body;
        Order.findOne({where :{orderid: order_id}}).then((order=>{
            order.update({paymentid: payment_id, status: "SUCCESS"}).then(()=>{
                req.user.update({ispremiumuser: true}).then(()=>{
                    res.status(200).json({message: 'Transaction successfull'});
                }).catch((err)=>{
                    throw new Error(err);
                });
            }).catch((err)=>{
                throw new Error(err);
            });
        })).catch((err)=>{
            throw new Error(err);
        });
    }
    catch(err){
        res.status(401).json({Error: err})
    }
}