// === INISIALISASI STATE GLOBAL ===
// Pastikan state tidak di-reset setiap kali navigasi
if (!window.appState) {
    window.appState = {
        currentDate: new Date(),
        selectedDate: new Date(),
        currentView: 'overview',
        calendarFilter: 'expense',
        transactions: [],
        // state untuk pop-up kalkulator
        currentType: 'expense',
        selectedCategory: null,
        calcValue: '0',
        waitingForEquals: false,
    };
}

// === DATA KONSTAN APLIKASI ===
const expenseCategories = [ { id: 1, name: 'Diet', icon: '🍔', color: '#FEF3E2' }, { id: 2, name: 'Harian', icon: '🪴', color: '#E6F3F2' }, { id: 3, name: 'Transport', icon: '🚗', color: '#EBE9F9' }, { id: 4, name: 'Belanja', icon: '🛍️', color: '#FCE8E7' }, { id: 5, name: 'Hiburan', icon: '🎮', color: '#D4EDDA' }, { id: 6, name: 'Kesehatan', icon: '❤️', color: '#F8D7DA' }, { id: 7, name: 'Pendidikan', icon: '🎓', color: '#D1ECF1' }, { id: 8, name: 'Lainnya', icon: '...', color: '#F8F9FA' } ];
const incomeCategories = [ { id: 101, name: 'Gaji', icon: '💰', color: '#D4EDDA' }, { id: 102, name: 'Bonus', icon: '🎁', color: '#D1ECF1' }, { id: 103, name: 'Investasi', icon: '📈', color: '#E2E3E5' }, { id: 104, name: 'Lainnya', icon: '...', color: '#F8F9FA' } ];
const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];


/**
 * Fungsi ini mengumpulkan semua logika dan event listener yang perlu dijalankan
 * setiap kali konten halaman baru dimuat oleh SPA.
 */
