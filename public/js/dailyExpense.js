let currentPage = 1;
const itemsPerPage = 5;
let totalItems = 0;
var expenses = [];
var weeklySummary = [];
var monthlySummary = [];

window.addEventListener("DOMContentLoaded", async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/dailyExpense', { headers: { "Authorization": token }});
        
        expenses = response.data.expenses;
        if (expenses && expenses.length > 0) {
            loadExpenses(expenses);
            generateWeeklySummary(expenses);
            generateMonthlySummary(expenses);
            displayWeeklySummary();
            displayMonthlySummary();
        } else {
            console.log('No expenses found');
        }
    } catch (err) {
        console.error('Error:', err.message);
        alert(err.message);
    }
});

function loadExpenses(expenses) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedExpenses = expenses.slice(start, end);
    
    const tableBody = document.getElementById('expenseTable');
    tableBody.innerHTML = '';
    
    paginatedExpenses.forEach(expense => {
        const date = new Date(expense.createdAt).toLocaleDateString('en-GB');
        const row = `
            <tr>
                <td>${date}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
    
    setupPagination(expenses);
}

function setupPagination(expenses) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    totalItems = expenses.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', function() {
            currentPage = i;
            loadExpenses(expenses);
        });
        pagination.appendChild(li);
    }
}

function generateWeeklySummary(expenses) {
    const weeklyMap = new Map();
    expenses.forEach(expense => {
        const date = new Date(expense.createdAt);
        const startOfWeek = getStartOfWeek(date);
        const endOfWeek = getEndOfWeek(date);
        const weekKey = `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
        
        if (!weeklyMap.has(weekKey)) {
            weeklyMap.set(weekKey, 0);
        }
        weeklyMap.set(weekKey, weeklyMap.get(weekKey) + expense.amount);
    });
    
    weeklySummary = Array.from(weeklyMap, ([week, total]) => ({ week, total }));
}

function generateMonthlySummary(expenses) {
    const monthlyMap = new Map();
    expenses.forEach(expense => {
        const date = new Date(expense.createdAt);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!monthlyMap.has(monthYear)) {
            monthlyMap.set(monthYear, 0);
        }
        monthlyMap.set(monthYear, monthlyMap.get(monthYear) + expense.amount);
    });
    
    monthlySummary = Array.from(monthlyMap, ([month, total]) => ({ month, total }));
}

function displayWeeklySummary() {
    const tableBody = document.querySelector('#weeklyReport');
    tableBody.innerHTML = '';
    
    weeklySummary.forEach(summary => {
        const row = `
            <tr>
                <td>${summary.week}</td>
                <td>${summary.total}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function displayMonthlySummary() {
    const tableBody = document.querySelector('#monthlyReport');
    tableBody.innerHTML = '';
    
    monthlySummary.forEach(summary => {
        const row = `
            <tr>
                <td>${summary.month}</td>
                <td>${summary.total}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function getStartOfWeek(date) {
    const day = date.getDay() || 7;
    if (day !== 1) date.setHours(-24 * (day - 1));
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getEndOfWeek(date) {
    const day = date.getDay() || 7;
    if (day !== 7) date.setHours(24 * (7 - day));
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date) {
    return date.toLocaleDateString('en-GB');
}
function logout(){
    localStorage.removeItem('token');
    window.location.href='/login.html'
}