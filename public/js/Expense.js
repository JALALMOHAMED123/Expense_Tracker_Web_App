document.addEventListener("DOMContentLoaded", function(){
    document.getElementById('createExpense').addEventListener('submit', function(event){
        event.preventDefault();
        const data={
            amount: event.target.amount.value,
            description: event.target.description.value,
            category: event.target.category.value
        };
        
        axios.post('/createExpense',data)
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
        const token=localStorage.getItem('token');
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


function deletefun(event, id){
    axios.delete(`/delete/${id}`)
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
                 <button onclick="deletefun(event, ${id})">Delete</button>`
    ul.appendChild(li);
}