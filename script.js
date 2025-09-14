// Paimon Store - Main JavaScript File


let accounts = [];
let isAdminLoggedIn = false;
let isPriceEditingUnlocked = false;
let currentEditingAccount = null;
let settings = {
    whatsappNumber: '601174917685',
    adminPassword: 'admin123'
};


document.addEventListener('DOMContentLoaded', function() {
    console.log('Paimon Store initialized');
    loadData();
    setupNavigation();
    renderAccounts();
    loadSettings();
});


function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
            
        
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(sectionName) {
   
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
   
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        
        if (sectionName === 'stock' || sectionName === 'sold') {
            renderAccounts();
        }
    }
}


function loadData() {
 
    const savedAccounts = localStorage.getItem('paimon_accounts');
    if (savedAccounts) {
        accounts = JSON.parse(savedAccounts);
    } else {

        accounts = [
            {
                id: 1,
                name: 'test',
                description: 'testing',
                image: 'file.jpg',
                price: 299.99,
                status: 'stock'
            },
           
        ];
        saveData();
    }
}

function saveData() {
    localStorage.setItem('paimon_accounts', JSON.stringify(accounts));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('paimon_settings');
    if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
    }
    

    const contactLink = document.querySelector('.whatsapp-contact');
    if (contactLink) {
        contactLink.href = `https://wa.me/${601174917685}`;
    }
    
   
    const whatsappInput = document.getElementById('whatsapp-number');
    if (whatsappInput) {
        whatsappInput.value = settings.whatsappNumber;
    }
}

function saveSettings() {
    const whatsappNumber = document.getElementById('whatsapp-number').value.trim();
    
    if (whatsappNumber) {
        settings.whatsappNumber = whatsappNumber;
        localStorage.setItem('paimon_settings', JSON.stringify(settings));
        
     
        const contactLink = document.querySelector('.whatsapp-contact');
        if (contactLink) {
            contactLink.href = `https://wa.me/${whatsappNumber}`;
        }
        
        alert('Settings saved successfully!');
    } else {
        alert('Please enter a valid WhatsApp number');
    }
}


function renderAccounts() {
    renderStockAccounts();
    renderSoldAccounts();
}

function renderStockAccounts() {
    const stockGrid = document.getElementById('stock-grid');
    const noStock = document.getElementById('no-stock');
    const stockAccounts = accounts.filter(account => account.status === 'stock');
    
    if (stockAccounts.length === 0) {
        stockGrid.style.display = 'none';
        noStock.style.display = 'block';
        return;
    }
    
    stockGrid.style.display = 'grid';
    noStock.style.display = 'none';
    
    stockGrid.innerHTML = stockAccounts.map(account => `
        <div class="account-card">
            <img src="${account.image}" alt="${account.name}" class="account-image" 
                 onerror="this.src='https://via.placeholder.com/300x200/2DA9E0/FFFFFF?text=MLBB+Account'">
            <div class="account-info">
                <h3 class="account-name">${account.name}</h3>
                <p class="account-description">${account.description}</p>
                <div class="account-footer">
                    <span class="account-price">$${account.price.toFixed(2)}</span>
                    <a href="${generateWhatsAppLink(account)}" class="buy-button" target="_blank">
                        Buy Now
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderSoldAccounts() {
    const soldGrid = document.getElementById('sold-grid');
    const noSold = document.getElementById('no-sold');
    const soldAccounts = accounts.filter(account => account.status === 'sold');
    
    if (soldAccounts.length === 0) {
        soldGrid.style.display = 'none';
        noSold.style.display = 'block';
        return;
    }
    
    soldGrid.style.display = 'grid';
    noSold.style.display = 'none';
    
    soldGrid.innerHTML = soldAccounts.map(account => `
        <div class="account-card">
            <img src="${account.image}" alt="${account.name}" class="account-image"
                 onerror="this.src='https://via.placeholder.com/300x200/2DA9E0/FFFFFF?text=MLBB+Account'">
            <div class="account-info">
                <h3 class="account-name">${account.name}</h3>
                <p class="account-description">${account.description}</p>
                <div class="account-footer">
                    <span class="account-price">$${account.price.toFixed(2)}</span>
                    <span class="sold-badge">SOLD</span>
                </div>
            </div>
        </div>
    `).join('');
}

// WhatsApp integration
function generateWhatsAppLink(account) {
    const message = `Hi, I want to buy: ${account.name} — Price: $${account.price.toFixed(2)}`;
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Admin Panel Functions
function showAdminPanel() {
    document.getElementById('admin-modal').style.display = 'block';
    if (isAdminLoggedIn) {
        showAdminDashboard();
    } else {
        showAdminLogin();
    }
}

function closeAdminPanel() {
    document.getElementById('admin-modal').style.display = 'none';
}

function showAdminLogin() {
    document.getElementById('admin-login').style.display = 'block';
    document.getElementById('admin-dashboard').style.display = 'none';
}

function showAdminDashboard() {
    document.getElementById('admin-login').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
    renderAdminAccounts();
}

function adminLogin() {
    const password = document.getElementById('admin-password').value;
    
    if (password === settings.adminPassword) {
        isAdminLoggedIn = true;
        showAdminDashboard();
        document.getElementById('admin-password').value = '';
    } else {
        alert('Invalid admin password!');
    }
}

function showAdminTab(tabName) {
 
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show tab content
    const tabs = document.querySelectorAll('.admin-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    document.getElementById(`admin-${tabName}`).classList.add('active');
    
    if (tabName === 'accounts') {
        renderAdminAccounts();
    }
}

function unlockPriceEditing() {
    const code = document.getElementById('price-unlock-code').value;
    const statusElement = document.getElementById('price-lock-status');
    
    if (code === '112020') {
        isPriceEditingUnlocked = true;
        statusElement.textContent = '🔓 Price editing unlocked';
        statusElement.classList.add('unlocked');
        document.getElementById('price-unlock-code').value = '';
        renderAdminAccounts();
    } else {
        alert('Invalid unlock code!');
    }
}


function showAddAccountForm() {
    document.getElementById('add-account-form').style.display = 'block';
    document.getElementById('account-form').reset();
    currentEditingAccount = null;
}

function hideAddAccountForm() {
    document.getElementById('add-account-form').style.display = 'none';
    currentEditingAccount = null;
}


document.addEventListener('DOMContentLoaded', function() {
    const accountForm = document.getElementById('account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveAccount();
        });
    }
});

function saveAccount() {
    const name = document.getElementById('account-name').value.trim();
    const description = document.getElementById('account-description').value.trim();
    const price = parseFloat(document.getElementById('account-price').value);
    const imageFile = document.getElementById('account-image').files[0];
    
    if (!name || !description || !price) {
        alert('Please fill in all required fields');
        return;
    }
    
    const accountData = {
        name,
        description,
        price,
        status: 'stock'
    };
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            accountData.image = e.target.result;
            finalizeAccountSave(accountData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        if (currentEditingAccount) {
            accountData.image = currentEditingAccount.image;
        } else {
            accountData.image = `https://via.placeholder.com/300x200/2DA9E0/FFFFFF?text=${encodeURIComponent(name)}`;
        }
        finalizeAccountSave(accountData);
    }
}

