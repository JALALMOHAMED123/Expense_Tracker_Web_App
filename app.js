const express=require('express');
const bodyparser=require('body-parser');
const https=require('https');

const path = require('path');
const ExpenseRoutes=require('./routes/Expense_routes');
const UsereRoutes=require('./routes/user_routes');
const PurchaseRoutes=require('./routes/purchase_routes');
const ResetpasswordRoutes=require('./routes/resetpassword_routes');
const sequelize=require('./util/db');
var cors = require('cors')
const User=require('./models/user');
const Expense=require('./models/expense');
const Order = require('./models/orders');
const Forgotpassword = require('./models/forgotpassword');
const dotenv = require('dotenv');
const History=require('./models/filedownload');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const app=express();
dotenv.config();

app.use(cors());
// app.use((err, req, res, next) => {
//     logger.error(err.message, { stack: err.stack });
//     res.status(500).send('Something went wrong in git!');
//   });
  
app.use(bodyparser.urlencoded({ extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public/views')));

// const privatekey=fs.readFileSync('server.key');
// const certificate=fs.readFileSync('server.cert');

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "defaultSrc": ["'self'"],
      "connectSrc": ["'self'", "https://lumberjack-cx.razorpay.com", "https://your-domain.com"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://code.jquery.com", "https://checkout.razorpay.com", "https://stackpath.bootstrapcdn.com"],
      "script-src-attr": ["'self'", "'unsafe-inline'"], 
      "frame-src": ["'self'", "https://api.razorpay.com/"],
    }
  })
);

app.use(compression());

app.get('/',(req,res)=>{
  res.redirect('/login.html');
});

app.use(UsereRoutes);
app.use(ExpenseRoutes);
app.use(PurchaseRoutes);
app.use(ResetpasswordRoutes);

app.use((req,res)=>{
  console.log('url',req.url);
  res.sendFile(path.join(__dirname,`public/${req.url}`));
});

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);

User.hasMany(History);
History.belongsTo(User);

sequelize
    .sync()
    .then(result => {
        console.log('Database and tables synced');
        // https
        // .createServer({key: privatekey, cert: certificate}, app)
        // .listen(process.env.PORT);
        app.listen(process.env.PORT);
    })
    .catch(err => {
        console.log(err.message);
    });