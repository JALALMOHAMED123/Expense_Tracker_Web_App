document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem('token');
    let pageSize = localStorage.getItem('pageSize') || 5;

    document.getElementById('createExpense').addEventListener('submit', function(event) {
        event.preventDefault();
        const data = {
            amount: event.target.amount.value,
            description: event.target.description.value,
            category: event.target.category.value
        };
        
        axios.post('/createExpense', data, {
            headers: { "Authorization": token }
        })
        .then(response => {
            alert(response.data.message);
            document.getElementById('createExpense').reset();
            loadInitialExpenses(); 
        })
        .catch(err => alert(err.message));
    });

    loadInitialExpenses();

    async function loadInitialExpenses() {
        try {
            const page = 1;
            const res = await axios.get(`/api/paginatedExpenses?page=${page}&pagesize=${pageSize}`, { 
                headers: { "Authorization": token }
            });

            if (res.data.expenses.length > 0) {
                setupPagination(res.data);
                listProducts(res.data.expenses);
            }

            handlePremiumUser(res.data.premium);
        } catch (error) {
            console.log('Error:', error.message);
        }
    }

    function setupPagination({ expenses, ...pageData }) {
        const ps = document.getElementById('rows_pagination');
        ps.innerHTML = `
            <label for="pagesize">Rows per page:</label>
            <select id="pagesize" class="form-select w-auto">
                <option value="2" ${pageSize == 2 ? 'selected' : ''}>2</option>
                <option value="5" ${pageSize == 5 ? 'selected' : ''}>5</option>
                <option value="10" ${pageSize == 10 ? 'selected' : ''}>10</option>
                <option value="25" ${pageSize == 25 ? 'selected' : ''}>25</option>
                <option value="50" ${pageSize == 50 ? 'selected' : ''}>50</option>
            </select>
        `;

        document.getElementById('pagesize').addEventListener('change', function() {
            pageSize = this.value;
            localStorage.setItem('pageSize', pageSize); 
            getExpenses(1, pageSize); 
        });
        
        showPagination(pageData, pageSize);
    }

    function handlePremiumUser(isPremium) {
        const lb = document.getElementById('leaderboard');
        const DE = document.getElementById('downloadExpense');
        const SE = document.getElementById('dailyExpense');
        const PR = document.getElementById('premium');

        if (isPremium) {
            lb.innerHTML = '<a id="leaderboard" style="cursor:pointer;" class="nav-link">Show leaderboard</a>';
            DE.innerHTML = '<a id="downloadExpense" style="cursor:pointer;" class="nav-link">Download Expense</a>';
            SE.innerHTML = '<h5 style="color: red; margin-right: 15px; margin-bottom: 0;">Premium user</h5><a id="dailyExpense" href ="/dailyExpense.html" class="nav-link">Daily Expense</a>';
            loadDownloadHistory();
        } else {
            PR.innerHTML = '<button id="premium" class="btn btn-warning">Buy Premium</button>';
        }
    }

    async function loadDownloadHistory() {
        try {
            const res = await axios.get('/user/downloadhistory', { headers: { "Authorization": token } });
            const hs = res.data.history;
            const ul = document.getElementById('fileHistorylist');
            ul.innerHTML = '<h3>Download History</h3>'; 
            hs.forEach(history => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.innerHTML = `<a href='${history.path}'>Expense(${history.id})</a>`;
                ul.appendChild(li);
            });
        } catch (err) {
            alert(err.message);
        }
    }

    function listProducts(expenses) {
        const ul = document.getElementById('list');
        ul.innerHTML = '<h3 class="mt-4">Expenses List</h3>';
        expenses.forEach(expense => {
            showDetails(expense.id, expense.amount, expense.category, expense.description);
        });
    }

    function showDetails(id, amount, category, des) {
        const ul = document.getElementById('list');
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.setAttribute("id", `expense-${id}`);
        li.innerHTML = `${amount} - ${category} - ${des}
                        <button onclick="deletefun(${id})" class="btn btn-danger btn-sm">Delete</button>`;
        ul.appendChild(li);
    }

    function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage }, pageSize) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        if (hasPreviousPage) {
            const btnPrev = document.createElement('button');
            btnPrev.innerHTML = 'Previous';
            btnPrev.className = 'btn btn-secondary btn-sm';
            btnPrev.addEventListener('click', () => getExpenses(previousPage, pageSize));
            pagination.appendChild(btnPrev);
        }

        const btnCurrent = document.createElement('button');
        btnCurrent.innerHTML = `Page ${currentPage}`;
        btnCurrent.className = 'btn btn-primary btn-sm';
        btnCurrent.addEventListener('click', () => getExpenses(currentPage, pageSize));
        pagination.appendChild(btnCurrent);

        if (hasNextPage) {
            const btnNext = document.createElement('button');
            btnNext.innerHTML = 'Next';
            btnNext.className = 'btn btn-secondary btn-sm';
            btnNext.addEventListener('click', () => getExpenses(nextPage, pageSize));
            pagination.appendChild(btnNext);
        }
    }

    function getExpenses(page, pageSize = 5) {
        axios.get(`/api/paginatedExpenses?page=${page}&pagesize=${pageSize}`, { headers: { "Authorization": token } })
            .then(({ data: { expenses, ...pageData } }) => {
                listProducts(expenses);
                showPagination(pageData, pageSize);
            })
            .catch(err => console.log(err.message));
    }

    document.getElementById('downloadExpense').onclick = function() {
        axios.get('/user/download', { headers: { "Authorization": token } })
            .then(response => {
                if (response.status === 200) {
                    const a = document.createElement("a");
                    a.href = response.data.fileurl;
                    a.download = 'myexpense.csv';
                    a.click();
                } else {
                    alert('File URL not found');
                }
            })
            .catch(err => alert(err.message));
    };

    document.getElementById('premium').onclick = async function(event) {
        try {
            const response = await axios.get('/PremiumMemberShip', { headers: { "Authorization": token } });
            const options = {
                "key": response.data.key_id,
                "order_id": response.data.order.id,
                "handler": async function(paymentResponse) {
                    await axios.post('/UpdatePremiumMemberShip', {
                        order_id: options.order_id,
                        payment_id: paymentResponse.razorpay_payment_id
                    }, { headers: { "Authorization": token } })
                    .then(res => {
                        alert('You are a Premium Member Now');
                        handlePremiumUser(res.data.premium);
                    });
                }
            };
            const rzp1 = new Razorpay(options);
            rzp1.open();
            event.preventDefault();
            rzp1.on("payment.failed", function(response) {
                alert("Payment failed");
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    document.getElementById('leaderboard').onclick = async function() {
        try {
            const res = await axios.get('/leaderboard', { headers: { "Authorization": token } });
            const ul = document.getElementById('AllExpenseslist');
            ul.innerHTML = '<h3>LeaderBoard</h3>'; 
            res.data.leaderboardofusers.forEach(expense => {
                AllExpenseDetails(expense.name, expense.totalExpense);
            });
        } catch (err) {
            console.log('Error:', err.message);
        }
    };
    let i=1;
    function AllExpenseDetails(name, cost) {
        const ul = document.getElementById('AllExpenseslist');
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `${i++}) Name - ${name} | Total Expense - ${cost}`;
        ul.appendChild(li);
    }

});

function deletefun(id) {
    const token = localStorage.getItem('token');
    axios.delete(`/delete/${id}`, { headers: { "Authorization": token } })
        .then(response => {
            alert(response.data.message);
            document.getElementById(`expense-${id}`).remove();
        })
        .catch(err => alert(err.message));
}
function logout(){
    localStorage.removeItem('token');
    window.location.href='/login.html'
}