function initializePageEventListeners() {
    
    // Ambil state dari objek global
    let { 
        currentDate, selectedDate, currentView, calendarFilter, transactions,
        currentType, selectedCategory, calcValue, waitingForEquals 
    } = window.appState;

    // === ELEMEN DOM (selalu dicari ulang setiap navigasi) ===
    const addView = document.getElementById('addView');
    const viewContainer = document.getElementById('viewContainer');
    const overviewCard = document.getElementById('overviewCard');
    const calendarCard = document.getElementById('calendarCard');
    const detailToggleBtn = document.getElementById('detailToggleBtn');
    const calendarToggleBtn = document.getElementById('calendarToggleBtn');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const currentMonthDisplay = document.getElementById('currentMonthDisplay');
    const calendarGrid = document.getElementById('calendarGrid');
    const calendarMonthYear = document.getElementById('calendarMonthYear');
    const calendarPrevMonthBtn = document.getElementById('calendarPrevMonthBtn');
    const calendarNextMonthBtn = document.getElementById('calendarNextMonthBtn');
    const tabPengeluaran = document.getElementById('tabPengeluaran');
    const tabPenghasilan = document.getElementById('tabPenghasilan');
    const tabTotal = document.getElementById('tabTotal');
    const fab = document.querySelector('.fab');

    // === FUNGSI-FUNGSI LOGIKA APLIKASI ===

    function setView(viewName) {
        window.appState.currentView = viewName;
        currentView = viewName;
        localStorage.setItem('preferredView', currentView);
        
        if (!overviewCard || !calendarCard || !viewContainer) return;
        
        const cardToShow = (viewName === 'calendar') ? calendarCard : overviewCard;
        const cardToHide = (viewName === 'calendar') ? overviewCard : calendarCard;
        
        detailToggleBtn.classList.toggle('active-view', viewName === 'overview');
        calendarToggleBtn.classList.toggle('active-view', viewName === 'calendar');

        cardToHide.classList.add('view-hidden');
        cardToShow.classList.remove('view-hidden');
        
        setTimeout(() => {
            if (cardToShow.offsetHeight > 0) {
                viewContainer.style.height = cardToShow.offsetHeight + 'px';
            }
        }, 50);

        if (viewName === 'calendar') {
            renderCalendar();
        }
    }
    
    function showAddView() {
        if (!addView) return;
        addView.classList.add('active');
        selectType('expense');
        clearCalc();
    }

    function showMainView() {
        if (!addView) return;
        addView.classList.remove('active');
    }

    function setCalendarFilter(filter) {
        window.appState.calendarFilter = filter;
        calendarFilter = filter;
        if (tabPengeluaran && tabPenghasilan && tabTotal) {
            document.querySelectorAll('.calendar-summary-tabs .tab').forEach(t => t.classList.remove('active'));
            if (filter === 'expense') tabPengeluaran.classList.add('active');
            else if (filter === 'income') tabPenghasilan.classList.add('active');
            else tabTotal.classList.add('active');
            renderCalendar();
        }
    }

    function updateMonthDisplay() {
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        if (currentMonthDisplay) {
            currentMonthDisplay.textContent = `${String(month).padStart(2, '0')}/${year}`;
        }
        updateMainView();
    }

    function goToPrevMonth() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        window.appState.currentDate = currentDate;
        if(currentView === 'calendar') renderCalendar();
        updateMonthDisplay();
    }

    function goToNextMonth() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        window.appState.currentDate = currentDate;
        if(currentView === 'calendar') renderCalendar();
        updateMonthDisplay();
    }
    
    function renderCalendar() {
        if (!calendarGrid || !calendarMonthYear) return;

        calendarGrid.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarGrid.insertAdjacentHTML('beforeend', `<div></div>`);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            const date = new Date(year, month, i);
            const dayOfWeek = date.getDay();

            if (dayOfWeek === 0 || dayOfWeek === 6) dayEl.classList.add('weekend');
            if (i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) dayEl.classList.add('selected');
            
            dayEl.innerHTML = `<span class="date-number">${i}</span>`;
            
            let dailyTransactions = transactions.filter(t => new Date(t.date).toDateString() === date.toDateString());
            
            if (calendarFilter === 'expense') dailyTransactions = dailyTransactions.filter(t => t.type === 'expense');
            else if (calendarFilter === 'income') dailyTransactions = dailyTransactions.filter(t => t.type === 'income');

            const dailyTotal = dailyTransactions.reduce((sum, t) => sum + (t.type === 'expense' ? -t.amount : t.amount), 0);

            if(dailyTotal !== 0){
                const summaryEl = document.createElement('span');
                summaryEl.className = 'day-summary';
                summaryEl.style.backgroundColor = dailyTotal < 0 ? 'var(--expense-red)' : 'var(--income-green)';
                if (calendarFilter === 'total' && dailyTotal > 0) summaryEl.style.backgroundColor = 'var(--income-green)';
                summaryEl.textContent = `${dailyTotal < 0 ? '-' : ''}${Math.abs(dailyTotal/1000).toFixed(0)}rb`;
                dayEl.appendChild(summaryEl);
            }
            calendarGrid.appendChild(dayEl);
        }
        if(currentView === 'calendar' && viewContainer && calendarCard) {
             viewContainer.style.height = calendarCard.offsetHeight + 'px';
        }
    }
    
    function updateMainView() {
        const transactions = window.appState.transactions;
        const filteredTransactions = transactions.filter(t => 
            new Date(t.date).getMonth() === currentDate.getMonth() &&
            new Date(t.date).getFullYear() === currentDate.getFullYear()
        );

        const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
        const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        const total = income - expense;
        
        const formatCurrency = (value) => {
            const sign = value < 0 ? '-' : '';
            return `${sign}Rp${Math.abs(value).toLocaleString('id-ID')}`;
        };
        
        const totalAmountEl = document.getElementById('totalAmount');
        if (totalAmountEl) totalAmountEl.textContent = formatCurrency(total);
        
        const incomeAmountEl = document.getElementById('incomeAmount');
        if (incomeAmountEl) incomeAmountEl.textContent = formatCurrency(income);

        const expenseAmountEl = document.getElementById('expenseAmount');
        if (expenseAmountEl) expenseAmountEl.textContent = formatCurrency(expense);

        const calTotalAmountEl = document.getElementById('calendarTotalAmount');
        if(calTotalAmountEl) calTotalAmountEl.textContent = formatCurrency(total);

        const calIncomeAmountEl = document.getElementById('calendarIncomeAmount');
        if(calIncomeAmountEl) calIncomeAmountEl.textContent = formatCurrency(income);

        const calExpenseAmountEl = document.getElementById('calendarExpenseAmount');
        if(calExpenseAmountEl) calExpenseAmountEl.textContent = formatCurrency(expense);

        renderTransactionList(filteredTransactions);
    }

    function renderTransactionList(filteredTransactions) {
        const transactionListEl = document.querySelector('.transaction-list');
        if (!transactionListEl) return;
        
        transactionListEl.innerHTML = '';
        
        if (filteredTransactions.length === 0) {
             transactionListEl.innerHTML = `<div class="empty-transaction-list">Belum ada transaksi di bulan ini</div>`;
             return;
        }

        const listHeader = document.createElement('div');
        listHeader.className = 'list-header';
        let totalExpenseToday = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
        listHeader.innerHTML = `
            <div class="date-info">
                <i class="fas fa-chevron-down fa-xs"></i>
                <span>Hari Ini</span>
            </div>
            <div class="summary">
                Pengeluaran: Rp${totalExpenseToday.toLocaleString('id-ID')}
            </div>
        `;
        transactionListEl.appendChild(listHeader);

        filteredTransactions.forEach(t => {
            const itemEl = document.createElement('div');
            itemEl.className = 'transaction-item';
            itemEl.innerHTML = `
                <div class="icon" style="background-color: ${t.color};"><span>${t.icon}</span></div>
                <div class="details">
                    <div class="category">${t.category}</div>
                    <div class="notes">${t.notes}</div>
                </div>
                <div class="info">
                    <div class="amount" style="color: ${t.type === 'expense' ? 'var(--expense-red)' : 'var(--income-green)'}">
                        ${t.type === 'expense' ? '-' : ''}Rp${t.amount.toLocaleString('id-ID')}
                    </div>
                    <div class="account">${t.account}</div>
                </div>
            `;
            transactionListEl.appendChild(itemEl);
        });
    }

    function selectType(type) {
        window.appState.currentType = type;
        const expenseBtn = document.getElementById('expenseBtn');
        if(expenseBtn) {
            document.querySelectorAll('.type-btn-header').forEach(btn => btn.classList.remove('active'));
            document.getElementById(type + 'Btn').classList.add('active');
            window.appState.selectedCategory = null;
            loadCategories();
        }
    }
    
    function loadCategories() {
        const addView = document.getElementById('addView');
        if(!addView) return;
        const currentType = window.appState.currentType;
        const categories = currentType === 'expense' ? expenseCategories : incomeCategories;
        const recommendedGrid = document.getElementById('recommendedGrid');
        const uncategorizedGrid = document.getElementById('uncategorizedGrid');
        recommendedGrid.innerHTML = '';
        uncategorizedGrid.innerHTML = '';
        categories.slice(0, 4).forEach(cat => recommendedGrid.appendChild(createCategoryElement(cat)));
        categories.slice(4).forEach(cat => uncategorizedGrid.appendChild(createCategoryElement(cat)));
    }
    function createCategoryElement(category) {
        const div = document.createElement('div');
        div.className = 'category-item';
        div.onclick = () => selectCategory(category, div);
        div.innerHTML = `<div class="category-icon" style="background: ${category.color}">${category.icon}</div><div class="category-name">${category.name}</div>`;
        return div;
    }
    function selectCategory(category, element) {
        window.appState.selectedCategory = category;
        document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'));
        element.classList.add('selected');
    }
    function appendToCalc(value) {
        let { calcValue } = window.appState;
        const operators = ['+', '-', '*', '/'];
        if (operators.includes(value)) window.appState.waitingForEquals = true;
        if (calcValue === '0' && !operators.includes(value)) calcValue = value;
        else {
            const lastChar = calcValue.slice(-1);
            if (operators.includes(lastChar) && operators.includes(value)) calcValue = calcValue.slice(0, -1) + value;
            else calcValue += value;
        }
        window.appState.calcValue = calcValue;
        updateDisplay();
    }
    function deleteLast() {
        let { calcValue } = window.appState;
        calcValue = calcValue.slice(0, -1) || '0';
        window.appState.calcValue = calcValue;
        checkWaitingForEquals();
        updateDisplay();
    }
    function checkWaitingForEquals() {
        const hasOperator = ['+', '-', '*', '/'].some(op => window.appState.calcValue.includes(op));
        if (!hasOperator) window.appState.waitingForEquals = false;
        toggleActionButton();
    }
    function toggleActionButton() {
        const actionBtn = document.getElementById('actionBtn');
        if(!actionBtn) return;
        if(window.appState.waitingForEquals) {
            actionBtn.className = 'action-btn equals';
            actionBtn.innerHTML = '<i class="fas fa-equals"></i>';
        } else {
            actionBtn.className = 'action-btn check';
            actionBtn.innerHTML = '<i class="fas fa-check"></i>';
        }
    }
    function handleActionClick() {
        if (window.appState.waitingForEquals) calculateResult();
        else saveTransaction();
    }
    function calculateResult() {
        try {
            let expression = window.appState.calcValue.replace(/×/g, '*').replace(/÷/g, '/');
            const result = new Function('return ' + expression)();
            window.appState.calcValue = String(result);
            window.appState.waitingForEquals = false;
            toggleActionButton();
            updateDisplay();
        } catch (e) {
            window.appState.calcValue = '0';
            updateDisplay();
        }
    }
    function clearCalc() {
        window.appState.calcValue = '0';
        window.appState.waitingForEquals = false;
        const amountDisplay = document.getElementById('amountDisplay');
        if(amountDisplay) {
            toggleActionButton();
            updateDisplay();
        }
    }
    function updateDisplay() {
        const amountDisplay = document.getElementById('amountDisplay');
        if(amountDisplay) amountDisplay.textContent = window.appState.calcValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    function saveTransaction() {
        const amount = parseFloat(window.appState.calcValue);
        if (isNaN(amount) || amount <= 0) return alert('Masukkan jumlah yang valid');
        if (!window.appState.selectedCategory) return alert('Pilih kategori terlebih dahulu');
        
        const transaction = { 
            id: Date.now(), 
            type: window.appState.currentType, 
            amount, 
            category: window.appState.selectedCategory.name, 
            notes: 'diri sendiri',
            account: 'akun bawaan',
            icon: window.appState.selectedCategory.icon,
            color: window.appState.selectedCategory.color,
            date: new Date(currentDate)
        };
        
        window.appState.transactions.push(transaction);
        updateMainView();
        showMainView();
    }

    // === ATUR EVENT LISTENERS ===
    if (detailToggleBtn) detailToggleBtn.addEventListener('click', () => setView('overview'));
    if (calendarToggleBtn) calendarToggleBtn.addEventListener('click', () => setView('calendar'));
    if (prevMonthBtn) prevMonthBtn.addEventListener('click', goToPrevMonth);
    if (nextMonthBtn) nextMonthBtn.addEventListener('click', goToNextMonth);
    if (calendarPrevMonthBtn) calendarPrevMonthBtn.addEventListener('click', goToPrevMonth);
    if (calendarNextMonthBtn) calendarNextMonthBtn.addEventListener('click', goToNextMonth);
    if (tabPengeluaran) tabPengeluaran.addEventListener('click', () => setCalendarFilter('expense'));
    if (tabPenghasilan) tabPenghasilan.addEventListener('click', () => setCalendarFilter('income'));
    if (tabTotal) tabTotal.addEventListener('click', () => setCalendarFilter('total'));
    if (fab) fab.addEventListener('click', showAddView);

    // Inisialisasi Tampilan Awal
    const savedView = localStorage.getItem('preferredView');
    if (savedView) {
        setView(savedView);
    } else {
        setView('overview');
    }

    updateMonthDisplay();
}

// === LOGIKA NAVIGASI SPA (DI LUAR FUNGSI INISIALISASI) ===
async function navigate(path) {
    try {
        const response = await fetch(path, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
        if (!response.ok) throw new Error('Network response not ok');
        const newContent = await response.text();
        document.getElementById('page-content-wrapper').innerHTML = newContent;
        window.history.pushState({path: path}, '', path);
        initializePageEventListeners();
    } catch (error) {
        console.error('Failed to fetch page:', error);
        window.location.href = path;
    }
};

function handleNavClick(event) {
    event.preventDefault();
    const path = event.currentTarget.getAttribute('href');
    if (path && path !== window.location.pathname) {
        navigate(path);
    }
};

window.addEventListener('popstate', () => {
    navigate(window.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.bottom-nav a.nav-item').forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    initializePageEventListeners();
});