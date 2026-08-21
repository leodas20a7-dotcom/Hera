// Initial Stock Catalog Data
const INITIAL_STOCK = [
    { id: 'SKU-101', name: 'Standard Industrial Bolts 12mm', category: 'Raw Material', qty: 250, price: 15.00 },
    { id: 'SKU-102', name: 'Stainless Steel Sheet 2x4', category: 'Raw Material', qty: 45, price: 1200.00 },
    { id: 'SKU-103', name: 'Heavy Duty Gear Assembly', category: 'Finished Product', qty: 18, price: 4500.00 },
    { id: 'SKU-104', name: 'Corrugated Packaging Boxes (L)', category: 'Packaging', qty: 500, price: 35.00 },
    { id: 'SKU-105', name: 'Industrial Lubricant Oil 5L', category: 'Finished Product', qty: 6, price: 850.00 }
];

const INITIAL_ORDERS = [
    { id: 'ORD-9021', customer: 'Global Infra Pvt Ltd', phone: '+91 9876543210', itemsCount: 2, total: 5700.00, date: '2026-08-18' }
];

const INITIAL_INWARD_CHALLANS = [
    { id: 'INV-CH-501', vendor: 'Apex Metal Supplies', vehicle: 'MH-12-AB-9911', date: '2026-08-17', items: 'Stainless Steel Sheet (Qty: 20)' }
];

const INITIAL_DELIVERY_CHALLANS = [
    { id: 'DEL-CH-801', customer: 'Metro Builders', driver: 'Ramesh Singh (MH-14-XY-4422)', address: 'Plot 45, Tech Park, Pune', status: 'Dispatched', date: '2026-08-18', items: 'Industrial Bolts 12mm (Qty: 50)' }
];

// App State
class HeraApp {
    constructor() {
        this.stock = JSON.parse(localStorage.getItem('hera_stock')) || INITIAL_STOCK;
        this.orders = JSON.parse(localStorage.getItem('hera_orders')) || INITIAL_ORDERS;
        this.inwardChallans = JSON.parse(localStorage.getItem('hera_inward_challans')) || INITIAL_INWARD_CHALLANS;
        this.deliveryChallans = JSON.parse(localStorage.getItem('hera_delivery_challans')) || INITIAL_DELIVERY_CHALLANS;

        this.isAdminMode = false; // Default Customer view mode
        this.customerCart = [];
        this.adminCart = [];
        this.tempInwardItems = [];
        this.tempDeliveryItems = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderAll();
        this.setMode(false); // Customer portal default
    }

    saveState() {
        localStorage.setItem('hera_stock', JSON.stringify(this.stock));
        localStorage.setItem('hera_orders', JSON.stringify(this.orders));
        localStorage.setItem('hera_inward_challans', JSON.stringify(this.inwardChallans));
        localStorage.setItem('hera_delivery_challans', JSON.stringify(this.deliveryChallans));
    }

