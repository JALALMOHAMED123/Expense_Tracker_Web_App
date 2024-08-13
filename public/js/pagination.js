document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;
    const expenses = []; // This will be filled with data from the backend

    // Mock data fetch function (replace this with an actual API call)
    function fetchExpenses() {
        return [
            { date: '2024-01-01', description: 'Milk', category: 'Grocery', amount: 50 },
            { date: '2024-01-02', description: 'Electricity Bill', category: 'Utility', amount: 150 },
            // Add more mock expenses here...
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

        // Update pagination info
        document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;

        // Enable/Disable buttons
        document.getElementById('prev-btn').disabled = currentPage === 1;
        document.getElementById('next-btn').disabled = currentPage === totalPages;
    }

    function initPagination() {
        expenses.push(...fetchExpenses()); // Fetch expenses (replace with actual data)
        totalPages = Math.ceil(expenses.length / itemsPerPage);
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
    }

    initPagination();
});
