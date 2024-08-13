document.addEventListener('DOMContentLoaded', function() {
    const isPremiumUser = false; 
    const downloadBtn = document.getElementById('downloadBtn');

    if (isPremiumUser) {
        downloadBtn.disabled = false;
    }

    
    downloadBtn.addEventListener('click', function() {
        if (isPremiumUser) {
            downloadExpenses();
        } else {
            alert('Upgrade to premium to download expenses.');
        }
    });

    document.getElementById('downloadBtn').addEventListener('click', async function() {
        try {
            const response = await fetch('/api/download-expenses', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (response.status === 401) {
                alert('Unauthorized. Upgrade to premium to access this feature.');
                return;
            }
    
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'expenses.csv';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('Error downloading expenses. Please try again.');
            }
    
        } catch (error) {
            console.error('Error:', error);
            alert('Server error. Please try again later.');
        }
    });
    
});