    bindEvents() {
        // Toggle Admin / Customer Mode
        document.getElementById('toggle-view-mode')?.addEventListener('click', () => {
            this.setMode(!this.isAdminMode);
        });

        // Navigation Menu Switches
        document.querySelectorAll('.nav-btn, [data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetView = btn.getAttribute('data-target') || btn.getAttribute('data-action');
                if (targetView) this.switchView(targetView);
            });
        });

        // Customer Catalog Search & Filter
        document.getElementById('cust-stock-search')?.addEventListener('input', () => this.renderCustomerCatalog());
        document.getElementById('cust-category-filter')?.addEventListener('change', () => this.renderCustomerCatalog());

        // Clear Customer Cart
        document.getElementById('cust-clear-cart')?.addEventListener('click', () => {
            this.customerCart = [];
            this.renderCustomerCart();
        });

        // Customer Checkout Form Submit -> Generates Order & Instant Delivery Challan
        document.getElementById('cust-checkout-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCustomerCheckout();
        });

        // Admin Challan Sub-Tab Switcher
        document.querySelectorAll('.challan-tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabTarget = btn.getAttribute('data-challan-tab');
                this.switchChallanSubtab(tabTarget, btn);
            });
        });

        // Admin Stock Search & Add Item
        document.getElementById('stock-search-input')?.addEventListener('input', () => this.renderStockTable());
        document.getElementById('stock-category-filter')?.addEventListener('change', () => this.renderStockTable());
        document.getElementById('open-add-stock-modal')?.addEventListener('click', () => this.openModal('modal-add-stock'));

        document.getElementById('form-add-stock')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddStock();
        });

        // Admin Manual Place Order Form
        document.getElementById('btn-add-item-to-cart')?.addEventListener('click', () => this.addItemToAdminCart());
        document.getElementById('place-order-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAdminPlaceOrder();
        });

        // Inward & Delivery Challan Modal Triggers
        document.getElementById('btn-open-inward-modal')?.addEventListener('click', () => {
            this.tempInwardItems = [];
            this.renderTempInwardTable();
            this.populateStockSelect('inward-select-item');
            this.openModal('modal-inward-challan');
        });
        document.getElementById('btn-add-inward-row')?.addEventListener('click', () => this.addTempInwardItem());
        document.getElementById('form-create-inward')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleInwardSubmit();
        });

        document.getElementById('btn-open-delivery-modal')?.addEventListener('click', () => {
            this.tempDeliveryItems = [];
            this.renderTempDeliveryTable();
            this.populateStockSelect('delivery-select-item');
            this.openModal('modal-delivery-challan');
        });
        document.getElementById('btn-add-delivery-row')?.addEventListener('click', () => this.addTempDeliveryItem());
        document.getElementById('form-create-delivery')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleDeliverySubmit();
        });

        // Close Modals
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllModals());
        });
    }

    setMode(isAdmin) {
        this.isAdminMode = isAdmin;
        const body = document.body;
        const modeText = document.getElementById('mode-btn-text');
        const currentModeInd = document.getElementById('current-mode-indicator');
        const custNav = document.querySelector('.customer-only-nav');
        const adminNav = document.querySelector('.admin-only-nav');

        if (isAdmin) {
            body.classList.remove('customer-mode');
            body.classList.add('admin-mode');
            if (modeText) modeText.innerText = 'Switch to Customer';
            if (currentModeInd) currentModeInd.innerHTML = `<i class="fa-solid fa-user-gear"></i> Admin Management`;
            custNav?.classList.add('hidden');
            adminNav?.classList.remove('hidden');
            this.switchView('dashboard');
        } else {
            body.classList.remove('admin-mode');
            body.classList.add('customer-mode');
            if (modeText) modeText.innerText = 'Switch to Admin';
            if (currentModeInd) currentModeInd.innerHTML = `<i class="fa-solid fa-store"></i> Customer Portal`;
            adminNav?.classList.add('hidden');
            custNav?.classList.remove('hidden');
            this.switchView('customer-portal');
        }
    }

    switchView(viewId) {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (btn.getAttribute('data-target') === viewId) btn.classList.add('active');
            else btn.classList.remove('active');
        });

        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
        const activeSec = document.getElementById(`view-${viewId}`);
        if (activeSec) activeSec.classList.add('active');

        const titles = {
            'customer-portal': ['Customer Stock & Ordering Portal', 'Check live stock availability, place your orders, and generate delivery challans instantly.'],
            'customer-my-challans': ['My Delivery Challans', 'View and print delivery slips generated for your orders.'],
            'dashboard': ['Admin Dashboard', 'Overview of stock balances, sales orders, and challans.'],
            'stock-statement': ['Admin Stock Statement', 'Real-time inventory levels, pricing & stock adjustments.'],
            'place-order': ['Admin Place Order', 'Create manual sales order receipts & dispatch items.'],
            'challan-hub': ['Admin Challan System Log', 'Manage Inward Receipts & Outward Delivery Slips.']
        };

        if (titles[viewId]) {
            document.getElementById('page-heading').innerText = titles[viewId][0];
            document.getElementById('page-subheading').innerText = titles[viewId][1];
        }

        if (viewId === 'place-order') {
            this.populateStockSelect('order-select-item');
        }
    }

    switchChallanSubtab(tabTarget, activeBtn) {
        document.querySelectorAll('.challan-tab-btn').forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');

        document.querySelectorAll('.challan-subview').forEach(v => v.classList.remove('active'));
        const targetView = document.getElementById(`subview-${tabTarget}`);
        if (targetView) targetView.classList.add('active');
    }

    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('active');
    }

    closeAllModals() {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    }

    renderAll() {
        this.renderCustomerCatalog();
        this.renderCustomerCart();
        this.renderCustomerChallansTable();
        this.renderStats();
        this.renderStockTable();
        this.renderRecentDashboardData();
        this.renderInwardChallansTable();
        this.renderDeliveryChallansTable();
    }

    // Customer Catalog & Ordering Logic
    renderCustomerCatalog() {
        const container = document.getElementById('cust-stock-cards-container');
        if (!container) return;

        const searchQuery = (document.getElementById('cust-stock-search')?.value || '').toLowerCase();
        const catFilter = document.getElementById('cust-category-filter')?.value || 'all';

        const filtered = this.stock.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.id.toLowerCase().includes(searchQuery);
            const matchesCat = catFilter === 'all' || item.category === catFilter;
            return matchesSearch && matchesCat;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<div class="text-center text-muted" style="grid-column: 1/-1; padding: 40px;">No matching products available in stock.</div>`;
            return;
        }

        container.innerHTML = filtered.map(item => {
            const isOutOfStock = item.qty <= 0;
            const statusBadge = item.qty > 20 
                ? `<span class="badge badge-success">Available (${item.qty})</span>` 
                : !isOutOfStock 
                ? `<span class="badge badge-warning">Low Stock (${item.qty})</span>` 
                : `<span class="badge badge-danger">Out of Stock</span>`;

            return `
                <div class="stock-card">
                    <div>
                        <div class="stock-card-header">
                            <span class="badge badge-info">${item.category}</span>
                            ${statusBadge}
                        </div>
                        <div class="stock-card-title">${item.name}</div>
                        <div class="stock-card-price">₹${parseFloat(item.price).toFixed(2)} <small style="font-size:0.7rem; color:var(--text-muted);">/ unit</small></div>
                    </div>
                    <div class="stock-card-footer">
                        <small class="text-muted">${item.id}</small>
                        <button class="btn btn-sm ${isOutOfStock ? 'btn-outline' : 'btn-primary'}" 
                            ${isOutOfStock ? 'disabled' : ''} 
                            onclick="app.addToCustomerCart('${item.id}')">
                            <i class="fa-solid fa-plus"></i> Add to Order
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    addToCustomerCart(sku) {
        const item = this.stock.find(s => s.id === sku);
        if (!item || item.qty <= 0) return;

        const existing = this.customerCart.find(c => c.id === sku);
        if (existing) {
            if (existing.qty + 1 > item.qty) {
                alert(`Cannot add more. Only ${item.qty} units present in stock!`);
                return;
            }
            existing.qty += 1;
        } else {
            this.customerCart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: 1
            });
        }

        this.renderCustomerCart();
    }

    renderCustomerCart() {
        const list = document.getElementById('cust-cart-items-list');
        const badgeCount = document.getElementById('cust-cart-badge-count');
        const totalItemsEl = document.getElementById('cust-cart-total-items');
        const grandTotalEl = document.getElementById('cust-cart-grand-total');

        if (!list) return;

        if (this.customerCart.length === 0) {
            list.innerHTML = `<div class="empty-cart-msg">Your cart is empty. Click <strong>"+ Add to Order"</strong> on items to start.</div>`;
            if (badgeCount) badgeCount.innerText = '0';
            if (totalItemsEl) totalItemsEl.innerText = '0';
            if (grandTotalEl) grandTotalEl.innerText = '₹0.00';
            return;
        }

        let totalQty = 0;
        let totalPrice = 0;

        list.innerHTML = this.customerCart.map((item, idx) => {
            totalQty += item.qty;
            const subtotal = item.qty * item.price;
            totalPrice += subtotal;

            return `
                <div class="cust-cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small class="text-muted">₹${item.price.toFixed(2)} x ${item.qty}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong>₹${subtotal.toFixed(2)}</strong><br>
                        <button type="button" class="btn btn-sm btn-outline text-danger" style="padding:2px 6px; margin-top:2px;" onclick="app.removeCustCartItem(${idx})"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        if (badgeCount) badgeCount.innerText = totalQty;
        if (totalItemsEl) totalItemsEl.innerText = totalQty;
        if (grandTotalEl) grandTotalEl.innerText = `₹${totalPrice.toFixed(2)}`;
    }

    removeCustCartItem(index) {
        this.customerCart.splice(index, 1);
        this.renderCustomerCart();
    }

    handleCustomerCheckout() {
        if (this.customerCart.length === 0) return alert('Your cart is empty! Please add products from the stock list first.');

        const customer = document.getElementById('cust-name').value;
        const phone = document.getElementById('cust-phone').value;
        const address = document.getElementById('cust-address').value;
        const driver = document.getElementById('cust-driver').value || 'Customer Direct Dispatch';

        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
        const challanNo = 'DEL-CH-' + Math.floor(100 + Math.random() * 900);

        let totalPrice = 0;
        const itemsSummaryArr = [];

        // Deduct stock & compile items list
        this.customerCart.forEach(cartItem => {
            totalPrice += cartItem.qty * cartItem.price;
            itemsSummaryArr.push(`${cartItem.name} (Qty: ${cartItem.qty})`);

            const stockItem = this.stock.find(s => s.id === cartItem.id);
            if (stockItem) {
                stockItem.qty = Math.max(0, stockItem.qty - cartItem.qty);
            }
        });

        const itemsSummary = itemsSummaryArr.join(', ');

        // Add Order Record
        this.orders.unshift({
            id: orderId,
            customer,
            phone,
            address,
            itemsCount: this.customerCart.length,
            total: totalPrice,
            date: new Date().toISOString().split('T')[0]
        });

        // Add Delivery Challan Record (Instantly Issued for Customer)
        this.deliveryChallans.unshift({
            id: challanNo,
            customer,
            driver,
            address,
            status: 'Dispatched',
            date: new Date().toISOString().split('T')[0],
            items: itemsSummary
        });

        this.saveState();
        this.renderAll();

        // Display Instant Printable Customer Delivery Challan
        this.previewChallanReceipt(challanNo, 'Customer Delivery Challan (Official Dispatch Slip)', customer, itemsSummary);

        this.customerCart = [];
        this.renderCustomerCart();
        document.getElementById('cust-checkout-form').reset();
    }

    renderCustomerChallansTable() {
        const tbody = document.getElementById('cust-challans-table-body');
        if (!tbody) return;

        if (this.deliveryChallans.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No delivery challans generated yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.deliveryChallans.map(ch => `
            <tr>
                <td><strong>${ch.id}</strong></td>
                <td>${ch.date}</td>
                <td>${ch.customer}</td>
                <td><small>${ch.items}</small></td>
                <td><span class="badge badge-success">${ch.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="app.previewChallanReceipt('${ch.id}', 'Customer Delivery Challan', '${ch.customer}', '${ch.items}')"><i class="fa-solid fa-print"></i> Print Slip</button>
                </td>
            </tr>
        `).join('');
    }

    // Admin Stock & Dashboard Operations
    renderStats() {
        document.getElementById('stat-total-stock-count').innerText = this.stock.length;
        document.getElementById('stat-orders-count').innerText = this.orders.length;
        document.getElementById('stat-inward-count').innerText = this.inwardChallans.length;
        document.getElementById('stat-delivery-count').innerText = this.deliveryChallans.length;
        document.getElementById('dash-total-items-badge').innerText = `${this.stock.length} Items Listed`;
        document.getElementById('dash-pending-orders-badge').innerText = `${this.orders.length} Processed`;
    }

    renderStockTable() {
        const tbody = document.getElementById('stock-table-body');
        if (!tbody) return;

        const searchQuery = (document.getElementById('stock-search-input')?.value || '').toLowerCase();
        const catFilter = document.getElementById('stock-category-filter')?.value || 'all';

        const filtered = this.stock.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery) || item.id.toLowerCase().includes(searchQuery);
            const matchesCat = catFilter === 'all' || item.category === catFilter;
            return matchesSearch && matchesCat;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding: 24px;">No matching stock items found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(item => {
            let statusBadge = item.qty > 20 
                ? `<span class="badge badge-success">In Stock</span>` 
                : item.qty > 0 
                ? `<span class="badge badge-warning">Low Stock (${item.qty})</span>` 
                : `<span class="badge badge-danger">Out of Stock</span>`;

            return `
                <tr>
                    <td><strong>${item.id}</strong></td>
                    <td>${item.name}</td>
                    <td><span class="badge badge-info">${item.category}</span></td>
                    <td><strong>${item.qty} units</strong></td>
                    <td>₹${parseFloat(item.price).toFixed(2)}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-sm btn-outline" onclick="app.adjustQty('${item.id}', 10)"><i class="fa-solid fa-plus"></i></button>
                        <button class="btn btn-sm btn-outline" onclick="app.adjustQty('${item.id}', -5)"><i class="fa-solid fa-minus"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    adjustQty(sku, amount) {
        const item = this.stock.find(s => s.id === sku);
        if (item) {
            item.qty = Math.max(0, item.qty + amount);
            this.saveState();
            this.renderAll();
        }
    }

    handleAddStock() {
        const name = document.getElementById('new-item-name').value;
        const category = document.getElementById('new-item-category').value;
        let sku = document.getElementById('new-item-sku').value.trim();
        const qty = parseInt(document.getElementById('new-item-qty').value) || 0;
        const price = parseFloat(document.getElementById('new-item-price').value) || 0;

        if (!sku) sku = 'SKU-' + Math.floor(100 + Math.random() * 900);

        this.stock.unshift({ id: sku, name, category, qty, price });
        this.saveState();
        this.closeAllModals();
        this.renderAll();
        document.getElementById('form-add-stock').reset();
    }

    populateStockSelect(elementId) {
        const select = document.getElementById(elementId);
        if (!select) return;
        select.innerHTML = `<option value="">-- Choose Stock Item --</option>` + 
            this.stock.map(item => `<option value="${item.id}">${item.name} (${item.qty} in stock - ₹${item.price})</option>`).join('');
    }

    // Admin Manual Order Placement
    addItemToAdminCart() {
        const select = document.getElementById('order-select-item');
        const itemId = select.value;
        const qtyInput = document.getElementById('order-item-qty');
        const qty = parseInt(qtyInput.value) || 1;

        if (!itemId) return alert('Please select an item from stock.');

        const item = this.stock.find(s => s.id === itemId);
        if (!item) return;

        if (qty > item.qty) {
            alert(`Cannot order ${qty} units. Only ${item.qty} units available!`);
            return;
        }

        const existing = this.adminCart.find(c => c.id === itemId);
        if (existing) {
            existing.qty += qty;
        } else {
            this.adminCart.push({ id: item.id, name: item.name, price: item.price, qty });
        }

        this.renderAdminCart();
    }

    renderAdminCart() {
        const tbody = document.getElementById('order-cart-items-body');
        if (this.adminCart.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No items added to order yet.</td></tr>`;
            document.getElementById('order-grand-total').innerText = '₹0.00';
            return;
        }

        let total = 0;
        tbody.innerHTML = this.adminCart.map((item, index) => {
            const subtotal = item.qty * item.price;
            total += subtotal;
            return `
                <tr>
                    <td>${item.name}</td>
                    <td>₹${item.price.toFixed(2)}</td>
                    <td>${item.qty}</td>
                    <td>₹${subtotal.toFixed(2)}</td>
                    <td>
                        <button type="button" class="btn btn-sm btn-outline text-danger" onclick="app.removeAdminCartItem(${index})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('order-grand-total').innerText = `₹${total.toFixed(2)}`;
    }

    removeAdminCartItem(index) {
        this.adminCart.splice(index, 1);
        this.renderAdminCart();
    }

    handleAdminPlaceOrder() {
        if (this.adminCart.length === 0) return alert('Please add at least one item.');

        const customer = document.getElementById('order-customer-name').value;
        const phone = document.getElementById('order-customer-phone').value;
        const address = document.getElementById('order-delivery-address').value;
        const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

        let total = 0;
        this.adminCart.forEach(cartItem => {
            total += cartItem.qty * cartItem.price;
            const stockItem = this.stock.find(s => s.id === cartItem.id);
            if (stockItem) stockItem.qty = Math.max(0, stockItem.qty - cartItem.qty);
        });

        this.orders.unshift({
            id: orderId,
            customer,
            phone,
            address,
            itemsCount: this.adminCart.length,
            total,
            date: new Date().toISOString().split('T')[0]
        });

        this.adminCart = [];
        this.saveState();
        this.renderAll();
        document.getElementById('place-order-form').reset();
        this.renderAdminCart();

        alert(`Order ${orderId} created successfully! Stock updated.`);
        this.switchView('dashboard');
    }

    // Inward Goods Challan Modal Logic
    addTempInwardItem() {
        const itemId = document.getElementById('inward-select-item').value;
        const qty = parseInt(document.getElementById('inward-item-qty').value) || 1;
        if (!itemId) return;

        const item = this.stock.find(s => s.id === itemId);
        if (!item) return;

        this.tempInwardItems.push({ id: item.id, name: item.name, qty });
        this.renderTempInwardTable();
    }

    renderTempInwardTable() {
        const tbody = document.getElementById('inward-items-tbody');
        if (this.tempInwardItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No goods specified.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.tempInwardItems.map((item, idx) => `
            <tr>
                <td>${item.name}</td>
                <td><strong>+${item.qty} units</strong></td>
                <td><button type="button" class="btn btn-sm btn-outline" onclick="app.removeTempInward(${idx})"><i class="fa-solid fa-times"></i></button></td>
            </tr>
        `).join('');
    }

    removeTempInward(idx) {
        this.tempInwardItems.splice(idx, 1);
        this.renderTempInwardTable();
    }

    handleInwardSubmit() {
        if (this.tempInwardItems.length === 0) return alert('Please add at least one item received.');

        const vendor = document.getElementById('inward-vendor').value;
        const vehicle = document.getElementById('inward-vehicle').value || 'N/A';
        const challanNo = 'INV-CH-' + Math.floor(100 + Math.random() * 900);

        this.tempInwardItems.forEach(recItem => {
            const stockItem = this.stock.find(s => s.id === recItem.id);
            if (stockItem) stockItem.qty += recItem.qty;
        });

        const itemsSummary = this.tempInwardItems.map(i => `${i.name} (Qty: ${i.qty})`).join(', ');

        this.inwardChallans.unshift({
            id: challanNo,
            vendor,
            vehicle,
            date: new Date().toISOString().split('T')[0],
            items: itemsSummary
        });

        this.saveState();
        this.closeAllModals();
        this.renderAll();
        document.getElementById('form-create-inward').reset();
        alert(`Inward Goods Challan ${challanNo} processed! Stock automatically increased.`);
    }

    // Admin Delivery Challan Logic
    addTempDeliveryItem() {
        const itemId = document.getElementById('delivery-select-item').value;
        const qty = parseInt(document.getElementById('delivery-item-qty').value) || 1;
        if (!itemId) return;

        const item = this.stock.find(s => s.id === itemId);
        if (!item) return;

        if (qty > item.qty) {
            alert(`Stock insufficient! Only ${item.qty} units present.`);
            return;
        }

        this.tempDeliveryItems.push({ id: item.id, name: item.name, qty });
        this.renderTempDeliveryTable();
    }

    renderTempDeliveryTable() {
        const tbody = document.getElementById('delivery-items-tbody');
        if (this.tempDeliveryItems.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">No items selected for dispatch.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.tempDeliveryItems.map((item, idx) => `
            <tr>
                <td>${item.name}</td>
                <td><strong>${item.qty} units</strong></td>
                <td><button type="button" class="btn btn-sm btn-outline" onclick="app.removeTempDelivery(${idx})"><i class="fa-solid fa-times"></i></button></td>
            </tr>
        `).join('');
    }

    removeTempDelivery(idx) {
        this.tempDeliveryItems.splice(idx, 1);
        this.renderTempDeliveryTable();
    }

    handleDeliverySubmit() {
        if (this.tempDeliveryItems.length === 0) return alert('Please select items for dispatch.');

        const customer = document.getElementById('delivery-customer').value;
        const driver = document.getElementById('delivery-driver').value || 'Self Transport';
        const address = document.getElementById('delivery-address').value;
        const challanNo = 'DEL-CH-' + Math.floor(100 + Math.random() * 900);

        this.tempDeliveryItems.forEach(disItem => {
            const stockItem = this.stock.find(s => s.id === disItem.id);
            if (stockItem) stockItem.qty = Math.max(0, stockItem.qty - disItem.qty);
        });

        const itemsSummary = this.tempDeliveryItems.map(i => `${i.name} (Qty: ${i.qty})`).join(', ');

        this.deliveryChallans.unshift({
            id: challanNo,
            customer,
            driver,
            address,
            status: 'Dispatched',
            date: new Date().toISOString().split('T')[0],
            items: itemsSummary
        });

        this.saveState();
        this.closeAllModals();
        this.renderAll();
        document.getElementById('form-create-delivery').reset();
        alert(`Outward Delivery Challan ${challanNo} issued!`);
    }

    renderInwardChallansTable() {
        const tbody = document.getElementById('inward-challans-table-body');
        if (!tbody) return;

        if (this.inwardChallans.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No Inward Goods Challans logged.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.inwardChallans.map(ch => `
            <tr>
                <td><strong>${ch.id}</strong></td>
                <td>${ch.vendor}</td>
                <td>${ch.date}</td>
                <td>${ch.vehicle}</td>
                <td><small>${ch.items}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="app.previewChallanReceipt('${ch.id}', 'Inward Goods Challan Slip', '${ch.vendor}', '${ch.items}')"><i class="fa-solid fa-print"></i> Print</button>
                </td>
            </tr>
        `).join('');
    }

    renderDeliveryChallansTable() {
        const tbody = document.getElementById('delivery-challans-table-body');
        if (!tbody) return;

        if (this.deliveryChallans.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No Delivery Challans issued.</td></tr>`;
            return;
        }

        tbody.innerHTML = this.deliveryChallans.map(ch => `
            <tr>
                <td><strong>${ch.id}</strong></td>
                <td>${ch.customer}</td>
                <td>${ch.date}</td>
                <td>${ch.driver}</td>
                <td><span class="badge badge-success">${ch.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="app.previewChallanReceipt('${ch.id}', 'Delivery Challan (Outward Slip)', '${ch.customer}', '${ch.items}')"><i class="fa-solid fa-print"></i> Print</button>
                </td>
            </tr>
        `).join('');
    }

    renderRecentDashboardData() {
        const ordersBody = document.getElementById('dash-recent-orders-list');
        if (ordersBody) {
            ordersBody.innerHTML = this.orders.slice(0, 4).map(o => `
                <tr>
                    <td><strong>${o.id}</strong></td>
                    <td>${o.customer}</td>
                    <td>${o.itemsCount} Items</td>
                    <td><strong>₹${o.total.toFixed(2)}</strong></td>
                    <td>${o.date}</td>
                </tr>
            `).join('') || `<tr><td colspan="5" class="text-center text-muted">No recent orders</td></tr>`;
        }

        const challansBody = document.getElementById('dash-recent-challans-list');
        if (challansBody) {
            const combined = [
                ...this.inwardChallans.map(c => ({ id: c.id, type: 'Inward', party: c.vendor, date: c.date })),
                ...this.deliveryChallans.map(c => ({ id: c.id, type: 'Delivery', party: c.customer, date: c.date }))
            ].sort((a, b) => new Date(b.date) - new Date(a.date));

            challansBody.innerHTML = combined.slice(0, 4).map(c => `
                <tr>
                    <td><strong>${c.id}</strong></td>
                    <td><span class="badge ${c.type === 'Inward' ? 'badge-info' : 'badge-success'}">${c.type}</span></td>
                    <td>${c.party}</td>
                    <td>${c.date}</td>
                </tr>
            `).join('') || `<tr><td colspan="4" class="text-center text-muted">No recent challans</td></tr>`;
        }
    }

    // Modal Document Previewer
    previewChallanReceipt(challanNo, title, party, itemsText) {
        const container = document.getElementById('receipt-paper-content');
        container.innerHTML = `
            <h2>HERA STORE LOGISTICS</h2>
            <div class="r-subtitle">${title.toUpperCase()}</div>
            <div class="receipt-meta">
                <div><strong>Challan No:</strong> ${challanNo}<br><strong>Issued Date:</strong> ${new Date().toLocaleDateString()}</div>
                <div style="text-align: right;"><strong>Customer / Recipient:</strong> ${party}</div>
            </div>
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th>Particulars / Goods Description & Quantities</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${itemsText}</td>
                    </tr>
                </tbody>
            </table>
            <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 0.8rem;">
                <div>Customer Receipt Signature: _______________</div>
                <div>Store Dispatch Signatory: _______________</div>
            </div>
        `;
        this.openModal('modal-printable-receipt');
    }
}

// Global App Instance
const app = new HeraApp();
