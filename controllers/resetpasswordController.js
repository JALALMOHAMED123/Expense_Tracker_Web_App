const uuid = require('uuid');
const Sib = require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
        if (user) {
            const id = uuid.v4();
            await user.createForgotpassword({ id, isactive: true });

            const client = Sib.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.API_KEY;
            console.log(process.env.API_KEY);
            const transactionalEmailApi = new Sib.TransactionalEmailsApi();

            const sender = {
                email: process.env.NAME,
                name: 'Expense App',
            };

            const receivers = [
                {
                    email: email,
                },
            ];

            transactionalEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'Reset password',
                    textContent: `Reset Password Link:`,
                    htmlContent: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
                })
                .then((response) => {
                    return res.status(200).json({ message: 'Reset password link sent to your mail Id' });
                })
                .catch((error) => {
                    console.error('Error sending email:', error.response ? error.response.body : error.message);
                    return res.status(401).json({ err: error.message });
                });
        } else {
            res.status(401).json({ err: "User doesn't exist" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};

const resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findOne({ where : { id }}).then(forgotpasswordrequest => {
        if(forgotpasswordrequest){
            forgotpasswordrequest.update({ isactive: false});
            res.status(200).send(`<html>
                                    <script>
                                        function formsubmitted(e){
                                            e.preventDefault();
                                        }
                                    </script>
                                    <form action="http://localhost:3000/password/updatepassword/${id}" method="get">
                                        <label for="newpassword">Enter New password</label>
                                        <input name="newpassword" type="password" required></input>
                                        <button>reset password</button>
                                    </form>
                                </html>`
                                )
            res.end()

        }
    })
}

const updatepassword = (req, res) => {

    try {
        const { newpassword } = req.query;
        const { resetpasswordid } = req.params;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {
            User.findOne({where: { id : resetpasswordrequest.UserId}}).then(user => {
 
                if(user) {
                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfully update the new password'})
                            })
                        });
                    });
            } else{
                return res.status(404).json({ error: 'No user Exists', success: false})
            }
            })
        })
    } catch(error){
        return res.status(403).json({ error, success: false } )
    }

}


module.exports = {
    forgotpassword,
    updatepassword,
    resetpassword
}

