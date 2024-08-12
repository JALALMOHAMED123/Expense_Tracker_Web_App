const token = localStorage.getItem('token'); 
document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('createExpense').addEventListener('submit', function(event){
        event.preventDefault();
        
        const data={
            amount: event.target.amount.value,
            description: event.target.description.value,
            category: event.target.category.value
        };
        
        axios.post('/createExpense',data,{
            headers: { "Authorization": token }
        })
        .then((response)=>{
            alert(response.data.message);
            document.getElementById('createExpense').reset();
            const { id, amount, category, description } = response.data.expense;
            showDetails(id, amount, category, description);
        })
        .catch((err)=>{
            alert(err);
        });
    });
});
window.addEventListener("DOMContentLoaded", async ()=>
{
    try{
        const res=await axios.get('/api/expenses', { headers: { "Authorization" :token }});
        console.log(res.data.premium);
        localStorage.setItem("premium", res.data.premium);
        const premium = localStorage.getItem('premium'); 
        if(premium!='null'){
            const lb = document.getElementById('leaderboard');
            lb.innerHTML = '<button id="leaderboard">Show leaderboard</button>';
        } else{
            const PR = document.getElementById('premium');
            PR.innerHTML = '<button id="premium">Buy Premium</button>';
        }
        const expenses= res.data.expenses;
        const ul = document.getElementById('list');
        ul.innerHTML = ''; 
        expenses.forEach(expense => {
            showDetails(expense.id, expense.amount, expense.category, expense.description );
        });
    } catch (error) {
        console.log('Error:', error.message);
    }
});


function deletefun(id){
    axios.delete(`/delete/${id}`, { headers: { "Authorization" :token }})
        .then((response)=>{
            alert(response.data.message);
            const expenseId=`${id}`;
            document.getElementById(expenseId).remove();
        })
        .catch((err)=>{
            alert(err);
        })
}
function showDetails(id, amount, category, des){
    const ul=document.getElementById('list');
    const li=document.createElement('li');
    li.setAttribute("id",id);
    li.innerHTML=`${amount} - ${category} - ${des}
                 <button onclick="deletefun(${id})">Delete</button>`
    ul.appendChild(li);
}

document.getElementById('premium').onclick=async function(event){
    console.log(token);
    const response=await axios.get('/PremiumMemberShip', {  headers: { "Authorization":token }});
    console.log(response);
    var options={
        "key": response.data.key_id,
        "order_id": response.data.order.id,
        "handler": async function (response) {
            await axios.post('/UpdatePremiumMemberShip',{
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
            }, {  headers: { "Authorization": token } })
            .then((res)=>{
                console.log(res.data.premium);
                if(res.data.premium){
                    document.getElementById('premium').remove();
                }
            })
            alert('You are a Premium Member Now')
        }
    }
    const rzp1=new Razorpay(options);
    rzp1.open();
    event.preventDefault();
    rzp1.on("payment failed", function(response){
        console.log(response);
        alert("Payment failed")
    });
}
document.getElementById('leaderboard').onclick=async function(){
    try{
    const res=await axios.get('/leaderboard')
    
    let expenses= res.data.AllExpenses;
    expenses.sort((a,b)=> b.amount-a.amount);
    console.log("success",expenses);
    let users=res.data.AllUsers;
    console.log("success",users);
    const ul = document.getElementById('AllExpenseslist');
    ul.innerHTML = '<h3>LeaderBoard</h3>'; 
    expenses.forEach(expense => {
        let user = users.find(user => user.id === expense.UserId);
        if (user) {
            AllExpenseDetails(user.name, expense.amount, expense.description);
        }
    });
    }
    catch(err){
        console.log("error:",err.message);
    }
}
function AllExpenseDetails(name, amount, des){
    const ul=document.getElementById('AllExpenseslist');
    
    const li=document.createElement('li');
    li.innerHTML=`${name} - ${amount} - ${des}`
    ul.appendChild(li);
}