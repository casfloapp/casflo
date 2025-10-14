
        // === VARIABEL GLOBAL & DATA ===
        let currentDate = new Date();
        let selectedDate = new Date();
        let currentView = 'overview';
        let calendarFilter = 'expense';

        let currentType = 'expense';
        let selectedCategory = null;
        let calcValue = '0';
        let transactions = [];
        let waitingForEquals = false;

        const expenseCategories = [ { id: 1, name: 'Diet', icon: '🍔', color: '#FEF3E2' }, { id: 2, name: 'Harian', icon: '🪴', color: '#E6F3F2' }, { id: 3, name: 'Transport', icon: '🚗', color: '#EBE9F9' }, { id: 4, name: 'Belanja', icon: '🛍️', color: '#FCE8E7' }, { id: 5, name: 'Hiburan', icon: '🎮', color: '#D4EDDA' }, { id: 6, name: 'Kesehatan', icon: '❤️', color: '#F8D7DA' }, { id: 7, name: 'Pendidikan', icon: '🎓', color: '#D1ECF1' }, { id: 8, name: 'Lainnya', icon: '...', color: '#F8F9FA' } ];
        const incomeCategories = [ { id: 101, name: 'Gaji', icon: '💰', color: '#D4EDDA' }, { id: 102, name: 'Bonus', icon: '🎁', color: '#D1ECF1' }, { id: 103, name: 'Investasi', icon: '📈', color: '#E2E3E5' }, { id: 104, name: 'Lainnya', icon: '...', color: '#F8F9FA' } ];
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        // === ELEMEN DOM ===
        const addView = document.getElementById('addView');
        const amountDisplay = document.getElementById('amountDisplay');
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

        // === FUNGSI UTAMA UNTUK NAVIGASI VIEW ===
        function setView(viewName) {
            currentView = viewName;
            localStorage.setItem('preferredView', currentView);
            
            const cardToShow = (viewName === 'calendar') ? calendarCard : overviewCard;
            const cardToHide = (viewName === 'calendar') ? overviewCard : calendarCard;
            
            detailToggleBtn.classList.toggle('active-view', viewName === 'overview');
            calendarToggleBtn.classList.toggle('active-view', viewName === 'calendar');

            cardToHide.classList.add('view-hidden');
            cardToShow.classList.remove('view-hidden');
            
            setTimeout(() => {
                viewContainer.style.height = cardToShow.offsetHeight + 'px';
            }, 50);

            if (viewName === 'calendar') {
                renderCalendar();
            }
        }
        
        function showAddView() {
            addView.classList.add('active');
            selectType('expense');
            clearCalc();
        }

        function showMainView() {
            addView.classList.remove('active');
        }

        // === FUNGSI KALENDER ===
        function setCalendarFilter(filter) {
            calendarFilter = filter;
            document.querySelectorAll('.calendar-summary-tabs .tab').forEach(t => t.classList.remove('active'));
            if (filter === 'expense') tabPengeluaran.classList.add('active');
            else if (filter === 'income') tabPenghasilan.classList.add('active');
            else tabTotal.classList.add('active');
            renderCalendar();
        }

        function updateMonthDisplay() {
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            currentMonthDisplay.textContent = `${String(month).padStart(2, '0')}/${year}`;
            updateMainView();
        }

        function goToPrevMonth() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            if(currentView === 'calendar') {
                renderCalendar();
            }
            updateMonthDisplay();
        }

        function goToNextMonth() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            if(currentView === 'calendar') {
                renderCalendar();
            }
            updateMonthDisplay();
        }
        
        function renderCalendar() {
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
                
                if (calendarFilter === 'expense') {
                    dailyTransactions = dailyTransactions.filter(t => t.type === 'expense');
                } else if (calendarFilter === 'income') {
                    dailyTransactions = dailyTransactions.filter(t => t.type === 'income');
                }

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
            if(currentView === 'calendar') {
                 viewContainer.style.height = calendarCard.offsetHeight + 'px';
            }
        }


        // === FUNGSI UNTUK ADD VIEW (POP-UP) ===
        function selectType(type) {
            currentType = type;
            document.querySelectorAll('.type-btn-header').forEach(btn => btn.classList.remove('active'));
            document.getElementById(type + 'Btn').classList.add('active');
            selectedCategory = null;
            loadCategories();
        }

        function loadCategories() {
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
            selectedCategory = category;
            document.querySelectorAll('.category-item').forEach(item => item.classList.remove('selected'));
            element.classList.add('selected');
        }

        // === FUNGSI LOGIKA KALKULATOR ===
        function appendToCalc(value) {
            const operators = ['+', '-', '*', '/'];
            if (operators.includes(value)) {
                waitingForEquals = true;
                changeButtonToEquals();
            }
            if (calcValue === '0' && !operators.includes(value)) calcValue = value;
            else {
                const lastChar = calcValue.slice(-1);
                if (operators.includes(lastChar) && operators.includes(value)) calcValue = calcValue.slice(0, -1) + value;
                else calcValue += value;
            }
            updateDisplay();
        }

        function deleteLast() {
            calcValue = calcValue.slice(0, -1) || '0';
            checkWaitingForEquals();
            updateDisplay();
        }

        function checkWaitingForEquals() {
            const hasOperator = ['+', '-', '*', '/'].some(op => calcValue.includes(op));
            if (!hasOperator) {
                waitingForEquals = false;
                changeButtonToCheck();
            }
        }

        function changeButtonToEquals() {
            const actionBtn = document.getElementById('actionBtn');
            actionBtn.className = 'action-btn equals';
            actionBtn.innerHTML = '<i class="fas fa-equals"></i>';
        }

        function changeButtonToCheck() {
            const actionBtn = document.getElementById('actionBtn');
            actionBtn.className = 'action-btn check';
            actionBtn.innerHTML = '<i class="fas fa-check"></i>';
        }

        function handleActionClick() {
            if (waitingForEquals) calculateResult();
            else saveTransaction();
        }

        function calculateResult() {
            try {
                let expression = calcValue.replace(/×/g, '*').replace(/÷/g, '/');
                const result = new Function('return ' + expression)();
                calcValue = String(result);
                waitingForEquals = false;
                changeButtonToCheck();
                updateDisplay();
            } catch (e) {
                calcValue = '0';
                updateDisplay();
            }
        }

        function clearCalc() {
            calcValue = '0';
            waitingForEquals = false;
            changeButtonToCheck();
            updateDisplay();
        }

        function updateDisplay() {
            amountDisplay.textContent = calcValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }

        function saveTransaction() {
            const amount = parseFloat(calcValue);
            if (isNaN(amount) || amount <= 0) return alert('Masukkan jumlah yang valid');
            if (!selectedCategory) return alert('Pilih kategori terlebih dahulu');
            
            const transaction = { 
                id: Date.now(), 
                type: currentType, 
                amount, 
                category: selectedCategory.name, 
                notes: 'diri sendiri',
                account: 'akun bawaan',
                icon: selectedCategory.icon,
                color: selectedCategory.color,
                date: new Date(currentDate)
            };
            
            transactions.push(transaction);
            updateMainView();
            showMainView();
        }

        // === FUNGSI UNTUK UPDATE DASHBOARD VIEW ===
        function updateMainView() {
            const filteredTransactions = transactions.filter(t => 
                t.date.getMonth() === currentDate.getMonth() &&
                t.date.getFullYear() === currentDate.getFullYear()
            );

            const income = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
            const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
            const total = income - expense;
            
            const formatCurrency = (value) => {
                const sign = value < 0 ? '-' : '';
                return `${sign}Rp${Math.abs(value).toLocaleString('id-ID')}`;
            };
            
            document.getElementById('totalAmount').textContent = formatCurrency(total);
            document.getElementById('incomeAmount').textContent = formatCurrency(income);
            document.getElementById('expenseAmount').textContent = formatCurrency(expense);
            
            document.getElementById('calendarTotalAmount').textContent = formatCurrency(total);
            document.getElementById('calendarIncomeAmount').textContent = formatCurrency(income);
            document.getElementById('calendarExpenseAmount').textContent = formatCurrency(expense);

            renderTransactionList(filteredTransactions);
        }

        function renderTransactionList(filteredTransactions) {
            const transactionListEl = document.querySelector('.transaction-list');
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
                    <span>Sel, 14/10</span>
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
                    <div class="icon" style="background-color: ${t.color};">
                        <span>${t.icon}</span> 
                    </div>
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
        
        // === INISIALISASI HALAMAN ===
        document.addEventListener('DOMContentLoaded', () => {
            detailToggleBtn.addEventListener('click', () => setView('overview'));
            calendarToggleBtn.addEventListener('click', () => setView('calendar'));
            
            prevMonthBtn.addEventListener('click', goToPrevMonth);
            nextMonthBtn.addEventListener('click', goToNextMonth);
            calendarPrevMonthBtn.addEventListener('click', goToPrevMonth);
            calendarNextMonthBtn.addEventListener('click', goToNextMonth);
            tabPengeluaran.addEventListener('click', () => setCalendarFilter('expense'));
            tabPenghasilan.addEventListener('click', () => setCalendarFilter('income'));
            tabTotal.addEventListener('click', () => setCalendarFilter('total'));

            loadCategories();
            
            const savedView = localStorage.getItem('preferredView');
            if (savedView) {
                setTimeout(() => setView(savedView), 0);
            } else {
                 setView('overview');
            }

            updateMonthDisplay();
        });