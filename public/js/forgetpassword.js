const Sib=require('sib-api-v3-sdk');
const client=Sib.ApiClient.instance

const apikey=client.authentications['api-key'];
apikey.apikey=process.env.API_KEY;

const transapi=new Sib.TransactionalEmailApi();

const sender={
    email: 'jalalmohamed2702@gmail.com',
    name: 'Jalal Mohamed'
}

const receivers=[
    {
        email: 'virat@gmail.com',
    },
]

transapi.sendTransacEmail({
    sender,
    to: receivers,
    subject: 'Forget password',
    textContent: 'some text here{{params}}',
    htmlContent:'<h1>HI</h1>',
    params:{
        role: 'Frontend'
    }
}).then(console.log)
.catch(console.log)
