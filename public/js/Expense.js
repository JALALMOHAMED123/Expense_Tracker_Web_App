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
            fetchExpenses(); 
        })
        .catch((err)=>{
            alert(err);
        });

        axios.get(`/delete/${id}`, data)
        .then((response)=>{
            alert(response.data.message);
            fetchExpenses();
        })
        .catch((err)=>{
            alert(err);
        })
    });
});

function showDetails(id, amount, category, des){
    const ul=document.getElementById('list');
    const li=document.createElement('li');
    li.innerHTML=`${amount} - ${category} - ${des}
                 <a href="delete/${id}">Delete</a>`
    ul.appendChild(li);
}
async function fetchExpenses(){
    try{
        const res=await axios.get('/api/expenses');
        const expenses= res.data;
        const ul = document.getElementById('list');
        ul.innerHTML = ''; 
        expenses.forEach(expense => {
            showDetails(expense.id, expense.amount, expense.description, expense.category);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
window.onload=fetchExpenses();