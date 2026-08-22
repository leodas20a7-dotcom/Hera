import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';
import heraLogo from './assets/HERA LOGO.jpeg';
import heraWarehouseImg from './assets/hera_warehouse_hero.jpg';
import { supabase } from './supabaseClient';

// Initial empty stocks (Driven 100% by live Supabase realtime data)
const INITIAL_STOCKS = [];

// Single explicit Admin Credential
const ADMIN_CREDENTIALS = {
  email: 'admin@heralogistics.com',
  password: 'hera@admin2026',
  name: 'Hera Admin (Operations Desk)',
  role: 'admin',
  company: 'Hera Logistics Pvt. Ltd. Thoothukudi'
};

// Demo Client Account
const DEMO_CLIENT = {
  id: 'client-lords',
  name: 'Mr. Chidambaram',
  role: 'client',
  email: 'lords@fruits.com',
  company: 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.',
  address: 'T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92',
  phone: '9585543555'
};

// Initial empty Inward Consignment Requests (Driven 100% by live Supabase realtime data)
const INITIAL_INWARD_REQUESTS = [];

// Prime Dry Storage Hero Banner Component matching reference design
function WarehouseHeroBanner({ onManageInventory, onLearnMore }) {
  return (
    <div className="prime-hero-banner">
      {/* Background Warehouse Overlay with soft depth */}
      <div className="prime-hero-backdrop">
        <img src={heraWarehouseImg} alt="Warehouse Storage" className="prime-hero-bg-img" />
        <div className="prime-hero-gradient-overlay"></div>
      </div>

      <div className="prime-hero-inner">
        {/* Left Side: Crate on Pallet with HERA Logo & Stored Boxes */}
        <div className="prime-hero-visual">
          <div className="pallet-crate-showcase">
            {/* Plastic Crates Stack (Left) */}
            <div className="plastic-crates-stack">
              <div className="plastic-crate crate-red">
                <div className="crate-handle"></div>
              </div>
              <div className="plastic-crate crate-black">
                <div className="crate-handle"></div>
              </div>
              <div className="plastic-crate crate-red">
                <div className="crate-handle"></div>
              </div>
              <div className="plastic-crate crate-black">
                <div className="crate-handle"></div>
              </div>
            </div>

            {/* Wooden Crate on Pallet */}
            <div className="wooden-crate-unit">
              {/* Stacked Cargo Cartons on Top */}
              <div className="cargo-stack-top">
                <div className="cargo-box-row">
                  <div className="cargo-carton tech-box">
                    <span className="carton-label">INDUSTRIAL</span>
                  </div>
                  <div className="cargo-carton textile-box-1">
                    <span className="carton-label">TEXTILE</span>
                  </div>
                </div>
                <div className="cargo-box-row lower-row">
                  <div className="cargo-carton tech-box-sm">
                    <span className="carton-label">COMMERCIAL</span>
                  </div>
                  <div className="cargo-carton white-bundles">
                    <span className="carton-label">BATCH-PKG</span>
                  </div>
                  <div className="cargo-carton textile-box-2">
                    <span className="carton-label">TEXTILE</span>
                  </div>
                </div>
              </div>

              {/* Solid Wood Chest / Box */}
              <div className="wooden-chest-box">
                <div className="wood-texture-planks">
                  <div className="wood-plank"></div>
                  <div className="wood-plank"></div>
                  <div className="wood-plank"></div>
                </div>
                
                {/* Clean Direct Hera Branding on Crate */}
                <div className="crate-clean-brand">
                  <span className="crate-brand-title">HERA</span>
                  <span className="crate-brand-subtitle">Dry Storage Solutions</span>
                </div>
              </div>

              {/* Wooden Pallet Base with 3 blocks & runners */}
              <div className="wooden-pallet-base">
                <div className="pallet-top-deck"></div>
                <div className="pallet-blocks-row">
                  <div className="pallet-block"></div>
                  <div className="pallet-block"></div>
                  <div className="pallet-block"></div>
                  <div className="pallet-block"></div>
                </div>
                <div className="pallet-bottom-deck"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Headline, Subtitle, Highlights & Action Buttons */}
        <div className="prime-hero-content">
          <h1 className="prime-hero-heading">
            Prime Dry Storage <br />
            & Space Rental
          </h1>
          <p className="prime-hero-subheading">
            Optimal Conditions for Your Inventory
          </p>
          <div className="prime-hero-highlight">
            Secure, Dry & Convenient. Custom Space Options!
          </div>

          <div className="prime-hero-actions">
            <button className="btn-manage-live" onClick={onManageInventory}>
              MANAGE LIVE INVENTORY
            </button>
            <button className="btn-learn-more" onClick={onLearnMore}>
              LEARN MORE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  // Active User session (Saved in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('hera_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Active page tab inside portal with memory persistence:
  // For Admin: 'adminOverview' (Home) | 'adminInventory' | 'adminIncoming' | 'adminInwardReport' | 'adminChallans'
  // For Client: 'clientHome' (Home) | 'clientInventory' | 'clientSendGoods' | 'clientInwardReport' | 'cart'
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('hera_current_user');
    if (!savedUser) return 'portalLogin';
    const savedTab = localStorage.getItem('hera_active_tab');
    if (savedTab && savedTab !== 'portalLogin') return savedTab;
    const parsed = JSON.parse(savedUser);
    return parsed.role === 'admin' ? 'adminOverview' : 'clientHome';
  });

  // Track and persist active tab in memory
  useEffect(() => {
    if (activeTab && activeTab !== 'portalLogin') {
      localStorage.setItem('hera_active_tab', activeTab);
    }
  }, [activeTab]);

  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  // Live stocks (starts empty, loads from Supabase)
  const [stocks, setStocks] = useState(() => {
    const saved = localStorage.getItem('hera_stocks');
    return saved ? JSON.parse(saved) : [];
  });

  // Live challan history
  const [challanHistory, setChallanHistory] = useState(() => {
    const saved = localStorage.getItem('hera_challans');
    return saved ? JSON.parse(saved) : [];
  });

  // Live Incoming / Inward Requests from Clients
  const [inwardRequests, setInwardRequests] = useState(() => {
    const saved = localStorage.getItem('hera_inward_requests');
    return saved ? JSON.parse(saved) : [];
  });

  // Client Inward Consignment Advice Form
  const [clientInwardForm, setClientInwardForm] = useState({
    product: '',
    category: 'Cashew',
    brand: 'CAJ',
    variety: 'GRADE-A',
    qty: '',
    unit: 'BAGS',
    weightKg: '',
    vehicleNo: '',
    driverPhone: '',
    expectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    docNo: '',
    remarks: ''
  });

  // Inward Confirmation Advice Slip Modal & Admin Acceptance Modal
  const [issuedInwardReceipt, setIssuedInwardReceipt] = useState(null);
  const [showInwardStatusModal, setShowInwardStatusModal] = useState(false);
  const [acceptingRequest, setAcceptingRequest] = useState(null);
  const [acceptBay, setAcceptBay] = useState('SIP-B3');
  const [acceptQty, setAcceptQty] = useState('');
  const [acceptWeight, setAcceptWeight] = useState('');

  // Gateway Auth Form state
  const [gatewayTab, setGatewayTab] = useState('login'); // 'login' | 'register'
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [authError, setAuthError] = useState('');

  // Inventory filtering & search
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inward Consignment Modal State (Add & Edit)
  const [showInwardModal, setShowInwardModal] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [inwardForm, setInwardForm] = useState({
    product: '',
    clientName: 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.',
    category: 'Dry Goods',
    docNo: '',
    grnNo: '',
    whLocation: 'SIP-A1',
    brand: '',
    variety: '',
    lotNo: '',
    count: '50KG BAGS',
    rateType: 'Daily',
    qty: '',
    unit: 'BAGS',
    weightKg: ''
  });

  // Dispatch / Quantity Modal states
  const [activeItem, setActiveItem] = useState(null);
  const [inputQty, setInputQty] = useState('');
  const [qtyError, setQtyError] = useState('');

  // Cart Multi-Step & Customer Details
  const [cart, setCart] = useState([]);
  const [cartStep, setCartStep] = useState('review'); // 'review' | 'details'
  const [customerName, setCustomerName] = useState('M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.');
  const [customerAddress, setCustomerAddress] = useState('T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92');
  const [contactPerson, setContactPerson] = useState('MR. CHIDAMBARAM');
  const [contactPhone, setContactPhone] = useState('9585543555');
  const [transport, setTransport] = useState('TN22CY7236');
  const [destination, setDestination] = useState('CHENNAI - KOYAMBEDU');
  const [preparedBy, setPreparedBy] = useState('ADMIN');

  // Issued Challan modal & PDF state
  const [issuedChallan, setIssuedChallan] = useState(null);
  const [activeChallanTab, setActiveChallanTab] = useState('delivery'); // 'delivery' | 'inward'
  const [isDownloading, setIsDownloading] = useState(false);
  const [showChallanActionMenu, setShowChallanActionMenu] = useState(false);
  const [showCustomerChallanModal, setShowCustomerChallanModal] = useState(false);
  const [cartBadgeBump, setCartBadgeBump] = useState(false);

  const triggerCartBump = () => {
    setCartBadgeBump(true);
    setTimeout(() => setCartBadgeBump(false), 300);
  };

  // PWA Web App Mobile Install Prompt State
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIosSafari, setIsIosSafari] = useState(false);

  useEffect(() => {
    // Check if already launched in standalone mobile app mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    if (isStandalone) return;

    const isDismissed = localStorage.getItem('hera_install_dismissed');

    // Android / Chrome PWA install trigger
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredInstallPrompt(e);
      if (!isDismissed) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Detect iOS Safari
    const ua = window.navigator.userAgent.toLowerCase();
    const isIos = /iphone|ipad|ipod/.test(ua);
    const isSafari = isIos && /safari/.test(ua) && !/crios|fxios/.test(ua);
    if (isSafari && !isStandalone && !isDismissed) {
      setIsIosSafari(true);
      setShowInstallBanner(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      const { outcome } = await deferredInstallPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallBanner(false);
        setDeferredInstallPrompt(null);
      }
    } else if (isIosSafari) {
      alert("To install Hera Logistics on your iPhone:\n\n1. Tap the Share button (⎋) at the bottom\n2. Scroll down and tap 'Add to Home Screen'\n3. Tap 'Add' to finish");
    } else {
      alert("To install Hera Logistics:\n\nTap your browser menu (⋮) and choose 'Add to Home screen' or 'Install App'.");
    }
  };

  const handleDismissInstall = () => {
    setShowInstallBanner(false);
    localStorage.setItem('hera_install_dismissed', 'true');
  };

  // Reusable Live Supabase Sync function
  const loadSupabaseData = async () => {
    try {
      const { data: stockData } = await supabase
        .from('warehouse_stocks')
        .select('*')
        .order('created_at', { ascending: false });

      if (stockData) {
        const mapped = stockData.map(s => ({
          id: s.id,
          docNo: s.doc_no,
          grnNo: s.grn_no,
          inDate: s.in_date,
          clientName: s.client_name,
          product: s.product,
          category: s.category || 'Dry Goods',
          brand: s.brand || 'CAJ',
          variety: s.variety || s.product,
          whLocation: s.wh_location,
          lotNo: s.lot_no,
          count: s.count || '50KG BAGS',
          rateType: s.rate_type || 'Daily',
          qty: Number(s.qty),
          unit: s.unit || 'BAGS',
          weightKg: Number(s.weight_kg) || 0,
          tagClass: 'tag-blue'
        }));
        setStocks(mapped);
      }

      const { data: challanData } = await supabase
        .from('delivery_notes')
        .select('*, delivery_note_items(*)')
        .order('created_at', { ascending: false });

      if (challanData) {
        const mappedChallans = challanData.map(c => ({
          id: c.id,
          dcNo: c.dc_no,
          dcDate: c.dc_date,
          gateInNo: c.gate_in_no,
          customerName: c.customer_name,
          address: c.address,
          contactPerson: c.contact_person,
          contactNo: c.contact_no,
          destination: c.destination,
          vehicleNo: c.vehicle_no,
          preparedBy: c.prepared_by,
          totalQty: Number(c.total_qty),
          items: (c.delivery_note_items && c.delivery_note_items.length > 0)
            ? c.delivery_note_items.map(i => ({
                grnNo: i.grn_no || 'GRN/0001345/26-27',
                brand: i.brand || 'Sun Enterprises',
                product: i.product || 'Raw Cashew Nuts',
                variety: i.variety || 'RAW-CASHEW',
                lotNo: i.lot_no || 'LOT-CASHEW',
                count: i.count || '50KG BAGS',
                whLocation: i.wh_location || 'SIP-B02',
                selectedQty: Number(i.dispatched_qty) || Number(c.total_qty),
                unit: i.unit || 'BAGS',
                rateType: i.rate_type || 'Daily'
              }))
            : [{
                grnNo: 'GRN/0001345/26-27',
                brand: 'Sun Enterprises',
                product: 'Raw Cashew Nuts',
                variety: 'RAW-CASHEW',
                lotNo: 'LOT-CASHEW',
                count: '50KG BAGS',
                whLocation: 'SIP-B02',
                selectedQty: Number(c.total_qty),
                unit: 'BAGS',
                rateType: 'Daily'
              }]
        }));
        setChallanHistory(mappedChallans);
      }

      const { data: inwardData } = await supabase
        .from('inward_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (inwardData) {
        const mappedInwards = inwardData.map(r => ({
          id: r.id,
          inwardNo: r.inward_no,
          clientName: r.client_name,
          product: r.product,
          category: r.category || 'General',
          brand: r.brand || 'CAJ',
          variety: r.variety || 'STANDARD',
          qty: Number(r.qty),
          unit: r.unit || 'BAGS',
          weightKg: Number(r.weight_kg) || 0,
          vehicleNo: r.vehicle_no,
          driverPhone: r.driver_phone,
          expectedDate: r.expected_date,
          docNo: r.doc_no,
          remarks: r.remarks,
          status: r.status || 'PENDING',
          grnNo: r.grn_no,
          whLocation: r.wh_location,
          createdAt: r.created_at ? new Date(r.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '20-Aug-2026'
        }));
        setInwardRequests(mappedInwards);
      }
    } catch (err) {
      console.warn('Supabase sync notice:', err);
    }
  };

  // Live Supabase Sync & Realtime Subscription
  useEffect(() => {
    loadSupabaseData();

    // Supabase Realtime Subscription Channel
    const channel = supabase
      .channel('hera-realtime-db-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'warehouse_stocks' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inward_requests' }, () => {
        loadSupabaseData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_notes' }, () => {
        loadSupabaseData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch when delivery note modal opens
  useEffect(() => {
    if (showCustomerChallanModal) {
      loadSupabaseData();
    }
  }, [showCustomerChallanModal]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem('hera_stocks', JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem('hera_challans', JSON.stringify(challanHistory));
  }, [challanHistory]);

  useEffect(() => {
    localStorage.setItem('hera_inward_requests', JSON.stringify(inwardRequests));
  }, [inwardRequests]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hera_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hera_current_user');
    }
  }, [currentUser]);

  // 1. GATEWAY LOGIN & REGISTER HANDLER
  const handleGatewayAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError('');

    if (gatewayTab === 'login') {
      const email = emailInput.trim().toLowerCase();
      const password = passwordInput.trim();

      // Check if Admin Login
      if (email === ADMIN_CREDENTIALS.email.toLowerCase() && password === ADMIN_CREDENTIALS.password) {
        setCurrentUser(ADMIN_CREDENTIALS);
        setActiveTab('adminOverview');
        setEmailInput('');
        setPasswordInput('');
        return;
      }

      // Check if Demo Client (Lords & Kings)
      if (email === DEMO_CLIENT.email.toLowerCase() || email.includes('lords')) {
        setCurrentUser(DEMO_CLIENT);
        setActiveTab('clientHome');
        setEmailInput('');
        setPasswordInput('');
        return;
      }

      // Default Merchant Client Login
      const newClient = {
        id: 'client-' + Date.now(),
        name: email.split('@')[0] || 'Merchant Client',
        role: 'client',
        email: email,
        company: 'M/S. REGISTERED MERCHANT TRADER',
        address: 'Thoothukudi / Chennai Trade Hub',
        phone: '9585543555'
      };
      setCurrentUser(newClient);
      setActiveTab('clientHome');
      setEmailInput('');
      setPasswordInput('');
    } else {
      // Register New Merchant Client
      if (!regName.trim() || !regCompany.trim()) {
        setAuthError('Please fill in your name and company name.');
        return;
      }
      const newClient = {
        id: 'client-' + Date.now(),
        name: regName.trim(),
        role: 'client',
        email: emailInput.trim(),
        company: regCompany.trim(),
        address: 'Port Hub / Trader Market',
        phone: regPhone.trim() || '9876543210'
      };
      setCurrentUser(newClient);
      setActiveTab('clientHome');
      setEmailInput('');
      setPasswordInput('');
      setRegName('');
      setRegCompany('');
      setRegPhone('');
    }
  };

  // 1-Click Quick Demo Login Actions
  const handleQuickLoginAdmin = () => {
    setCurrentUser(ADMIN_CREDENTIALS);
    setActiveTab('adminOverview');
    setAuthError('');
  };

  const handleQuickLoginClient = () => {
    setCurrentUser(DEMO_CLIENT);
    setActiveTab('clientHome');
    setAuthError('');
  };

  // Mobile / Browser Hardware Back Button & Page Memory Navigation Handler
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ tab: activeTab, isBase: true }, '');
    }

    const handlePopState = (e) => {
      // 1. If any modal is open, close modal only (prevents accidental app exit)
      if (activeItem || showInwardModal || issuedChallan || showLearnMoreModal || showInwardStatusModal || showCustomerChallanModal || issuedInwardReceipt || acceptingRequest) {
        setActiveItem(null);
        setShowInwardModal(false);
        setIssuedChallan(null);
        setShowLearnMoreModal(false);
        setShowInwardStatusModal(false);
        setShowCustomerChallanModal(false);
        setIssuedInwardReceipt(null);
        setAcceptingRequest(null);
        return;
      }

      // 2. If back navigation has a tab, restore it
      if (e.state && e.state.tab) {
        setActiveTab(e.state.tab);
      } else if (currentUser) {
        // Fallback to primary Home screen
        const homeTab = currentUser.role === 'admin' ? 'adminOverview' : 'clientHome';
        setActiveTab(homeTab);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    activeItem,
    showInwardModal,
    issuedChallan,
    showLearnMoreModal,
    showInwardStatusModal,
    showCustomerChallanModal,
    issuedInwardReceipt,
    acceptingRequest,
    activeTab,
    currentUser
  ]);

  // Push browser history state on tab change
  const navigateToTab = (newTab) => {
    if (newTab === activeTab) return;
    window.history.pushState({ tab: newTab }, '');
    setActiveTab(newTab);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('portalLogin');
    localStorage.removeItem('hera_active_tab');
    localStorage.removeItem('hera_current_user');
    setCart([]);
    setCartStep('review');
  };

  // Inward Cargo Management (Add/Edit/Delete)
  const handleOpenAddInward = () => {
    setEditingStockId(null);
    setInwardForm({
      product: '',
      clientName: 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.',
      category: 'Dry Goods',
      docNo: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
      grnNo: 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27',
      whLocation: 'SIP-A1',
      brand: 'HERA-STORED',
      variety: 'STANDARD',
      lotNo: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
      count: '50KG BAGS',
      rateType: 'Daily',
      qty: '',
      unit: 'BAGS',
      weightKg: ''
    });
    setShowInwardModal(true);
  };

  const handleOpenEditInward = (item) => {
    setEditingStockId(item.id);
    setInwardForm({ ...item, qty: String(item.qty), weightKg: String(item.weightKg || '') });
    setShowInwardModal(true);
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Are you sure you want to remove this consignment record from warehouse stock?')) {
      setStocks(stocks.filter(s => s.id !== id));
      try {
        await supabase.from('warehouse_stocks').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase delete notice:', err);
      }
    }
  };

  const handleSaveInwardSubmit = async (e) => {
    e.preventDefault();
    if (!inwardForm.product || !inwardForm.qty) return alert('Please enter product name and quantity');

    const qtyNum = parseFloat(inwardForm.qty);
    const weightNum = parseFloat(inwardForm.weightKg) || (inwardForm.unit === 'BAGS' ? qtyNum * 50 : qtyNum * 20);

    if (editingStockId) {
      setStocks(stocks.map(s => s.id === editingStockId ? {
        ...s,
        ...inwardForm,
        qty: qtyNum,
        weightKg: weightNum
      } : s));

      try {
        await supabase.from('warehouse_stocks').update({
          product: inwardForm.product,
          category: inwardForm.category,
          brand: inwardForm.brand,
          variety: inwardForm.variety,
          wh_location: inwardForm.whLocation,
          lot_no: inwardForm.lotNo,
          count: inwardForm.count,
          rate_type: inwardForm.rateType,
          qty: qtyNum,
          unit: inwardForm.unit,
          weight_kg: weightNum,
          updated_at: new Date().toISOString()
        }).eq('id', editingStockId);
      } catch (err) {
        console.warn('Supabase update notice:', err);
      }
    } else {
      const newItem = {
        id: Date.now(),
        docNo: inwardForm.docNo || 'DOC-' + Math.floor(100000 + Math.random() * 900000),
        grnNo: inwardForm.grnNo || 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27',
        inDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
        clientName: inwardForm.clientName || 'REGISTERED MERCHANT',
        product: inwardForm.product,
        category: inwardForm.category,
        brand: inwardForm.brand || 'HERA-STORED',
        variety: inwardForm.variety || 'STANDARD',
        whLocation: inwardForm.whLocation || 'SIP-A1',
        lotNo: inwardForm.lotNo || 'LOT-' + Math.floor(1000 + Math.random() * 9000),
        count: inwardForm.count || (inwardForm.unit === 'BAGS' ? '50KG BAGS' : 'STANDARD'),
        rateType: inwardForm.rateType || 'Daily',
        qty: qtyNum,
        unit: inwardForm.unit,
        weightKg: weightNum,
        tagClass: 'tag-blue'
      };
      setStocks([newItem, ...stocks]);

      try {
        await supabase.from('warehouse_stocks').insert([{
          client_name: newItem.clientName,
          doc_no: newItem.docNo,
          grn_no: newItem.grnNo,
          in_date: newItem.inDate,
          product: newItem.product,
          category: newItem.category,
          brand: newItem.brand,
          variety: newItem.variety,
          wh_location: newItem.whLocation,
          lot_no: newItem.lotNo,
          count: newItem.count,
          rate_type: newItem.rateType,
          qty: newItem.qty,
          unit: newItem.unit,
          weight_kg: newItem.weightKg
        }]);
      } catch (err) {
        console.warn('Supabase insert notice:', err);
      }
    }
    setShowInwardModal(false);
  };

  // Dispatch item selection
  const handleRowClick = (stockItem) => {
    setActiveItem(stockItem);
    setInputQty('');
    setQtyError('');
  };

  const handleQtyChange = (e) => {
    const val = e.target.value;
    setInputQty(val);
    if (!val) {
      setQtyError('Quantity is required');
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) {
      setQtyError(`Quantity must be at least 1 ${activeItem.unit}`);
    } else if (activeItem && num > activeItem.qty) {
      setQtyError(`Exceeds available stock (${activeItem.qty} ${activeItem.unit})`);
    } else {
      setQtyError('');
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    const qtyNum = parseFloat(inputQty);
    if (!qtyNum || qtyNum <= 0) {
      setQtyError('Please enter a valid quantity');
      return;
    }
    if (qtyNum > activeItem.qty) {
      setQtyError(`Cannot exceed available stock of ${activeItem.qty} ${activeItem.unit}`);
      return;
    }

    const existingIndex = cart.findIndex(c => c.id === activeItem.id);
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].selectedQty += qtyNum;
      setCart(updated);
    } else {
      setCart([...cart, { ...activeItem, selectedQty: qtyNum }]);
    }

    setActiveItem(null);
    setInputQty('');
    setQtyError('');
    triggerCartBump();
  };

  const handleRemoveFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
    triggerCartBump();
    if (newCart.length === 0) setCartStep('review');
  };

  const handlePlaceOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Cart is empty!');
    if (!customerName.trim()) return alert('Please enter Customer Name.');
    if (!transport.trim()) return alert('Please enter Vehicle/Transport number.');

    const updatedStocks = stocks.map(st => {
      const cartItem = cart.find(c => c.id === st.id);
      if (cartItem) {
        return {
          ...st,
          qty: Math.max(0, st.qty - cartItem.selectedQty),
          weightKg: st.weightKg ? Math.max(0, Math.round(st.weightKg - (st.weightKg / st.qty) * cartItem.selectedQty)) : 0
        };
      }
      return st;
    });
    setStocks(updatedStocks);

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const dcNumber = 'DC/' + String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0').slice(0, 7) + '/26-27';
    const gateInNo = 'GPV/' + String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0').slice(0, 7) + '/26-27';

    const totalQty = cart.reduce((sum, item) => sum + (item.selectedQty || 0), 0);

    const challanObj = {
      id: Date.now(),
      dcNo: dcNumber,
      dcDate: formattedDate,
      customerName: customerName,
      address: customerAddress,
      contactPerson: contactPerson,
      contactNo: contactPhone,
      destination: destination,
      preparedBy: preparedBy,
      vehicleNo: transport,
      gateInNo: gateInNo,
      items: [...cart],
      totalQty: totalQty
    };

    setIssuedChallan(challanObj);
    setChallanHistory(prev => [challanObj, ...prev]);
    setCart([]);
    setCartStep('review');
    triggerCartBump();

    // Async Supabase Sync for Delivery Notes
    try {
      const { data: noteData } = await supabase.from('delivery_notes').insert([{
        dc_no: challanObj.dcNo,
        dc_date: challanObj.dcDate,
        customer_name: challanObj.customerName,
        address: challanObj.address,
        contact_person: challanObj.contactPerson,
        contact_no: challanObj.contactNo,
        destination: challanObj.destination,
        prepared_by: challanObj.preparedBy,
        vehicle_no: challanObj.vehicleNo,
        gate_in_no: challanObj.gateInNo,
        total_qty: challanObj.totalQty
      }]).select();

      if (noteData && noteData[0]) {
        const noteId = noteData[0].id;
        const noteItems = cart.map(item => ({
          delivery_note_id: noteId,
          grn_no: item.grnNo,
          brand: item.brand,
          product: item.product,
          variety: item.variety,
          lot_no: item.lotNo,
          count: item.count,
          wh_location: item.whLocation,
          dispatched_qty: item.selectedQty,
          unit: item.unit,
          rate_type: item.rateType || 'Daily'
        }));
        await supabase.from('delivery_note_items').insert(noteItems);

        // Update remaining stock quantities in Supabase
        for (const item of cart) {
          const updatedStock = updatedStocks.find(s => s.id === item.id);
          if (updatedStock && typeof item.id === 'string' && item.id.length > 10) {
            await supabase
              .from('warehouse_stocks')
              .update({
                qty: updatedStock.qty,
                weight_kg: updatedStock.weightKg
              })
              .eq('id', item.id);
          }
        }
      }
    } catch (err) {
      console.warn('Supabase delivery note sync notice:', err);
    }
  };

  // Client Inward Consignment Advice Submission
  const handleClientInwardSubmit = async (e) => {
    e.preventDefault();
    if (!clientInwardForm.product || !clientInwardForm.qty || !clientInwardForm.vehicleNo) {
      return alert('Please enter Product Name, Quantity, and Vehicle Number.');
    }

    const qtyNum = parseFloat(clientInwardForm.qty);
    const weightNum = parseFloat(clientInwardForm.weightKg) || (clientInwardForm.unit === 'BAGS' ? qtyNum * 50 : qtyNum * 20);
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const inwardNo = 'INW/' + String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0').slice(0, 7) + '/26-27';

    const newReq = {
      id: Date.now(),
      inwardNo: inwardNo,
      clientName: currentUser.company || currentUser.name,
      product: clientInwardForm.product,
      category: clientInwardForm.category,
      brand: clientInwardForm.brand || 'CAJ',
      variety: clientInwardForm.variety || 'STANDARD',
      qty: qtyNum,
      unit: clientInwardForm.unit,
      weightKg: weightNum,
      vehicleNo: clientInwardForm.vehicleNo.toUpperCase(),
      driverPhone: clientInwardForm.driverPhone || '9585543555',
      expectedDate: clientInwardForm.expectedDate,
      docNo: clientInwardForm.docNo || 'INV/' + Math.floor(100000 + Math.random() * 900000),
      remarks: clientInwardForm.remarks || 'Standard Warehouse Inward Consignment',
      status: 'PENDING',
      createdAt: formattedDate
    };

    setInwardRequests(prev => [newReq, ...prev]);
    setIssuedInwardReceipt(newReq);

    // Reset form
    setClientInwardForm({
      product: '',
      category: 'Cashew',
      brand: 'CAJ',
      variety: 'GRADE-A',
      qty: '',
      unit: 'BAGS',
      weightKg: '',
      vehicleNo: '',
      driverPhone: '',
      expectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      docNo: '',
      remarks: ''
    });

    try {
      await supabase.from('inward_requests').insert([{
        inward_no: newReq.inwardNo,
        client_name: newReq.clientName,
        product: newReq.product,
        category: newReq.category,
        brand: newReq.brand,
        variety: newReq.variety,
        qty: newReq.qty,
        unit: newReq.unit,
        weight_kg: newReq.weightKg,
        vehicle_no: newReq.vehicleNo,
        driver_phone: newReq.driverPhone,
        expected_date: newReq.expectedDate,
        doc_no: newReq.docNo,
        remarks: newReq.remarks,
        status: 'PENDING'
      }]);
    } catch (err) {
      console.warn('Supabase inward request sync notice:', err);
    }
  };

  // Admin Inward Acceptance
  const handleOpenAcceptModal = (req) => {
    setAcceptingRequest(req);
    setAcceptBay('SIP-B' + Math.floor(1 + Math.random() * 9));
    setAcceptQty(String(req.qty));
    setAcceptWeight(String(req.weightKg));
  };

  const handleConfirmAcceptInwardSubmit = async (e) => {
    e.preventDefault();
    if (!acceptingRequest) return;

    const acceptedQty = parseFloat(acceptQty) || acceptingRequest.qty;
    const acceptedWeight = parseFloat(acceptWeight) || acceptingRequest.weightKg;
    const grnNumber = 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27';

    // 1. Add to active warehouse stocks
    const newStockItem = {
      id: Date.now(),
      docNo: acceptingRequest.docNo,
      grnNo: grnNumber,
      inDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      clientName: acceptingRequest.clientName,
      product: acceptingRequest.product,
      category: acceptingRequest.category,
      brand: acceptingRequest.brand,
      variety: acceptingRequest.variety,
      whLocation: acceptBay,
      lotNo: 'LOT-' + Math.floor(10000 + Math.random() * 90000),
      count: acceptingRequest.unit === 'BAGS' ? '50KG BAGS' : 'STANDARD',
      rateType: 'Daily',
      qty: acceptedQty,
      unit: acceptingRequest.unit,
      weightKg: acceptedWeight,
      tagClass: 'tag-blue'
    };

    setStocks(prev => [newStockItem, ...prev]);

    // 2. Mark inward request as ACCEPTED
    setInwardRequests(prev => prev.map(r => r.id === acceptingRequest.id ? {
      ...r,
      status: 'ACCEPTED',
      grnNo: grnNumber,
      whLocation: acceptBay,
      acceptedQty: acceptedQty
    } : r));

    const acceptedId = acceptingRequest.id;
    setAcceptingRequest(null);

    // 3. Supabase insert into warehouse_stocks and update inward_requests
    try {
      await supabase.from('warehouse_stocks').insert([{
        client_name: newStockItem.clientName,
        doc_no: newStockItem.docNo,
        grn_no: newStockItem.grnNo,
        in_date: newStockItem.inDate,
        product: newStockItem.product,
        category: newStockItem.category,
        brand: newStockItem.brand,
        variety: newStockItem.variety,
        wh_location: newStockItem.whLocation,
        lot_no: newStockItem.lotNo,
        count: newStockItem.count,
        rate_type: newStockItem.rateType,
        qty: newStockItem.qty,
        unit: newStockItem.unit,
        weight_kg: newStockItem.weightKg
      }]);

      await supabase.from('inward_requests').update({
        status: 'ACCEPTED',
        grn_no: grnNumber,
        wh_location: acceptBay
      }).eq('id', acceptedId);
    } catch (err) {
      console.warn('Supabase accept inward sync notice:', err);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('challan-doc-sheet');
    if (!element) return;
    setIsDownloading(true);

    const filename = `${activeChallanTab === 'delivery' ? 'Hera_Delivery_Challan' : 'Hera_Inward_GRN'}_${issuedChallan?.dcNo.replace(/[/\\s]/g, '_')}.pdf`;

    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch(() => {
      setIsDownloading(false);
    });
  };

  const handleDownloadInwardAdvicePdf = () => {
    const element = document.getElementById('inward-advice-sheet');
    if (!element) return;
    setIsDownloading(true);

    const filename = `Hera_Inward_Advice_${issuedInwardReceipt?.inwardNo.replace(/[/\\s]/g, '_')}.pdf`;
    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
    }).catch(() => {
      setIsDownloading(false);
    });
  };

  // Reset to initial sample data
  const handleResetSampleData = () => {
    if (window.confirm('Reset all inventory and challan records to default Hera sample data?')) {
      setStocks(INITIAL_STOCKS);
      setChallanHistory([]);
      localStorage.removeItem('hera_stocks');
      localStorage.removeItem('hera_challans');
      alert('Sample data restored successfully!');
    }
  };

  // Filter stocks based on role & search
  const visibleStocks = stocks.filter(item => {
    // If logged in as client, only show items belonging to their company
    if (currentUser && currentUser.role === 'client') {
      if (item.clientName && !item.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))) {
        return false;
      }
    }
    const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchesSearch = searchQuery === '' ||
      item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.grnNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.whLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lotNo.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalCartCount = cart.reduce((sum, item) => sum + item.selectedQty, 0);
  const totalWarehouseBags = stocks.reduce((sum, item) => sum + Math.round((item.weightKg || item.qty || 0) / 50), 0);
  const totalWarehouseWeight = stocks.reduce((sum, item) => sum + (item.weightKg || item.qty || 0), 0);
  const uniqueBaysCount = new Set(stocks.map(s => s.whLocation)).size;

  // =========================================================================
  // VIEW 1: UNIFIED GATEWAY ENTRY (MINIMAL CLEAN SPLIT SCREEN)
  // =========================================================================
  // =========================================================================
  // VIEW 1: CLEAN & SMART SPLIT-SCREEN LOGIN (CONTAINED FLOATING MODAL)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="clean-split-login">
        <div className="split-modal-container">
          {/* LEFT SIDE: WAREHOUSE HERO IMAGE */}
          <div className="login-image-side">
            <img src={heraWarehouseImg} alt="Hera Warehouse" className="login-bg-photo" />
            <div className="login-image-overlay"></div>
            <div className="login-image-content">
              <div className="login-brand-capsule">
                <img src={heraLogo} alt="Hera Logo" className="login-brand-logo" />
              </div>
              <h1 className="login-hero-title">Hera Logistics</h1>
              <p className="login-hero-subtitle">Prime Dry Storage & Space Rental</p>
              <div className="login-hero-badge">📍 Thoothukudi Central Hub</div>
            </div>
          </div>

          {/* RIGHT SIDE: CLEAN FORM & 1-CLICK ROLE ENTRY */}
          <div className="login-form-side">
            <div className="login-form-wrapper">
              <div className="login-form-header">
                <h2>{gatewayTab === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
                <p className="login-form-sub">
                  {gatewayTab === 'login' 
                    ? 'Sign in to access live warehouse inventory & dispatches'
                    : 'Register a new merchant trading account with Hera'}
                </p>
              </div>

              {/* Quick 1-Click Role Login */}
              {gatewayTab === 'login' && (
                <div className="login-quick-section">
                  <div className="quick-section-title">⚡ Quick 1-Click Access:</div>
                  <div className="quick-roles-row">
                    <button type="button" className="quick-role-btn admin" onClick={handleQuickLoginAdmin}>
                      <span className="role-ico">🛡️</span>
                      <div className="role-txt">
                        <strong>Admin Portal</strong>
                        <span>Warehouse Desk</span>
                      </div>
                    </button>
                    <button type="button" className="quick-role-btn client" onClick={handleQuickLoginClient}>
                      <span className="role-ico">👤</span>
                      <div className="role-txt">
                        <strong>Customer Portal</strong>
                        <span>Lords & Kings</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {gatewayTab === 'login' && (
                <div className="login-divider">
                  <span>or sign in with email</span>
                </div>
              )}

              {authError && <div className="gateway-error-banner">{authError}</div>}

              <form onSubmit={handleGatewayAuthSubmit} className="clean-auth-form">
                {gatewayTab === 'register' && (
                  <>
                    <div className="two-inputs-row">
                      <div className="clean-input-group">
                        <label>Contact Person <span className="req-star">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chidambaram"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                        />
                      </div>
                      <div className="clean-input-group">
                        <label>Company Name <span className="req-star">*</span></label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Lords & Kings"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="clean-input-group">
                      <label>Phone Number</label>
                      <input
                        type="text"
                        placeholder="e.g. 9585543555"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>
                  </>
                )}

                <div className="clean-input-group">
                  <label>Email Address <span className="req-star">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder={gatewayTab === 'login' ? 'admin@heralogistics.com' : 'merchant@company.com'}
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                </div>

                <div className="clean-input-group">
                  <label>Password <span className="req-star">*</span></label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-clean-login">
                  {gatewayTab === 'login' ? 'Login Now' : 'Create Account'}
                </button>
              </form>

              <div className="login-footer-links">
                {gatewayTab === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" className="link-switch-auth" onClick={() => { setGatewayTab('register'); setAuthError(''); }}>
                      Create account here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="link-switch-auth" onClick={() => { setGatewayTab('login'); setAuthError(''); }}>
                      Login here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* PWA Mobile Web App Install Banner */}
        {renderInstallBanner()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: HERA WAREHOUSE MASTER ADMIN PORTAL
  // =========================================================================
  if (currentUser.role === 'admin') {
    return (
      <div className="app-container admin-theme">
        {/* Admin Header */}
        <header className="app-header admin-exclusive-header">
          <div className="brand-title">
            <img src={heraLogo} alt="Hera Logistics Logo" className="header-brand-logo" />
            <div className="header-brand-divider"></div>
            <div className="header-brand-text">
              <span className="brand-name">HERA ADMIN</span>
              <span className="brand-sub">Warehouse Desk</span>
            </div>
          </div>

          <nav className="header-nav-segmented admin-nav">
            <button className={`nav-item-btn ${activeTab === 'adminOverview' ? 'active' : ''}`} onClick={() => navigateToTab('adminOverview')}>
              <span className="nav-icon">📊</span>
              <span className="nav-label-desktop">Home</span>
              <span className="nav-label-tablet">Home</span>
              <span className="nav-label-mobile">Home</span>
            </button>
            <button className={`nav-item-btn ${activeTab === 'adminInventory' ? 'active' : ''}`} onClick={() => navigateToTab('adminInventory')}>
              <span className="nav-icon">🏢</span>
              <span className="nav-label-desktop">All Stock</span>
              <span className="nav-label-tablet">Stock</span>
              <span className="nav-label-mobile">Stock</span>
            </button>
            <button className={`nav-item-btn ${activeTab === 'adminIncoming' ? 'active' : ''}`} onClick={() => navigateToTab('adminIncoming')}>
              <span className="nav-icon">📥</span>
              <span className="nav-label-desktop">Incoming Goods ({inwardRequests.filter(r => r.status === 'PENDING').length})</span>
              <span className="nav-label-tablet">Incoming ({inwardRequests.filter(r => r.status === 'PENDING').length})</span>
              <span className="nav-label-mobile">Inward {inwardRequests.filter(r => r.status === 'PENDING').length > 0 && <span className="nav-mini-badge">{inwardRequests.filter(r => r.status === 'PENDING').length}</span>}</span>
            </button>
            <button className={`nav-item-btn ${activeTab === 'adminInwardReport' ? 'active' : ''}`} onClick={() => navigateToTab('adminInwardReport')}>
              <span className="nav-icon">📄</span>
              <span className="nav-label-desktop">Monthly Report</span>
              <span className="nav-label-tablet">Report</span>
              <span className="nav-label-mobile">Report</span>
            </button>
            <button className={`nav-item-btn ${activeTab === 'adminChallans' ? 'active' : ''}`} onClick={() => navigateToTab('adminChallans')}>
              <span className="nav-icon">🚚</span>
              <span className="nav-label-desktop">Delivery Notes ({challanHistory.length})</span>
              <span className="nav-label-tablet">Notes ({challanHistory.length})</span>
              <span className="nav-label-mobile">Notes</span>
            </button>
          </nav>

          <div className="header-right-actions">
            <div className="user-profile-capsule admin-capsule">
              <span className="role-badge role-admin">🛡️ Admin</span>
              <span className="user-display-name">{currentUser.name ? currentUser.name.split('(')[0].trim() : 'Admin'}</span>
              <button className="btn-logout-mini" onClick={handleLogout} title="Sign Out">✕</button>
            </div>
          </div>
        </header>

        {/* TAB 1: MASTER HOME & PRIME DRY STORAGE HERO */}
        {activeTab === 'adminOverview' && (
          <div className="home-page-screen tab-page-enter">
            <div className="home-content-container">
              {/* Full-width clean hero matching reference image */}
              <WarehouseHeroBanner
                onManageInventory={() => navigateToTab('adminInventory')}
                onLearnMore={() => setShowLearnMoreModal(true)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY */}
        {activeTab === 'adminInventory' && (
          <div className="stocks-page-screen tab-page-enter">
            <div className="stocks-container">
              <div className="inventory-top-toolbar">
                <div>
                  <h1 className="page-heading">All Stored Stock</h1>
                </div>
                <button className="btn-add-inward-top" onClick={handleOpenAddInward}>
                  + Add New Stock
                </button>
              </div>

              <div className="table-card">
                {/* Desktop View */}
                <div className="stocks-desktop-table">
                  <table className="stocks-table">
                    <thead>
                      <tr>
                        <th>Bill / GRN</th>
                        <th>Inward Date</th>
                        <th>Customer</th>
                        <th>Item Name</th>
                        <th>Bay</th>
                        <th>Lot / Pkg</th>
                        <th style={{ textAlign: 'right' }}>Available Stock (KG)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleStocks.map((item) => (
                        <tr key={item.id} className="stock-row" onClick={() => handleRowClick(item)}>
                          <td>
                            <div className="doc-num-bold">{item.docNo}</div>
                            <div className="grn-sub">{item.grnNo}</div>
                          </td>
                          <td className="indate-cell">{item.inDate}</td>
                          <td><strong>{item.clientName}</strong></td>
                          <td>{item.product}</td>
                          <td><span className="wh-bay-badge">{item.whLocation}</span></td>
                          <td>
                            <div className="lot-txt">{item.lotNo}</div>
                            <div className="count-txt">{item.count || (Math.round(item.qty / 50) + ' Bags')}</div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: '#0f766e', fontSize: '0.92rem' }}>
                            {item.qty ? item.qty.toLocaleString() + ' KG' : '0 KG'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="row-dispatch-btn" onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>
                              Send Item &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Major Values Card Feed */}
                <div className="stocks-mobile-cards">
                  {visibleStocks.map((item) => (
                    <div key={item.id} className="mobile-stock-card" onClick={() => handleRowClick(item)}>
                      <div className="mobile-card-top">
                        <div className="mobile-card-product">
                          <span className="mobile-product-name">{item.product}</span>
                          <span className="mobile-client-name">{item.clientName}</span>
                        </div>
                        <span className="wh-bay-badge">{item.whLocation}</span>
                      </div>

                      <div className="mobile-card-metrics">
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">AVAILABLE QTY</span>
                          <span className="mobile-metric-value bold-qty">{item.qty?.toLocaleString()} {item.unit}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">TOTAL WEIGHT</span>
                          <span className="mobile-metric-value teal-wt">{item.weightKg?.toLocaleString()} KG</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">BILL NO</span>
                          <span className="mobile-metric-value font-mono">{item.docNo}</span>
                        </div>
                      </div>

                      <div className="mobile-card-footer">
                        <span className="mobile-more-info">📍 Lot: {item.lotNo} • Inward: {item.inDate}</span>
                        <button 
                          className="mobile-card-action-btn" 
                          onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
                        >
                          Send Item &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INCOMING GOODS / INWARD REQUESTS */}
        {activeTab === 'adminIncoming' && (
          <div className="stocks-page-screen tab-page-enter">
            <div className="stocks-container">
              <div className="dashboard-top-banner">
                <div>
                  <h1 className="page-heading">Incoming Consignments & Inward Notices</h1>
                </div>
              </div>

              {inwardRequests.length === 0 ? (
                <div className="empty-cart-card">
                  <div className="empty-icon">📥</div>
                  <h3>No Incoming Consignments</h3>
                  <p>Customer inward shipment notices will appear here.</p>
                </div>
              ) : (
                <div className="table-card dashboard-table-card">
                  <div className="dash-table-header">
                    <h3>Incoming Shipment Notices ({inwardRequests.length})</h3>
                  </div>

                  <div className="stocks-table-wrapper">
                    {/* Desktop View */}
                    <div className="stocks-desktop-table">
                      <table className="stocks-table">
                        <thead>
                          <tr>
                            <th>Inward Advice No</th>
                            <th>Customer Name</th>
                            <th>Product & Brand</th>
                            <th>Vehicle / Lorry No</th>
                            <th>Expected Date</th>
                            <th style={{ textAlign: 'right' }}>Declared Qty</th>
                            <th style={{ textAlign: 'right' }}>Weight (KG)</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inwardRequests.map((req) => (
                            <tr key={req.id}>
                              <td>
                                <div className="doc-num-bold">{req.inwardNo}</div>
                                <div className="grn-sub">{req.createdAt}</div>
                              </td>
                              <td><strong className="client-party-name">{req.clientName}</strong></td>
                              <td>
                                <span className="product-title-txt">{req.product}</span>
                                <div className="brand-sub-badge">
                                  <span className="brand-pill tag-blue">{req.brand}</span>
                                  <span className="variety-txt">{req.variety}</span>
                                </div>
                              </td>
                              <td>
                                <span className="wh-bay-badge">{req.vehicleNo}</span>
                                <div className="grn-sub">📞 {req.driverPhone}</div>
                              </td>
                              <td><strong>{req.expectedDate}</strong></td>
                              <td style={{ textAlign: 'right' }}>
                                <span className="qty-badge-highlight">{req.qty} {req.unit}</span>
                              </td>
                              <td style={{ textAlign: 'right', fontWeight: '600', color: '#0f766e' }}>
                                {req.weightKg ? req.weightKg.toLocaleString() + ' KG' : '—'}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {req.status === 'PENDING' ? (
                                  <span className="wh-bay-badge" style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                                    🟡 PENDING ARRIVAL
                                  </span>
                                ) : (
                                  <span className="wh-bay-badge" style={{ background: '#DCFCE7', color: '#166534', borderColor: '#BBF7D0' }}>
                                    🟢 STORED IN {req.whLocation}
                                  </span>
                                )}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {req.status === 'PENDING' ? (
                                  <button className="row-dispatch-btn" onClick={() => handleOpenAcceptModal(req)}>
                                    Verify & Accept &rarr;
                                  </button>
                                ) : (
                                  <span className="grn-sub">GRN: {req.grnNo}</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile View */}
                    <div className="stocks-mobile-cards">
                      {inwardRequests.map((req) => (
                        <div key={req.id} className="mobile-stock-card">
                          <div className="mobile-card-top">
                            <div className="mobile-card-product">
                              <span className="mobile-product-name">{req.product}</span>
                              <span className="mobile-client-name">{req.clientName}</span>
                            </div>
                            <span className="wh-bay-badge" style={{ background: req.status === 'PENDING' ? '#FEF3C7' : '#DCFCE7', color: req.status === 'PENDING' ? '#92400E' : '#166534' }}>
                              {req.status === 'PENDING' ? '🟡 PENDING' : '🟢 STORED'}
                            </span>
                          </div>

                          <div className="mobile-card-metrics">
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label">DECLARED QTY</span>
                              <span className="mobile-metric-value bold-qty">{req.qty?.toLocaleString()} {req.unit}</span>
                            </div>
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label">TOTAL WEIGHT</span>
                              <span className="mobile-metric-value teal-wt">{req.weightKg ? req.weightKg.toLocaleString() + ' KG' : '—'}</span>
                            </div>
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label">VEHICLE NO</span>
                              <span className="mobile-metric-value font-mono">{req.vehicleNo}</span>
                            </div>
                          </div>

                          <div className="mobile-card-footer">
                            <span className="mobile-more-info">📄 {req.inwardNo} • Exp: {req.expectedDate}</span>
                            {req.status === 'PENDING' ? (
                              <button 
                                className="mobile-card-action-btn" 
                                style={{ background: '#B91C1C' }}
                                onClick={() => handleOpenAcceptModal(req)}
                              >
                                Accept & Stock &rarr;
                              </button>
                            ) : (
                              <span className="grn-sub">GRN: {req.grnNo}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: OFFICIAL INWARD REPORT */}
        {activeTab === 'adminInwardReport' && (
          <div className="inward-report-screen tab-page-enter">
            <div className="report-container">
              <div className="report-toolbar">
                <div>
                  <h1 className="page-heading">Monthly Stock Holding Report</h1>
                </div>
                <button className="doc-print-btn" onClick={() => window.print()}>
                  🖨️ Print Report
                </button>
              </div>

              <div className="official-report-sheet">
                <div className="report-header-flex">
                  <div className="rep-top-meta-row">
                    <span className="rep-gst">GST.No. : 33AAFCH8632K1ZE</span>
                    <span className="rep-contact" style={{ color: '#0f766e', fontWeight: 'bold' }}>📞 96622 96633</span>
                  </div>
                  <div className="rep-center-brand">
                    <img src={heraLogo} alt="Hera Logistics Logo" className="rep-brand-logo-img" />
                    <h2 className="rep-company-title" style={{ color: '#991b1b', letterSpacing: '0.5px' }}>HERA LOGISTICS PVT.LTD.,</h2>
                    <p className="rep-tagline" style={{ fontWeight: '600' }}>Logistics Simplified</p>
                    <p className="rep-address">📍 No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.</p>
                  </div>
                </div>

                <div className="rep-divider-rule" style={{ height: '2px', background: '#cbd5e1', margin: '10px 0 14px' }}></div>

                <div className="rep-client-box" style={{ textAlign: 'center', marginBottom: '14px', lineHeight: '1.4' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.88rem' }}>M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.,</div>
                  <div style={{ fontSize: '0.78rem' }}>T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: '700', marginTop: '2px', letterSpacing: '0.3px' }}>
                    CONTACT NAME: MR. CHIDAMBARAM &nbsp;&nbsp; PHONE: 9585543555
                  </div>
                </div>

                <div className="rep-report-title" style={{ textAlign: 'center', fontWeight: '900', fontSize: '0.94rem', marginBottom: '12px', letterSpacing: '0.5px' }}>
                  STOCK REPORT: 31.05.2026
                </div>

                <table className="rep-table-exact">
                  <thead>
                    <tr style={{ background: '#334155', color: '#ffffff' }}>
                      <th style={{ width: '50px', textAlign: 'center' }}>S.NO</th>
                      <th style={{ width: '90px', textAlign: 'center' }}>IN.DATE</th>
                      <th style={{ textAlign: 'center' }}>DOCUMENT NUMBER</th>
                      <th style={{ textAlign: 'center' }}>WH LOCATION</th>
                      <th style={{ textAlign: 'right', width: '110px' }}>WEIGHT</th>
                      <th style={{ textAlign: 'right', width: '110px' }}>NO OF BAGS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stocks.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                        <td style={{ textAlign: 'center' }}>{item.inDate ? item.inDate.replace(/-2026|-26/, '') : ''}</td>
                        <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.docNo}</td>
                        <td style={{ textAlign: 'center', fontWeight: '700' }}>{item.whLocation}</td>
                        <td style={{ textAlign: 'right' }}>{(item.weightKg || item.qty)?.toLocaleString()}</td>
                        <td style={{ textAlign: 'right' }}>{(parseInt(item.count) || Math.round((item.weightKg || item.qty) / 50))?.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="rep-total-row" style={{ fontWeight: '800', background: '#F8FAFC' }}>
                      <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        {stocks.reduce((sum, i) => sum + (i.weightKg || i.qty || 0), 0).toLocaleString()}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        {stocks.reduce((sum, i) => sum + (parseInt(i.count) || Math.round((i.weightKg || i.qty) / 50)), 0).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Official Signatory Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', paddingTop: '10px' }}>
                  <div className="rep-footer-left">
                    <div className="rep-verified-badge">✓ SYSTEM VERIFIED DRY STOCK RECORD</div>
                    <div className="rep-timestamp-note" style={{ marginTop: '4px', fontSize: '0.7rem', color: '#64748B' }}>
                      Thoothukudi Central Hub • Hera Logistics Official Ledger
                    </div>
                  </div>

                  <div className="rep-footer-right" style={{ textAlign: 'right' }}>
                    <div className="rep-sign-company">For Hera Logistics Pvt. Ltd.</div>
                    <div className="rep-sign-rule" style={{ width: '180px', height: '1px', background: '#94a3b8', margin: '30px 0 4px auto' }}></div>
                    <div className="rep-sign-label" style={{ fontSize: '0.72rem', color: '#64748b' }}>Warehouse Authorized Signatory</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHALLAN HISTORY */}
        {activeTab === 'adminChallans' && (
          <div className="stocks-page-screen tab-page-enter">
            <div className="stocks-container">
              <h1 className="page-heading">Delivery Notes Issued</h1>

              {challanHistory.length === 0 ? (
                <div className="empty-cart-card">
                  <div className="empty-icon">📄</div>
                  <h3>No Delivery Notes Sent Yet</h3>
                  <p>Send items from stock to create delivery notes.</p>
                </div>
              ) : (
                <div className="table-card" style={{ marginTop: '20px' }}>
                  <div className="stocks-desktop-table">
                    <table className="stocks-table">
                      <thead>
                        <tr>
                          <th>Delivery Note No</th>
                          <th>Date</th>
                          <th>Customer Name</th>
                          <th>Vehicle No</th>
                          <th>Destination</th>
                          <th style={{ textAlign: 'right' }}>Total Units</th>
                          <th style={{ textAlign: 'center' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {challanHistory.map((dc) => (
                          <tr key={dc.id}>
                            <td><strong className="doc-num-bold">{dc.dcNo}</strong></td>
                            <td>{dc.dcDate}</td>
                            <td>{dc.customerName}</td>
                            <td><span className="wh-bay-badge">{dc.vehicleNo}</span></td>
                            <td>{dc.destination}</td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{dc.totalQty} Units</td>
                            <td style={{ textAlign: 'center' }}>
                              <button className="row-dispatch-btn" onClick={() => setIssuedChallan(dc)}>
                                View / Print &rarr;
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="stocks-mobile-cards">
                    {challanHistory.map((dc) => (
                      <div key={dc.id} className="mobile-stock-card" onClick={() => setIssuedChallan(dc)}>
                        <div className="mobile-card-top">
                          <div className="mobile-card-product">
                            <span className="mobile-product-name">{dc.customerName}</span>
                            <span className="mobile-client-name">To: {dc.destination}</span>
                          </div>
                          <span className="wh-bay-badge">{dc.vehicleNo}</span>
                        </div>

                        <div className="mobile-card-metrics">
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label">TOTAL UNITS</span>
                            <span className="mobile-metric-value bold-qty">{dc.totalQty?.toLocaleString()} Units</span>
                          </div>
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label">DATE</span>
                            <span className="mobile-metric-value">{dc.dcDate}</span>
                          </div>
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label">DC NO</span>
                            <span className="mobile-metric-value font-mono">{dc.dcNo}</span>
                          </div>
                        </div>

                        <div className="mobile-card-footer">
                          <span className="mobile-more-info">Issued: {dc.dcDate}</span>
                          <button 
                            className="mobile-card-action-btn" 
                            onClick={(e) => { e.stopPropagation(); setIssuedChallan(dc); }}
                          >
                            View / Print &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODALS */}
        {activeItem && renderDispatchModal()}
        {showInwardModal && renderInwardModal()}
        {acceptingRequest && renderAcceptInwardModal()}
        {issuedChallan && renderChallanModal()}
        {showLearnMoreModal && renderLearnMoreModal()}

        {/* PWA Mobile Web App Install Banner */}
        {renderInstallBanner()}
      </div>
    );
  }

  // =========================================================================
  // VIEW 3: CLIENT / MERCHANT PORTAL
  // =========================================================================
  return (
    <div className="app-container client-theme">
      {/* Client Header */}
      <header className="app-header">
        <div className="brand-title">
          <img src={heraLogo} alt="Hera Logistics Logo" className="header-brand-logo" />
          <div className="header-brand-divider"></div>
          <div className="header-brand-text">
            <span className="brand-name">HERA LOGISTICS</span>
            <span className="brand-sub">Customer Portal</span>
          </div>
        </div>

        <nav className="header-nav-segmented client-nav">
          <button className={`nav-item-btn ${activeTab === 'clientHome' ? 'active' : ''}`} onClick={() => navigateToTab('clientHome')}>
            <span className="nav-icon">📊</span>
            <span className="nav-label-desktop">Home</span>
            <span className="nav-label-tablet">Home</span>
            <span className="nav-label-mobile">Home</span>
          </button>
          <button className={`nav-item-btn ${activeTab === 'clientInventory' ? 'active' : ''}`} onClick={() => navigateToTab('clientInventory')}>
            <span className="nav-icon">📦</span>
            <span className="nav-label-desktop">My Stored Items</span>
            <span className="nav-label-tablet">Stored Items</span>
            <span className="nav-label-mobile">Stock</span>
          </button>
          <button className={`nav-item-btn ${activeTab === 'clientSendGoods' ? 'active' : ''}`} onClick={() => navigateToTab('clientSendGoods')}>
            <span className="nav-icon">📥</span>
            <span className="nav-label-desktop">Send Goods to Warehouse</span>
            <span className="nav-label-tablet">Send Goods</span>
            <span className="nav-label-mobile">Send</span>
          </button>
          <button className={`nav-item-btn ${activeTab === 'clientInwardReport' ? 'active' : ''}`} onClick={() => navigateToTab('clientInwardReport')}>
            <span className="nav-icon">📄</span>
            <span className="nav-label-desktop">My Stock Report</span>
            <span className="nav-label-tablet">Stock Report</span>
            <span className="nav-label-mobile">Report</span>
          </button>
        </nav>

        <div className="header-right-actions">
          <div className="user-profile-capsule">
            <span className="role-badge role-client">👤 Customer</span>
            <span className="user-display-name">{currentUser.company || currentUser.name}</span>
            <button className="btn-logout-mini" onClick={handleLogout} title="Sign Out">✕</button>
          </div>

          <button className={`cart-btn header-cart-pill ${activeTab === 'cart' ? 'active' : ''} ${cartBadgeBump ? 'badge-bump' : ''}`} onClick={() => navigateToTab('cart')}>
            <span className="cart-label-desktop">Delivery Cart</span>
            <span className="cart-label-tablet">Cart</span>
            <span className="cart-label-mobile">🛒</span>
            <span className="cart-badge">{totalCartCount}</span>
          </button>
        </div>
      </header>

      {/* CLIENT TAB 0: HOME / PRIME DRY STORAGE HERO */}
      {activeTab === 'clientHome' && (
        <div className="home-page-screen tab-page-enter">
          <div className="home-content-container">
            {/* Full-width clean hero matching reference image */}
            <WarehouseHeroBanner
              onManageInventory={() => navigateToTab('clientInventory')}
              onLearnMore={() => setShowLearnMoreModal(true)}
            />
          </div>
        </div>
      )}

      {/* CLIENT TAB 1: MY INVENTORY */}
      {activeTab === 'clientInventory' && (
        <div className="stocks-page-screen tab-page-enter">
          <div className="stocks-container">
            <div className="dashboard-top-banner" style={{ marginBottom: '12px' }}>
              <div>
                <h1 className="page-heading">My Stored Cargo</h1>
              </div>
              <button className="btn-add-inward-top" onClick={() => navigateToTab('clientSendGoods')}>
                + Send New Goods to Warehouse
              </button>
            </div>

            <div className="table-card dashboard-table-card">
              <div className="dash-table-header">
                <h3>Current Inventory</h3>
                <div className="dash-table-search">
                  <input
                    type="text"
                    placeholder="Search item, bill, bay..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="stocks-table-wrapper">
                {/* Desktop View */}
                <div className="stocks-desktop-table">
                  <table className="stocks-table">
                    <thead>
                      <tr>
                        <th>Bill / GRN No</th>
                        <th>Inward Date</th>
                        <th>Item & Brand</th>
                        <th>Warehouse Bay</th>
                        <th>Lot & Packaging</th>
                        <th style={{ textAlign: 'right' }}>Available Stock (KG)</th>
                        <th style={{ textAlign: 'center' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleStocks.map((item) => (
                        <tr key={item.id} className="stock-row" onClick={() => handleRowClick(item)}>
                          <td>
                            <div className="doc-num-bold">{item.docNo}</div>
                            <div className="grn-sub">{item.grnNo}</div>
                          </td>
                          <td className="indate-cell">{item.inDate}</td>
                          <td>
                            <strong className="product-title-txt">{item.product}</strong>
                            <div className="brand-sub-badge">
                              <span className={`brand-pill ${item.tagClass}`}>{item.brand}</span>
                              <span className="variety-txt">{item.variety}</span>
                            </div>
                          </td>
                          <td>
                            <span className="wh-bay-badge">{item.whLocation}</span>
                          </td>
                          <td>
                            <div className="lot-txt">{item.lotNo}</div>
                            <div className="count-txt">{item.count || (Math.round(item.qty / 50) + ' Bags')}</div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: '#0f766e', fontSize: '0.94rem' }}>
                            {item.qty ? item.qty.toLocaleString() + ' KG' : '0 KG'}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button className="row-dispatch-btn" onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>
                              Send Item &rarr;
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View: Major Values Card Feed */}
                <div className="stocks-mobile-cards">
                  {visibleStocks.map((item) => (
                    <div key={item.id} className="mobile-stock-card" onClick={() => handleRowClick(item)}>
                      <div className="mobile-card-top">
                        <div className="mobile-card-product">
                          <span className="mobile-product-name">{item.product}</span>
                          <div className="brand-sub-badge" style={{ marginTop: '2px' }}>
                            <span className={`brand-pill ${item.tagClass}`}>{item.brand}</span>
                            <span className="variety-txt">{item.variety}</span>
                          </div>
                        </div>
                        <span className="wh-bay-badge">{item.whLocation}</span>
                      </div>

                      <div className="mobile-card-metrics">
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">AVAILABLE QTY</span>
                          <span className="mobile-metric-value bold-qty">{item.qty?.toLocaleString()} {item.unit}</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">TOTAL WEIGHT</span>
                          <span className="mobile-metric-value teal-wt">{item.weightKg?.toLocaleString()} KG</span>
                        </div>
                        <div className="mobile-metric-item">
                          <span className="mobile-metric-label">BILL NO</span>
                          <span className="mobile-metric-value font-mono">{item.docNo}</span>
                        </div>
                      </div>

                      <div className="mobile-card-footer">
                        <span className="mobile-more-info">📍 Inward: {item.inDate} • Lot: {item.lotNo}</span>
                        <button 
                          className="mobile-card-action-btn" 
                          onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
                        >
                          Send Item &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT TAB 2: SEND GOODS TO WAREHOUSE */}
      {activeTab === 'clientSendGoods' && (
        <div className="cart-page-screen tab-page-enter">
          <div className="cart-container">
            <div className="cart-white-card checkout-card">
              <div className="cart-header-row">
                <div>
                  <h2>Send Goods to Warehouse (Inward Consignment)</h2>
                </div>
                <button
                  type="button"
                  className="btn-status-history-pill"
                  onClick={() => setShowInwardStatusModal(true)}
                  title="View Inward Consignment Tracking History"
                >
                  <span>📋 Consignment Status History</span>
                  <span className="cart-badge">
                    {inwardRequests.filter(r => !currentUser.company || r.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))).length}
                  </span>
                </button>
              </div>

              <form onSubmit={handleClientInwardSubmit} className="checkout-form">
                <div className="form-grid-two">
                  <div className="form-group">
                    <label>Product / Commodity Name <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Whole Cashew Kernels, Pulses, Rice"
                      value={clientInwardForm.product}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, product: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Commodity Category</label>
                    <select
                      value={clientInwardForm.category}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, category: e.target.value })}
                    >
                      <option value="Cashew">Cashew & Dry Fruits</option>
                      <option value="Pulses">Pulses & Legumes</option>
                      <option value="Rice">Rice & Agro Products</option>
                      <option value="Spices">Spices & Condiments</option>
                      <option value="Dry Goods">General Dry Goods</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Brand & Variety</label>
                    <div className="two-inputs-row">
                      <input
                        type="text"
                        placeholder="Brand (e.g. CAJ)"
                        value={clientInwardForm.brand}
                        onChange={(e) => setClientInwardForm({ ...clientInwardForm, brand: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Variety (e.g. GRADE-W320)"
                        value={clientInwardForm.variety}
                        onChange={(e) => setClientInwardForm({ ...clientInwardForm, variety: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Quantity & Packaging <span className="req">*</span></label>
                    <div className="two-inputs-row">
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="Total Quantity"
                        value={clientInwardForm.qty}
                        onChange={(e) => setClientInwardForm({ ...clientInwardForm, qty: e.target.value })}
                      />
                      <select
                        value={clientInwardForm.unit}
                        onChange={(e) => setClientInwardForm({ ...clientInwardForm, unit: e.target.value })}
                      >
                        <option value="BAGS">BAGS</option>
                        <option value="BOX">BOXES / CARTONS</option>
                        <option value="KG">KG</option>
                        <option value="TON">TONS</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Estimated Total Weight (KG)</label>
                    <input
                      type="number"
                      placeholder="e.g. 24000"
                      value={clientInwardForm.weightKg}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, weightKg: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Lorry / Vehicle Number <span className="req">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TN22CY7236"
                      value={clientInwardForm.vehicleNo}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, vehicleNo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Driver / Transporter Contact Phone</label>
                    <input
                      type="text"
                      placeholder="e.g. 9585543555"
                      value={clientInwardForm.driverPhone}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, driverPhone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Expected Arrival Date <span className="req">*</span></label>
                    <input
                      type="date"
                      required
                      value={clientInwardForm.expectedDate}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, expectedDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Invoice / Doc Ref No</label>
                    <input
                      type="text"
                      placeholder="e.g. INV/LK/2026/894"
                      value={clientInwardForm.docNo}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, docNo: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Special Instructions / Remarks</label>
                    <input
                      type="text"
                      placeholder="e.g. Moisture sensitive, stack carefully"
                      value={clientInwardForm.remarks}
                      onChange={(e) => setClientInwardForm({ ...clientInwardForm, remarks: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-bottom-actions">
                  <button type="button" className="btn-hero-secondary" onClick={() => navigateToTab('clientInventory')}>
                    &larr; Back to My Items
                  </button>
                  <button type="submit" className="btn-submit-challan">
                    🚚 Submit Inward Advice &rarr;
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT TAB 3: INWARD STOCK REPORT */}
      {activeTab === 'clientInwardReport' && (
        <div className="inward-report-screen tab-page-enter">
          <div className="report-container">
            <div className="report-toolbar">
              <div>
                <h1 className="page-heading">My Monthly Stock Report</h1>
              </div>
              <button className="doc-print-btn" onClick={() => window.print()}>
                🖨️ Print Report
              </button>
            </div>

            <div className="official-report-sheet">
              <div className="report-header-flex">
                <div className="rep-top-meta-row">
                  <span className="rep-gst">GST.No. : 33AAFCH8632K1ZE</span>
                  <span className="rep-contact" style={{ color: '#0f766e', fontWeight: 'bold' }}>📞 96622 96633</span>
                </div>
                <div className="rep-center-brand">
                  <img src={heraLogo} alt="Hera Logistics Logo" className="rep-brand-logo-img" />
                  <h2 className="rep-company-title" style={{ color: '#991b1b', letterSpacing: '0.5px' }}>HERA LOGISTICS PVT.LTD.,</h2>
                  <p className="rep-tagline" style={{ fontWeight: '600' }}>Logistics Simplified</p>
                  <p className="rep-address">📍 No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.</p>
                </div>
              </div>

              <div className="rep-divider-rule" style={{ height: '2px', background: '#cbd5e1', margin: '10px 0 14px' }}></div>

              <div className="rep-client-box" style={{ textAlign: 'center', marginBottom: '14px', lineHeight: '1.4' }}>
                <div style={{ fontWeight: '800', fontSize: '0.88rem' }}>M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.,</div>
                <div style={{ fontSize: '0.78rem' }}>T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92</div>
                <div style={{ fontSize: '0.76rem', fontWeight: '700', marginTop: '2px', letterSpacing: '0.3px' }}>
                  CONTACT NAME: MR. CHIDAMBARAM &nbsp;&nbsp; PHONE: 9585543555
                </div>
              </div>

              <div className="rep-report-title" style={{ textAlign: 'center', fontWeight: '900', fontSize: '0.94rem', marginBottom: '12px', letterSpacing: '0.5px' }}>
                STOCK REPORT: 31.05.2026
              </div>

              <table className="rep-table-exact">
                <thead>
                  <tr style={{ background: '#334155', color: '#ffffff' }}>
                    <th style={{ width: '50px', textAlign: 'center' }}>S.NO</th>
                    <th style={{ width: '90px', textAlign: 'center' }}>IN.DATE</th>
                    <th style={{ textAlign: 'center' }}>DOCUMENT NUMBER</th>
                    <th style={{ textAlign: 'center' }}>WH LOCATION</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>WEIGHT</th>
                    <th style={{ textAlign: 'right', width: '110px' }}>NO OF BAGS</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.filter(s => !currentUser.company || s.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))).map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                      <td style={{ textAlign: 'center' }}>{item.inDate ? item.inDate.replace(/-2026|-26/, '') : ''}</td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{item.docNo}</td>
                      <td style={{ textAlign: 'center', fontWeight: '700' }}>{item.whLocation}</td>
                      <td style={{ textAlign: 'right' }}>{(item.weightKg || item.qty)?.toLocaleString()}</td>
                      <td style={{ textAlign: 'right' }}>{(parseInt(item.count) || Math.round((item.weightKg || item.qty) / 50))?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="rep-total-row" style={{ fontWeight: '800', background: '#F8FAFC' }}>
                    <td colSpan="4" style={{ textAlign: 'center', fontWeight: 'bold' }}>Total</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {stocks.filter(s => !currentUser.company || s.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))).reduce((sum, i) => sum + (i.weightKg || i.qty || 0), 0).toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      {stocks.filter(s => !currentUser.company || s.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))).reduce((sum, i) => sum + (parseInt(i.count) || Math.round((i.weightKg || i.qty) / 50)), 0).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>

              {/* Official Signatory Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '24px', paddingTop: '10px' }}>
                <div className="rep-footer-left">
                  <div className="rep-verified-badge">✓ SYSTEM VERIFIED DRY STOCK RECORD</div>
                  <div className="rep-timestamp-note" style={{ marginTop: '4px', fontSize: '0.7rem', color: '#64748B' }}>
                    Thoothukudi Central Hub • Hera Logistics Official Ledger
                  </div>
                </div>

                <div className="rep-footer-right" style={{ textAlign: 'right' }}>
                  <div className="rep-sign-company">For Hera Logistics Pvt. Ltd.</div>
                  <div className="rep-sign-rule" style={{ width: '180px', height: '1px', background: '#94a3b8', margin: '30px 0 4px auto' }}></div>
                  <div className="rep-sign-label" style={{ fontSize: '0.72rem', color: '#64748b' }}>Warehouse Authorized Signatory</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT TAB 4: DELIVERY CART & CHECKOUT */}
      {activeTab === 'cart' && (
        <div className="cart-page-screen tab-page-enter">
          <div className="cart-container">
            {cart.length === 0 ? (
              <div className="empty-cart-card">
                <div className="empty-cart-top-bar" style={{ width: '100%', display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
                  <button
                    type="button"
                    className="btn-status-history-pill"
                    onClick={() => setShowCustomerChallanModal(true)}
                    title="View Past Delivery Notes & Outward Challans"
                  >
                    <span>🚚 Delivery Note History</span>
                    <span className="cart-badge">
                      {challanHistory.length}
                    </span>
                  </button>
                </div>
                <div className="empty-icon">🛒</div>
                <h3>Your Delivery Cart is Empty</h3>
                <p>Select items from your inventory to dispatch cargo.</p>
                <button className="btn-hero-primary" onClick={() => navigateToTab('clientInventory')} style={{ marginTop: '16px' }}>
                  Browse My Items
                </button>
              </div>
            ) : (
              <>
                {cartStep === 'review' ? (
                  <div className="cart-white-card">
                    <div className="cart-header-row">
                      <div>
                        <h2>Delivery Items ({cart.length})</h2>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-status-history-pill"
                          onClick={() => setShowCustomerChallanModal(true)}
                          title="View Past Delivery Notes & Outward Challans"
                        >
                          <span>🚚 Delivery Notes</span>
                          <span className="cart-badge">
                            {challanHistory.length}
                          </span>
                        </button>
                        <span className="total-items-badge">
                          {cart.reduce((s, i) => s + i.selectedQty, 0)} Units Selected
                        </span>
                      </div>
                    </div>

                    <div className="table-card">
                      <table className="stocks-table">
                        <thead>
                          <tr>
                            <th>Item & Brand</th>
                            <th>Warehouse Bay</th>
                            <th>Lot Number</th>
                            <th style={{ textAlign: 'right' }}>Dispatch Qty</th>
                            <th style={{ textAlign: 'center' }}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map((item, idx) => (
                            <tr key={idx}>
                              <td>
                                <strong>{item.product}</strong>
                                <div className="brand-sub-badge">
                                  <span className={`brand-pill ${item.tagClass}`}>{item.brand}</span>
                                </div>
                              </td>
                              <td><span className="wh-bay-badge">{item.whLocation}</span></td>
                              <td>{item.lotNo} ({item.count})</td>
                              <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#0f766e', fontSize: '1rem' }}>
                                {item.selectedQty} {item.unit}
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                <button className="btn-action-delete" onClick={() => handleRemoveFromCart(idx)} title="Remove Item">
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="cart-bottom-bar">
                      <button className="btn-hero-secondary" onClick={() => setActiveTab('clientInventory')}>
                        + Add More Items
                      </button>
                      <button className="btn-submit-challan" onClick={() => setCartStep('details')}>
                        Proceed to Delivery Details &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="cart-white-card checkout-card">
                    <form onSubmit={handlePlaceOrderSubmit} className="checkout-form">
                      <div className="form-grid-two">
                        <div className="form-group">
                          <label>Customer / Party Name <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Destination Location <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Delivery Destination Address</label>
                          <input
                            type="text"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Contact Person & Phone</label>
                          <div className="two-inputs-row">
                            <input
                              type="text"
                              value={contactPerson}
                              onChange={(e) => setContactPerson(e.target.value)}
                            />
                            <input
                              type="text"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Lorry / Vehicle Number <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TN22CY7236"
                            value={transport}
                            onChange={(e) => setTransport(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-bottom-actions">
                        <button type="button" className="btn-hero-secondary" onClick={() => setCartStep('review')}>
                          &larr; Back to Items
                        </button>
                        <button type="submit" className="btn-submit-challan">
                          📄 Create Delivery Note
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      {activeItem && renderDispatchModal()}
      {issuedInwardReceipt && renderInwardReceiptModal()}
      {showInwardStatusModal && renderInwardStatusHistoryModal()}
      {showCustomerChallanModal && renderCustomerChallanModal()}
      {issuedChallan && renderChallanModal()}
      {showLearnMoreModal && renderLearnMoreModal()}

      {/* PWA Mobile Web App Install Banner */}
      {renderInstallBanner()}
    </div>
  );

  // Helper modal renderers
  function renderDispatchModal() {
    return (
      <div className="modal-backdrop" onClick={() => setActiveItem(null)}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">Select Quantity to Send</h2>
          <p className="modal-sub">
            <strong>{activeItem.product}</strong> {activeItem.brand ? `• ${activeItem.brand}` : ''}
          </p>

          <div className="modal-meta-box">
            <div>Bay: <strong>{activeItem.whLocation}</strong></div>
            <div>Available: <strong>{activeItem.qty} {activeItem.unit}</strong></div>
          </div>

          <form onSubmit={handleAddToCart}>
            <div className="dispatch-input-group">
              <label className="dispatch-input-label">How many {activeItem.unit} to send?</label>
              <div className="dispatch-input-wrapper">
                <input
                  type="number"
                  min="1"
                  max={activeItem.qty}
                  step="any"
                  value={inputQty}
                  onChange={handleQtyChange}
                  placeholder={`Enter 1 to ${activeItem.qty}`}
                  className="dispatch-qty-field"
                  autoFocus
                />
                <span className="dispatch-qty-unit">{activeItem.unit}</span>
              </div>
              {qtyError && <div className="error-text" style={{ color: '#b91c1c', fontSize: '0.74rem', marginTop: '4px', textAlign: 'left' }}>{qtyError}</div>}
            </div>

            <div className="modal-actions" style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" className="btn-hero-secondary" onClick={() => setActiveItem(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-hero-primary">
                Add to Delivery Cart
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function renderInwardModal() {
    return (
      <div className="modal-backdrop" onClick={() => setShowInwardModal(false)}>
        <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">
            {editingStockId ? '✏️ Edit Item / Bay' : '+ Add New Inward Stock'}
          </h2>
          <p className="modal-sub">
            {editingStockId ? 'Update quantity, bay, or weight' : 'Add incoming items to Hera Warehouse'}
          </p>

          <form onSubmit={handleSaveInwardSubmit} className="inward-entry-form">
            <div className="form-grid-two">
              <div className="form-group">
                <label>Item Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rice, Grains, Raw Cashews"
                  value={inwardForm.product}
                  onChange={(e) => setInwardForm({ ...inwardForm, product: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Customer Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M/S. Lords and Kings"
                  value={inwardForm.clientName}
                  onChange={(e) => setInwardForm({ ...inwardForm, clientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={inwardForm.category}
                  onChange={(e) => setInwardForm({ ...inwardForm, category: e.target.value })}
                >
                  <option value="Dry Goods">Dry Goods / Commodities</option>
                  <option value="Packaged Cargo">Packaged Goods / Boxes</option>
                </select>
              </div>

              <div className="form-group">
                <label>Bill / Invoice No</label>
                <input
                  type="text"
                  placeholder="e.g. 428109988"
                  value={inwardForm.docNo}
                  onChange={(e) => setInwardForm({ ...inwardForm, docNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Warehouse Bay (e.g. SIP-C14)</label>
                <input
                  type="text"
                  placeholder="e.g. SIP-C14, SIP-10"
                  value={inwardForm.whLocation}
                  onChange={(e) => setInwardForm({ ...inwardForm, whLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Brand / Maker</label>
                <input
                  type="text"
                  placeholder="e.g. TIGER, GLOBAL HARVEST"
                  value={inwardForm.brand}
                  onChange={(e) => setInwardForm({ ...inwardForm, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Lot Number</label>
                <input
                  type="text"
                  placeholder="e.g. LOT-98210"
                  value={inwardForm.lotNo}
                  onChange={(e) => setInwardForm({ ...inwardForm, lotNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Packaging / Unit</label>
                <select
                  value={inwardForm.unit}
                  onChange={(e) => setInwardForm({ ...inwardForm, unit: e.target.value })}
                >
                  <option value="BAGS">BAGS</option>
                  <option value="BOX">BOXES / CARTONS</option>
                  <option value="KG">KG</option>
                  <option value="MT">TONS</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity <span className="req">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="e.g. 350"
                  value={inwardForm.qty}
                  onChange={(e) => setInwardForm({ ...inwardForm, qty: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Total Weight (KG)</label>
                <input
                  type="number"
                  placeholder="e.g. 28000"
                  value={inwardForm.weightKg}
                  onChange={(e) => setInwardForm({ ...inwardForm, weightKg: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-hero-secondary" onClick={() => setShowInwardModal(false)}>Cancel</button>
              <button type="submit" className="btn-submit-challan">
                {editingStockId ? 'Save Changes' : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function renderChallanModal() {
    return (
      <div className="challan-view-overlay" onClick={() => { setIssuedChallan(null); setShowChallanActionMenu(false); }}>
        <div className="challan-modal-container" onClick={(e) => e.stopPropagation()}>
          {/* Desktop Toolbar */}
          <div className="challan-toolbar challan-toolbar-desktop">
            <div className="toolbar-tabs">
              <button
                className={`challan-tab-btn ${activeChallanTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setActiveChallanTab('delivery')}
              >
                📄 Delivery Note / Challan
              </button>
              <button
                className={`challan-tab-btn ${activeChallanTab === 'inward' ? 'active' : ''}`}
                onClick={() => setActiveChallanTab('inward')}
              >
                📥 Inward Receipt (GRN)
              </button>
            </div>

            <div className="toolbar-actions">
              <button className="doc-pdf-btn" onClick={handleDownloadPdf} disabled={isDownloading}>
                {isDownloading ? '⏳ Saving PDF...' : '⬇ Download PDF'}
              </button>
              <button className="doc-print-btn" onClick={() => window.print()}>
                🖨️ Print
              </button>
              <button className="doc-close-btn" onClick={() => { setIssuedChallan(null); setShowChallanActionMenu(false); }}>&times;</button>
            </div>
          </div>

          {/* Mobile Clean Single-Action Toolbar */}
          <div className="challan-toolbar challan-toolbar-mobile">
            <div className="mobile-toolbar-title-wrap">
              <span className="mobile-toolbar-badge">
                {activeChallanTab === 'delivery' ? '📄 Delivery Note' : '📥 Inward GRN'}
              </span>
            </div>

            <div className="mobile-toolbar-actions">
              <button
                type="button"
                className="btn-mobile-options-pill"
                onClick={() => setShowChallanActionMenu(true)}
              >
                ⚡ Options ▾
              </button>
              <button
                type="button"
                className="doc-close-btn"
                onClick={() => { setIssuedChallan(null); setShowChallanActionMenu(false); }}
                title="Close Document"
              >
                &times;
              </button>
            </div>
          </div>

          <div className="challan-printable-sheet" id="challan-doc-sheet">
            {/* Outer Box Enclosure matching official Challan template */}
            <div className="challan-template-frame">
              {/* Header Grid */}
              <div className="challan-header-grid">
                <div className="challan-company-left">
                  <img src={heraLogo} alt="Hera Logo" className="challan-brand-logo-img" />
                  <div className="challan-reg-meta">
                    <div className="reg-row">
                      <span className="reg-lbl">GSTIN</span>
                      <span className="reg-colon">:</span>
                      <span className="reg-val">33AAFCH8632K1ZE</span>
                    </div>
                    <div className="reg-row">
                      <span className="reg-lbl">CIN</span>
                      <span className="reg-colon">:</span>
                      <span className="reg-val">U74900TN1993PTC024718</span>
                    </div>
                  </div>
                </div>

                <div className="challan-company-right">
                  <h3 className="company-full-name">HERA LOGISTICS PVT. LTD.</h3>
                  <p className="company-hub-address">
                    No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.<br />
                    Tamil Nadu, India.<br />
                    Contact : 96622 96633<br />
                    E-Mail: contact@heralogistics.com<br />
                    Website: www.heralogistics.com
                  </p>
                </div>
              </div>

              {/* Title Bar with gray background matching template */}
              <div className="challan-title-bar">
                <h2>{activeChallanTab === 'delivery' ? 'DELIVERY CHALLAN' : 'INWARD GOODS RECEIPT (GRN)'}</h2>
              </div>

              {/* Metadata 2-Column Section */}
              <div className="challan-meta-grid">
                <div className="meta-left-col">
                  <div className="meta-row">
                    <span className="meta-label">Customer Name</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value bold">{issuedChallan.customerName}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Address</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.address || 'Chennai / Thoothukudi Hub'}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Contact Person</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.contactPerson || 'MR. CHIDAMBARAM'}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Contact No</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.contactNo || '9585543555'}</span>
                  </div>
                </div>

                <div className="meta-right-col">
                  <div className="meta-row">
                    <span className="meta-label">DC No</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value bold">{issuedChallan.dcNo}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">DC Date</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.dcDate}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Destination</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.destination || 'CHENNAI - KOYAMBEDU'}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Prepared By</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.preparedBy || 'ADMIN'}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Vehicle No</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value bold">{issuedChallan.vehicleNo}</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-label">Gate In NO</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">{issuedChallan.gateInNo}</span>
                  </div>
                </div>
              </div>

              {/* Items Table matching exact template */}
              <div className="challan-table-container">
                <table className="challan-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px', textAlign: 'left' }}>S.NO.</th>
                      <th style={{ width: '150px', textAlign: 'left' }}>GRN No</th>
                      <th style={{ width: '90px', textAlign: 'left' }}>Brand</th>
                      <th style={{ textAlign: 'left' }}>Variety</th>
                      <th style={{ width: '90px', textAlign: 'left' }}>LOT NO</th>
                      <th style={{ width: '80px', textAlign: 'left' }}>COUNT</th>
                      <th style={{ width: '70px', textAlign: 'right' }}>Qty</th>
                      <th style={{ width: '80px', textAlign: 'left' }}>RateType</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedChallan.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'left' }}>{idx + 1}</td>
                        <td className="dc-grn">{item.grnNo}</td>
                        <td>{item.brand || 'CAJ'}</td>
                        <td>{item.variety || item.product}</td>
                        <td>{item.lotNo || '9738282'}</td>
                        <td>{item.count || (item.unit === 'BAGS' ? '120VP' : item.unit)}</td>
                        <td style={{ textAlign: 'right' }}>{Number(item.selectedQty).toFixed(2)}</td>
                        <td>{item.rateType || 'Daily'}</td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 10 - issuedChallan.items.length) }).map((_, i) => (
                      <tr key={`blank-${i}`} className="blank-row">
                        <td>&nbsp;</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="6" className="total-label-cell" style={{ textAlign: 'right' }}>
                        Total Quantity ({issuedChallan.items[0]?.unit || 'BAGS'})
                      </td>
                      <td className="total-qty-cell" style={{ textAlign: 'right' }}>
                        {issuedChallan.totalQty?.toFixed(2)}
                      </td>
                      <td className="total-qty-cell"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Footer Section */}
              <div className="challan-footer-grid">
                <div className="footer-remarks-col">
                  <div className="remarks-header-row">
                    <span className="remarks-title">REMARKS:</span>
                    <span className="eoe-tag">E. & O.E</span>
                  </div>
                  <p className="remarks-text">GR: GOODS DISPATCH AUTHORIZED FROM THOOTHUKUDI DRY WAREHOUSE HUB</p>
                </div>
                <div className="footer-sign-col">
                  <div className="sign-company-name">For Hera Logistics Pvt. Ltd.</div>
                  <div className="authorised-sign-box">
                    <div className="sign-line-rule"></div>
                    <span className="authorised-sign-text">Authorised Signatory</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User-Friendly Mobile Action Sheet Popup Overlay */}
        {showChallanActionMenu && (
          <div className="action-menu-backdrop" onClick={() => setShowChallanActionMenu(false)}>
            <div className="action-menu-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="action-sheet-pill-handle"></div>
              <div className="action-menu-header">
                <h3>Document Actions</h3>
                <p>Choose an action for {issuedChallan.dcNo}</p>
              </div>

              <div className="action-menu-list">
                <button
                  type="button"
                  className={`action-menu-item ${activeChallanTab === 'delivery' ? 'active-selection' : ''}`}
                  onClick={() => {
                    setActiveChallanTab('delivery');
                    setShowChallanActionMenu(false);
                  }}
                >
                  <span className="action-item-icon">📄</span>
                  <div className="action-item-text">
                    <strong>Delivery Note / Challan</strong>
                    <span>Customer delivery & outward dispatch note</span>
                  </div>
                  {activeChallanTab === 'delivery' && <span className="action-check-badge">ACTIVE</span>}
                </button>

                <button
                  type="button"
                  className={`action-menu-item ${activeChallanTab === 'inward' ? 'active-selection' : ''}`}
                  onClick={() => {
                    setActiveChallanTab('inward');
                    setShowChallanActionMenu(false);
                  }}
                >
                  <span className="action-item-icon">📥</span>
                  <div className="action-item-text">
                    <strong>Inward Goods Receipt (GRN)</strong>
                    <span>Warehouse stock entry & gate pass record</span>
                  </div>
                  {activeChallanTab === 'inward' && <span className="action-check-badge">ACTIVE</span>}
                </button>

                <button
                  type="button"
                  className="action-menu-item action-primary-pdf"
                  onClick={() => {
                    setShowChallanActionMenu(false);
                    handleDownloadPdf();
                  }}
                  disabled={isDownloading}
                >
                  <span className="action-item-icon">⬇️</span>
                  <div className="action-item-text">
                    <strong>{isDownloading ? '⏳ Generating PDF...' : 'Download Official PDF'}</strong>
                    <span>Save high-res document to your device</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="action-menu-item"
                  onClick={() => {
                    setShowChallanActionMenu(false);
                    window.print();
                  }}
                >
                  <span className="action-item-icon">🖨️</span>
                  <div className="action-item-text">
                    <strong>Print Document</strong>
                    <span>Print directly via local printer</span>
                  </div>
                </button>
              </div>

              <button type="button" className="btn-action-cancel" onClick={() => setShowChallanActionMenu(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  function renderAcceptInwardModal() {
    if (!acceptingRequest) return null;
    return (
      <div className="modal-backdrop" onClick={() => setAcceptingRequest(null)}>
        <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dispatch-modal-header" style={{ marginBottom: '12px' }}>
            <div>
              <h2 className="modal-title">Verify & Accept Inward Cargo</h2>
              <p className="modal-sub-clean" style={{ margin: 0 }}>
                Inward Notice: <strong>{acceptingRequest.inwardNo}</strong> • {acceptingRequest.clientName}
              </p>
            </div>
            <button className="modal-close-icon" onClick={() => setAcceptingRequest(null)}>✕</button>
          </div>

          <form onSubmit={handleConfirmAcceptInwardSubmit} className="checkout-form">
            <div className="modal-meta-box" style={{ marginBottom: '16px', display: 'flex', gap: '16px', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem' }}>
              <div>📦 Product: <strong>{acceptingRequest.product}</strong> ({acceptingRequest.brand})</div>
              <div>🚚 Lorry: <strong>{acceptingRequest.vehicleNo}</strong></div>
              <div>📞 Driver: <strong>{acceptingRequest.driverPhone}</strong></div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label>Assign Warehouse Bay Location <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SIP-B3, SIP-10"
                  value={acceptBay}
                  onChange={(e) => setAcceptBay(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Verified Physical Quantity ({acceptingRequest.unit}) <span className="req">*</span></label>
                <input
                  type="number"
                  required
                  min="1"
                  value={acceptQty}
                  onChange={(e) => setAcceptQty(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Verified Total Weight (KG)</label>
                <input
                  type="number"
                  value={acceptWeight}
                  onChange={(e) => setAcceptWeight(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Client Document / Bill Reference</label>
                <input
                  type="text"
                  value={acceptingRequest.docNo}
                  readOnly
                  style={{ background: '#f1f5f9', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div className="form-bottom-actions" style={{ marginTop: '20px' }}>
              <button type="button" className="btn-hero-secondary" onClick={() => setAcceptingRequest(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-submit-challan">
                ✅ Confirm & Store in Warehouse &rarr;
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function renderInwardReceiptModal() {
    if (!issuedInwardReceipt) return null;
    return (
      <div className="challan-view-overlay">
        <div className="challan-modal-container">
          <div className="challan-toolbar">
            <div className="toolbar-tabs">
              <button className="challan-tab-btn active">
                📥 Inward Consignment Advice Note
              </button>
            </div>
            <div className="toolbar-actions">
              <button className="doc-pdf-btn" onClick={handleDownloadInwardAdvicePdf} disabled={isDownloading}>
                {isDownloading ? '⏳ Saving PDF...' : '⬇ Download PDF'}
              </button>
              <button className="doc-print-btn" onClick={() => window.print()}>
                🖨️ Print
              </button>
              <button className="doc-close-btn" onClick={() => setIssuedInwardReceipt(null)}>&times;</button>
            </div>
          </div>

          <div className="challan-printable-sheet" id="inward-advice-sheet">
            <div className="challan-template-frame">
              <div className="challan-header-grid">
                <div className="challan-company-left">
                  <img src={heraLogo} alt="Hera Logo" className="challan-brand-logo-img" />
                  <div className="challan-reg-meta">
                    <div className="reg-row"><span className="reg-lbl">GSTIN</span><span className="reg-colon">:</span><span className="reg-val">33AAFCH8632K1ZE</span></div>
                    <div className="reg-row"><span className="reg-lbl">CIN</span><span className="reg-colon">:</span><span className="reg-val">U74900TN1993PTC024718</span></div>
                  </div>
                </div>
                <div className="challan-company-right">
                  <h3 className="company-full-name">HERA LOGISTICS PVT. LTD.</h3>
                  <p className="company-hub-address">
                    No.2G/69/1, Rajiv Nagar, Thoothukudi - 628008.<br />
                    Tamil Nadu, India.<br />
                    Contact : 96622 96633<br />
                    E-Mail: contact@heralogistics.com<br />
                    Website: www.heralogistics.com
                  </p>
                </div>
              </div>

              <div className="challan-title-bar">
                <h2>INWARD CONSIGNMENT ADVICE NOTE (PRE-ADVICE)</h2>
              </div>

              <div className="challan-meta-grid">
                <div className="meta-left-col">
                  <div className="meta-row"><span className="meta-label">Customer Name</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.clientName}</span></div>
                  <div className="meta-row"><span className="meta-label">Contact Phone</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.driverPhone}</span></div>
                  <div className="meta-row"><span className="meta-label">Invoice Ref</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.docNo}</span></div>
                  <div className="meta-row"><span className="meta-label">Remarks</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.remarks}</span></div>
                </div>
                <div className="meta-right-col">
                  <div className="meta-row"><span className="meta-label">Inward Advice No</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.inwardNo}</span></div>
                  <div className="meta-row"><span className="meta-label">Date Submitted</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.createdAt}</span></div>
                  <div className="meta-row"><span className="meta-label">Expected Date</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.expectedDate}</span></div>
                  <div className="meta-row"><span className="meta-label">Lorry / Vehicle</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.vehicleNo}</span></div>
                </div>
              </div>

              <div className="challan-table-container">
                <table className="challan-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px', textAlign: 'left' }}>S.NO.</th>
                      <th style={{ textAlign: 'left' }}>Product Description</th>
                      <th style={{ width: '100px', textAlign: 'left' }}>Brand</th>
                      <th style={{ width: '100px', textAlign: 'left' }}>Variety</th>
                      <th style={{ width: '100px', textAlign: 'right' }}>Declared Qty</th>
                      <th style={{ width: '110px', textAlign: 'right' }}>Weight (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>{issuedInwardReceipt.product}</strong></td>
                      <td>{issuedInwardReceipt.brand}</td>
                      <td>{issuedInwardReceipt.variety}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{issuedInwardReceipt.qty} {issuedInwardReceipt.unit}</td>
                      <td style={{ textAlign: 'right' }}>{issuedInwardReceipt.weightKg ? Number(issuedInwardReceipt.weightKg).toLocaleString() + ' KG' : '—'}</td>
                    </tr>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="blank-row">
                        <td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="challan-footer-grid">
                <div className="footer-remarks-col">
                  <div className="remarks-header-row"><span className="remarks-title">INSTRUCTIONS FOR TRANSPORTER:</span><span className="eoe-tag">E. & O.E</span></div>
                  <p className="remarks-text">Please present this Inward Advice Note upon vehicle arrival at Hera Logistics Warehouse Gate.</p>
                </div>
                <div className="footer-sign-col">
                  <div className="sign-company-name">For Hera Logistics Hub</div>
                  <div className="authorised-sign-box"><div className="sign-line-rule"></div><span className="authorised-sign-text">Gate Security / Officer</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderInwardStatusHistoryModal() {
    const myRequests = inwardRequests.filter(r => !currentUser.company || r.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8)));
    return (
      <div className="modal-backdrop" onClick={() => setShowInwardStatusModal(false)}>
        <div className="modal-card status-history-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dispatch-modal-header" style={{ marginBottom: '14px' }}>
            <div>
              <h2 className="modal-title" style={{ textAlign: 'left' }}>My Inward Consignments Status</h2>
            </div>
            <button className="modal-close-icon" onClick={() => setShowInwardStatusModal(false)}>✕</button>
          </div>

          {myRequests.length === 0 ? (
            <div className="empty-cart-card" style={{ padding: '24px' }}>
              <div className="empty-icon">📦</div>
              <h3>No Inward Consignments Sent Yet</h3>
              <p>Fill out the inward form to submit your first cargo advice note.</p>
            </div>
          ) : (
            <div className="table-card" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <table className="stocks-table">
                <thead>
                  <tr>
                    <th>Inward Advice No</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Quantity & Weight</th>
                    <th>Lorry Number</th>
                    <th style={{ textAlign: 'center' }}>Warehouse Status</th>
                    <th style={{ textAlign: 'center' }}>Advice Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map(req => (
                    <tr key={req.id}>
                      <td><strong className="doc-num-bold">{req.inwardNo}</strong></td>
                      <td>{req.createdAt}</td>
                      <td><strong>{req.product}</strong> ({req.brand})</td>
                      <td>{req.qty} {req.unit} • {req.weightKg ? Number(req.weightKg).toLocaleString() + ' KG' : '—'}</td>
                      <td><span className="wh-bay-badge">{req.vehicleNo}</span></td>
                      <td style={{ textAlign: 'center' }}>
                        {req.status === 'PENDING' ? (
                          <span className="wh-bay-badge" style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                            🟡 PENDING ARRIVAL
                          </span>
                        ) : (
                          <span className="wh-bay-badge" style={{ background: '#DCFCE7', color: '#166534', borderColor: '#BBF7D0' }}>
                            🟢 STORED IN {req.whLocation}
                          </span>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="row-dispatch-btn" onClick={() => { setShowInwardStatusModal(false); setIssuedInwardReceipt(req); }}>
                          View Slip &rarr;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: '14px' }}>
            <button type="button" className="btn-hero-secondary" onClick={() => setShowInwardStatusModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderCustomerChallanModal() {
    const myChallans = challanHistory;
    return (
      <div className="modal-backdrop" onClick={() => setShowCustomerChallanModal(false)}>
        <div className="modal-card status-history-modal" onClick={(e) => e.stopPropagation()}>
          <div className="dispatch-modal-header" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 className="modal-title" style={{ textAlign: 'left', margin: 0 }}>My Delivery Notes & Challans</h2>
              <p className="modal-sub-clean" style={{ margin: '3px 0 0 0', textAlign: 'left', fontSize: '0.76rem', color: '#64748B' }}>
                Issued outbound delivery notes & warehouse gate pass history
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-status-history-pill"
                onClick={loadSupabaseData}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                🔄 Refresh
              </button>
              <button className="modal-close-icon" onClick={() => setShowCustomerChallanModal(false)}>✕</button>
            </div>
          </div>

          {myChallans.length === 0 ? (
            <div className="empty-cart-card" style={{ padding: '24px' }}>
              <div className="empty-icon">🚚</div>
              <h3>No Delivery Notes Generated Yet</h3>
              <p>When you dispatch items from your inventory, official delivery notes will appear here.</p>
            </div>
          ) : (
            <div className="stocks-table-wrapper" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {/* Desktop Table View */}
              <div className="stocks-desktop-table">
                <table className="stocks-table">
                  <thead>
                    <tr>
                      <th>Delivery Note (DC)</th>
                      <th>Issue Date</th>
                      <th>Destination</th>
                      <th>Vehicle No</th>
                      <th style={{ textAlign: 'right' }}>Total Units</th>
                      <th style={{ textAlign: 'center' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myChallans.map(dc => (
                      <tr key={dc.id}>
                        <td><strong className="doc-num-bold">{dc.dcNo}</strong></td>
                        <td>{dc.dcDate}</td>
                        <td>{dc.destination}</td>
                        <td><span className="wh-bay-badge">{dc.vehicleNo}</span></td>
                        <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{dc.totalQty} Units</td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="row-dispatch-btn"
                            onClick={() => {
                              setShowCustomerChallanModal(false);
                              setIssuedChallan(dc);
                            }}
                          >
                            View / Print &rarr;
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card Feed */}
              <div className="stocks-mobile-cards">
                {myChallans.map(dc => (
                  <div
                    key={dc.id}
                    className="mobile-stock-card"
                    onClick={() => {
                      setShowCustomerChallanModal(false);
                      setIssuedChallan(dc);
                    }}
                  >
                    <div className="mobile-card-top">
                      <div className="mobile-card-product">
                        <span className="mobile-product-name">{dc.destination}</span>
                        <div className="brand-sub-badge" style={{ marginTop: '2px' }}>
                          <span className="variety-txt">Lorry: {dc.vehicleNo}</span>
                        </div>
                      </div>
                      <span className="wh-bay-badge">{dc.totalQty} Units</span>
                    </div>

                    <div className="mobile-card-metrics">
                      <div className="mobile-metric-item">
                        <span className="mobile-metric-label">DC NUMBER</span>
                        <span className="mobile-metric-value font-mono">{dc.dcNo}</span>
                      </div>
                      <div className="mobile-metric-item">
                        <span className="mobile-metric-label">DATE</span>
                        <span className="mobile-metric-value">{dc.dcDate}</span>
                      </div>
                      <div className="mobile-metric-item">
                        <span className="mobile-metric-label">STATUS</span>
                        <span className="mobile-metric-value" style={{ color: '#0f766e', fontWeight: '800' }}>DISPATCHED</span>
                      </div>
                    </div>

                    <div className="mobile-card-footer">
                      <span className="mobile-more-info">Prepared: {dc.preparedBy || 'ADMIN'}</span>
                      <button
                        className="mobile-card-action-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowCustomerChallanModal(false);
                          setIssuedChallan(dc);
                        }}
                      >
                        View / Print &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-actions" style={{ marginTop: '14px', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-hero-secondary" onClick={() => setShowCustomerChallanModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderLearnMoreModal() {
    return (
      <div className="modal-backdrop" onClick={() => setShowLearnMoreModal(false)}>
        <div className="modal-card specs-simple-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-simple">
            <div className="modal-header-title-box">
              <div className="simple-badge-hub">📍 Thoothukudi Central Hub</div>
              <h2>Prime Dry Storage & Space Rental</h2>
            </div>
            <button className="modal-close-icon" onClick={() => setShowLearnMoreModal(false)}>✕</button>
          </div>

          <div className="simple-specs-list">
            <div className="simple-spec-row">
              <span className="spec-row-icon">📍</span>
              <div className="spec-row-info">
                <strong>Warehouse Location</strong>
                <p>Rajiv Nagar Highway Corridor, Thoothukudi (Direct VO Port & Highway connectivity)</p>
              </div>
            </div>

            <div className="simple-spec-row">
              <span className="spec-row-icon">🌡️</span>
              <div className="spec-row-info">
                <strong>Storage Condition</strong>
                <p>100% Dry, moisture-controlled & pest-safe for Cashew, Grains, Pulses & Spices</p>
              </div>
            </div>

            <div className="simple-spec-row">
              <span className="spec-row-icon">📦</span>
              <div className="spec-row-info">
                <strong>Bay & Lot Management</strong>
                <p>Assigned SIP bays, pallet racking, accurate batch lot tracking and FIFO handling</p>
              </div>
            </div>

            <div className="simple-spec-row">
              <span className="spec-row-icon">🛡️</span>
              <div className="spec-row-info">
                <strong>Security & Safety</strong>
                <p>24/7 on-site personnel, CCTV coverage, gate pass verification & fire safety</p>
              </div>
            </div>
          </div>

          <div className="simple-contact-strip">
            <div className="contact-strip-left">
              <span className="contact-sub">Warehouse Operations Desk</span>
              <span className="contact-phone">📞 Helpline: <strong>96622 96633</strong></span>
            </div>
            <button
              type="button"
              className="btn-simple-modal-action"
              onClick={() => {
                setShowLearnMoreModal(false);
                if (currentUser.role === 'admin') setActiveTab('adminInventory');
                else setActiveTab('clientInventory');
              }}
            >
              Open Live Stock &rarr;
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderInstallBanner() {
    if (!showInstallBanner) return null;
    return (
      <div className="pwa-install-banner">
        <div className="pwa-install-left">
          <img src={heraLogo} alt="Hera Logo" className="pwa-install-logo" />
          <div className="pwa-install-text">
            <strong>Install Hera Logistics App</strong>
            <span>{isIosSafari ? 'Tap Share ⎋ → Add to Home Screen' : 'Add to Home screen for 1-tap stock access'}</span>
          </div>
        </div>
        <div className="pwa-install-actions">
          <button className="btn-pwa-install" onClick={handleInstallClick}>
            {isIosSafari ? 'How to Add' : 'Install App'}
          </button>
          <button className="btn-pwa-dismiss" onClick={handleDismissInstall} title="Dismiss">
            ✕
          </button>
        </div>
      </div>
    );
  }
}

export default App;