function finalizeAccountSave(accountData) {
    if (currentEditingAccount) {
        // Update existing account
        const index = accounts.findIndex(acc => acc.id === currentEditingAccount.id);
        if (index !== -1) {
            accounts[index] = { ...accounts[index], ...accountData };
        }
    } else {
        // Add new account
        accountData.id = Date.now();
        accounts.push(accountData);
    }
    
    saveData();
    renderAccounts();
    renderAdminAccounts();
    hideAddAccountForm();
    alert(currentEditingAccount ? 'Account updated successfully!' : 'Account added successfully!');
}

function renderAdminAccounts() {
    const adminAccountsList = document.getElementById('admin-accounts-list');
    
    if (accounts.length === 0) {
        adminAccountsList.innerHTML = '<p class="no-items">No accounts found. Add your first account above.</p>';
        return;
    }
    
    adminAccountsList.innerHTML = accounts.map(account => `
        <div class="admin-account-item">
            <img src="${account.image}" alt="${account.name}" class="admin-account-image"
                 onerror="this.src='https://via.placeholder.com/100x80/2DA9E0/FFFFFF?text=MLBB'">
            <div class="admin-account-info">
                <h4>${account.name}</h4>
                <p>${account.description}</p>
                <p><strong>Price:</strong> $${account.price.toFixed(2)}</p>
                <p><strong>Status:</strong> ${account.status.toUpperCase()}</p>
            </div>
            <div class="admin-account-actions">
                <button class="edit-btn" onclick="editAccount(${account.id})">Edit</button>
                <button class="toggle-btn ${account.status}" onclick="toggleAccountStatus(${account.id})">
                    ${account.status === 'stock' ? 'Mark as Sold' : 'Mark as Stock'}
                </button>
                <button class="delete-btn" onclick="deleteAccount(${account.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

function editAccount(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    currentEditingAccount = account;
    

    document.getElementById('account-name').value = account.name;
    document.getElementById('account-description').value = account.description;
    document.getElementById('account-price').value = account.price;
    
   
    const priceInput = document.getElementById('account-price');
    if (!isPriceEditingUnlocked) {
        priceInput.disabled = true;
        priceInput.title = 'Enter unlock code (112020) to edit prices';
    } else {
        priceInput.disabled = false;
        priceInput.title = '';
    }
    
    showAddAccountForm();
    
    
    const formTitle = document.querySelector('#add-account-form h4');
    if (formTitle) {
        formTitle.textContent = 'Edit Account';
    }
}

function toggleAccountStatus(accountId) {
    const account = accounts.find(acc => acc.id === accountId);
    if (!account) return;
    
    account.status = account.status === 'stock' ? 'sold' : 'stock';
    saveData();
    renderAccounts();
    renderAdminAccounts();
}

function deleteAccount(accountId) {
    if (confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
        accounts = accounts.filter(acc => acc.id !== accountId);
        saveData();
        renderAccounts();
        renderAdminAccounts();
    }
}


window.addEventListener('click', function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal) {
        closeAdminPanel();
    }
});


function validateInput(input, type = 'text') {
    const value = input.value.trim();
    
    switch (type) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'number':
            return !isNaN(value) && parseFloat(value) > 0;
        case 'text':
        default:
            return value.length > 0;
    }
}

function showError(message) {
    alert(message); 
}

function showSuccess(message) {
    alert(message);
}


window.showSection = showSection;
window.showAdminPanel = showAdminPanel;
window.closeAdminPanel = closeAdminPanel;
window.adminLogin = adminLogin;
window.showAdminTab = showAdminTab;
window.unlockPriceEditing = unlockPriceEditing;
window.showAddAccountForm = showAddAccountForm;
window.hideAddAccountForm = hideAddAccountForm;
window.editAccount = editAccount;
window.toggleAccountStatus = toggleAccountStatus;
window.deleteAccount = deleteAccount;

window.saveSettings = saveSettings;




