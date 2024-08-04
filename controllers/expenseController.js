const path=require('path');

exports.getSignup=(req,res)=>{
    res.sendFile(path.join(__dirname, '../views/signup.html'));
}