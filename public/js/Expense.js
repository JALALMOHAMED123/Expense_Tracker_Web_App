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
        const expenses= res.data;
        const ul = document.getElementById('list');
        ul.innerHTML = ''; 
        expenses.forEach(expense => {
            showDetails(expense.id, expense.amount, expense.category, expense.description );
        });
    } catch (error) {
        console.error('Error:', error);
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
            alert("You are a Premium Member Now");
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