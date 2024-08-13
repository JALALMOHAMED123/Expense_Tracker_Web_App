document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    let itemsPerPage = parseInt(localStorage.getItem('itemsPerPage')) || 10;
    const expenses = []; 

    
    function fetchExpenses() {
        return [
            { date: '2024-01-01', description: 'Milk', category: 'Grocery', amount: 50 },
            { date: '2024-01-02', description: 'Electricity Bill', category: 'Utility', amount: 150 },
        ];
    }

    function renderExpenses() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedExpenses = expenses.slice(start, end);

        const tableBody = document.getElementById('expense-table-body');
        tableBody.innerHTML = '';

        paginatedExpenses.forEach(expense => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${expense.date}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td>${expense.amount}</td>
            `;
            tableBody.appendChild(row);
        });

        const totalPages = Math.ceil(expenses.length / itemsPerPage);
        document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;

        document.getElementById('prev-btn').disabled = currentPage === 1;
        document.getElementById('next-btn').disabled = currentPage === totalPages;
    }

    function initPagination() {
        expenses.push(...fetchExpenses()); 
        renderExpenses();

        document.getElementById('prev-btn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderExpenses();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderExpenses();
            }
        });

        document.getElementById('rows-select').addEventListener('change', function() {
            itemsPerPage = parseInt(this.value);
            localStorage.setItem('itemsPerPage', itemsPerPage);
            currentPage = 1; 
            renderExpenses();
        });

        document.getElementById('rows-select').value = itemsPerPage;
    }

    initPagination();
});
