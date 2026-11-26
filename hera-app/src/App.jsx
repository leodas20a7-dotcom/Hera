import React, { useState, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import './App.css';
import heraLogo from './assets/HERA LOGO.jpeg';
import heraWarehouseImg from './assets/hera_warehouse_hero.jpg';
import { supabase } from './supabaseClient';
import { getLogisticsConfig } from './logisticsConfig';
import { KERN_INITIAL_STOCKS } from './kernData';
import { KernStockSummaryReport } from './KernStockSummaryReport';
import { AddProductsPanel } from './AddProductsPanel';

// Initial empty stocks (Driven 100% by live Supabase realtime data)
const INITIAL_STOCKS = [];

// Single explicit Admin Credential
const ADMIN_CREDENTIALS = {
  email: 'admin@heralogistics.com',
  phone: '9876543210',
  pin: '123456',
  password: 'hera@admin2026',
  name: 'Hera Admin (Operations Desk)',
  role: 'admin',
  company: 'Hera Logistics Pvt. Ltd. Thoothukudi',
  address: 'Thoothukudi Central Hub'
};

// Demo Client Account
const DEMO_CLIENT = {
  id: 'client-lords',
  name: 'Mr. Chidambaram',
  role: 'client',
  email: 'client@lordskings.com',
  phone: '9585543555',
  pin: '123456',
  company: 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.',
  address: 'T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92'
};

// Initial empty Inward Consignment Requests (Driven 100% by live Supabase realtime data)
const INITIAL_INWARD_REQUESTS = [];

// Prime Dry / Cold Storage Hero Banner Component
function WarehouseHeroBanner({ onManageInventory, onLearnMore, logistics }) {
  const isKern = logistics?.id === 'kern';
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

                {/* Clean Direct Branding on Crate */}
                <div className="crate-clean-brand">
                  <span className="crate-brand-title">{isKern ? 'KERN' : 'HERA'}</span>
                  <span className="crate-brand-subtitle">{isKern ? 'Cold & Agro Storage' : 'Dry Storage Solutions'}</span>
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
            {isKern ? (
              <>Cold &amp; Agro Storage <br /> &amp; Space Rental</>
            ) : (
              <>Prime Dry Storage <br /> &amp; Space Rental</>
            )}
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

  const activeLogistics = getLogisticsConfig(currentUser?.logisticsId || 'hera');

  useEffect(() => {
    document.title = currentUser
      ? `${activeLogistics.label} - Warehouse Portal`
      : 'Warehouse & Cold Storage Portal';
  }, [currentUser, activeLogistics.label]);

  // Active page tab inside portal with memory persistence:
  // For Admin: 'adminOverview' (Home) | 'adminInventory' | 'adminIncoming' | 'adminInwardReport' | 'adminChallans'
  // For Client: 'clientHome' (Home) | 'clientInventory' | 'clientSendGoods' | 'clientInwardReport' | 'cart'
  const [activeTab, setActiveTab] = useState(() => {
    const savedUser = localStorage.getItem('hera_current_user');
    if (!savedUser) return 'portalLogin';
    const savedTab = localStorage.getItem('hera_active_tab');
    if (savedTab && savedTab !== 'portalLogin') return savedTab;
    const parsed = JSON.parse(savedUser);
    return parsed.role === 'admin' ? 'adminOverview' : 'clientInventory';
  });

  // Track and persist active tab in memory
  useEffect(() => {
    if (activeTab && activeTab !== 'portalLogin') {
      localStorage.setItem('hera_active_tab', activeTab);
    }
  }, [activeTab]);

  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  // Live stocks (scoped strictly by logged-in logistics: 'hera' | 'kern')
  const [stocks, setStocks] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
    if (!savedUser?.logisticsId) return [];
    const key = savedUser.logisticsId === 'kern' ? 'kern_stocks' : 'hera_stocks';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Live challan history (scoped strictly by logged-in logistics)
  const [challanHistory, setChallanHistory] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
    if (!savedUser?.logisticsId) return [];
    const key = savedUser.logisticsId === 'kern' ? 'kern_challans' : 'hera_challans';
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  });

  // Live Incoming / Inward Requests from Clients (scoped strictly by logged-in logistics)
  const [inwardRequests, setInwardRequests] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
    if (!savedUser?.logisticsId) return [];
    const key = savedUser.logisticsId === 'kern' ? 'kern_inward_requests' : 'hera_inward_requests';
    const saved = localStorage.getItem(key);
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

  // Gateway Auth Form state (Logistics Selector, Mobile & 6-Digit PIN)
  const [selectedLogistics, setSelectedLogistics] = useState('kern'); // 'hera' | 'kern'
  const [gatewayTab, setGatewayTab] = useState('login'); // 'login' | 'register'
  const [phoneInput, setPhoneInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [regName, setRegName] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');

  // Floating Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3800);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Admin PIN Management state
  const [showPinModal, setShowPinModal] = useState(false);
  const [dbProfiles, setDbProfiles] = useState([]);
  const [pinUpdateStatus, setPinUpdateStatus] = useState('');
  const [editingPinUser, setEditingPinUser] = useState(null);
  const [newPinValue, setNewPinValue] = useState('');

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
  const [fromCompany, setFromCompany] = useState('M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.');
  const [fromAddress, setFromAddress] = useState('#328, 2nd floor, Ten Square Mall, Jawaharlal Nehru Road, Koyambedu, Chennai-600107');
  const [customerName, setCustomerName] = useState('GLOBAL ENTERPRISES');
  const [customerAddress, setCustomerAddress] = useState('Jeevarathinam St, St, 3rd Street, Ksr Nagar, Chennai');
  const [contactPerson, setContactPerson] = useState('MR. CHIDAMBARAM');
  const [contactPhone, setContactPhone] = useState('9585543555');
  const [transport, setTransport] = useState('TN30BR8670');
  const [destination, setDestination] = useState('CHENNAI');
  const [gateInNoInput, setGateInNoInput] = useState('');
  const [dcDateInput, setDcDateInput] = useState(new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'));
  const [preparedBy, setPreparedBy] = useState('M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.');
  const [reportSubTab, setReportSubTab] = useState('stockReport'); // 'stockReport' | 'deliveryHistory'

  // Issued Challan modal & PDF state
  const [issuedChallan, setIssuedChallan] = useState(null);
  const [activeChallanTab, setActiveChallanTab] = useState('delivery'); // 'delivery' | 'inward'
  const [isDownloading, setIsDownloading] = useState(false);
  const [showChallanActionMenu, setShowChallanActionMenu] = useState(false);
  const [showCustomerChallanModal, setShowCustomerChallanModal] = useState(false);
  const [showReportDownloadConfirm, setShowReportDownloadConfirm] = useState(false);
  const [cartBadgeBump, setCartBadgeBump] = useState(false);
  const [editingDeliveryNote, setEditingDeliveryNote] = useState(null);
  const [editDcForm, setEditDcForm] = useState({
    dcNo: '',
    dcDate: '',
    customerName: '',
    address: '',
    contactPerson: '',
    contactNo: '',
    destination: '',
    vehicleNo: '',
    gateInNo: '',
    preparedBy: '',
    totalQty: ''
  });
  const [isSavingDc, setIsSavingDc] = useState(false);

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

  // Reusable Live Supabase Sync function (scoped strictly by active logistics: 'hera' | 'kern')
  const loadSupabaseData = async (explicitLogisticsId) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
      const validExplicit = typeof explicitLogisticsId === 'string' ? explicitLogisticsId : null;
      const activeLogisticsId = validExplicit || savedUser?.logisticsId;
      if (!activeLogisticsId) return;
      const byLogistics = (query) =>
        activeLogisticsId === 'kern'
          ? query.eq('logistics_id', 'kern')
          : query.or('logistics_id.eq.hera,logistics_id.is.null');

      const { data: stockData } = await byLogistics(
        supabase
          .from('warehouse_stocks')
          .select('*')
          .order('created_at', { ascending: activeLogisticsId === 'kern' })
      );

      if (stockData) {
        const mapped = stockData.map(s => ({
          id: s.id,
          logisticsId: s.logistics_id || activeLogisticsId,
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
          subUom: s.sub_uom || '',
          weightKg: Number(s.weight_kg) || 0,
          tagClass: 'tag-blue'
        }));
        const sortByGrn = (list) =>
          [...list].sort((a, b) => (a.grnNo || '').localeCompare(b.grnNo || ''));

        if (activeLogisticsId === 'kern' && mapped.length === 0) {
          setStocks(sortByGrn(KERN_INITIAL_STOCKS));
        } else {
          setStocks(sortByGrn(mapped));
        }
      }

      const { data: challanData } = await byLogistics(
        supabase
          .from('delivery_notes')
          .select('*, delivery_note_items(*)')
          .order('created_at', { ascending: false })
      );

      if (challanData) {
        const isKern = activeLogisticsId === 'kern';
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
              grnNo: i.grn_no || (isKern ? '—' : 'GRN/0001345/26-27'),
              brand: i.brand || (isKern ? '—' : 'Sun Enterprises'),
              product: i.product || (isKern ? 'Fruits' : 'Raw Cashew Nuts'),
              variety: i.variety || (isKern ? (i.product || '—') : 'RAW-CASHEW'),
              lotNo: i.lot_no || (isKern ? '—' : 'LOT-CASHEW'),
              count: i.count || (isKern ? '—' : '50KG BAGS'),
              whLocation: i.wh_location || (isKern ? 'COLD-HUB' : 'SIP-B02'),
              selectedQty: Number(i.dispatched_qty) || Number(c.total_qty),
              unit: i.unit || (isKern ? 'BOX' : 'BAGS'),
              rateType: i.rate_type || (isKern ? 'Weekly' : 'Daily')
            }))
            : [{
              grnNo: isKern ? '—' : 'GRN/0001345/26-27',
              brand: isKern ? '—' : 'Sun Enterprises',
              product: isKern ? 'Fruits' : 'Raw Cashew Nuts',
              variety: isKern ? '—' : 'RAW-CASHEW',
              lotNo: isKern ? '—' : 'LOT-CASHEW',
              count: isKern ? '—' : '50KG BAGS',
              whLocation: isKern ? 'COLD-HUB' : 'SIP-B02',
              selectedQty: Number(c.total_qty),
              unit: isKern ? 'BOX' : 'BAGS',
              rateType: isKern ? 'Weekly' : 'Daily'
            }]
        }));
        setChallanHistory(mappedChallans);
      }

      const { data: inwardData } = await byLogistics(
        supabase
          .from('inward_requests')
          .select('*')
          .order('created_at', { ascending: false })
      );

      if (inwardData) {
        const isKern = activeLogisticsId === 'kern';
        const mappedInwards = inwardData.map(r => ({
          id: r.id,
          inwardNo: r.inward_no,
          clientName: r.client_name,
          product: r.product,
          category: r.category || (isKern ? 'Cold Storage' : 'General'),
          brand: r.brand || (isKern ? '' : 'CAJ'),
          variety: r.variety || (isKern ? '' : 'STANDARD'),
          qty: Number(r.qty),
          unit: r.unit || (isKern ? 'BOX' : 'BAGS'),
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
    const initialUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
    if (initialUser?.logisticsId) {
      loadSupabaseData(initialUser.logisticsId);
    }

    const reloadForActiveUser = () => {
      const u = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
      if (u?.logisticsId) loadSupabaseData(u.logisticsId);
    };

    // Supabase Realtime Subscription Channel
    const channel = supabase
      .channel('hera-realtime-db-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'warehouse_stocks' }, reloadForActiveUser)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inward_requests' }, reloadForActiveUser)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'delivery_notes' }, reloadForActiveUser)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fetch when delivery note modal opens or report tab opens
  useEffect(() => {
    if (currentUser?.logisticsId && (showCustomerChallanModal || activeTab === 'clientInwardReport' || activeTab === 'adminInwardReport')) {
      loadSupabaseData(currentUser.logisticsId);
    }
  }, [showCustomerChallanModal, activeTab, reportSubTab, currentUser?.logisticsId]);

  // Reload live Supabase data whenever active logistics switches ('hera' <-> 'kern')
  useEffect(() => {
    if (currentUser?.logisticsId) {
      loadSupabaseData(currentUser.logisticsId);
    }
  }, [currentUser?.logisticsId]);

  // Synchronize localStorage (scoped per logistics, only when logged in)
  useEffect(() => {
    if (!currentUser?.logisticsId) return;
    const key = currentUser.logisticsId === 'kern' ? 'kern_stocks' : 'hera_stocks';
    localStorage.setItem(key, JSON.stringify(stocks));
  }, [stocks, currentUser?.logisticsId]);

  useEffect(() => {
    if (!currentUser?.logisticsId) return;
    const key = currentUser.logisticsId === 'kern' ? 'kern_challans' : 'hera_challans';
    localStorage.setItem(key, JSON.stringify(challanHistory));
  }, [challanHistory, currentUser?.logisticsId]);

  useEffect(() => {
    if (!currentUser?.logisticsId) return;
    const key = currentUser.logisticsId === 'kern' ? 'kern_inward_requests' : 'hera_inward_requests';
    localStorage.setItem(key, JSON.stringify(inwardRequests));
  }, [inwardRequests, currentUser?.logisticsId]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('hera_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('hera_current_user');
    }
  }, [currentUser]);

  // Fetch profiles for Admin PIN management (scoped to active logistics)
  const loadSupabaseProfiles = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem('hera_current_user') || 'null');
      const activeId = savedUser?.logisticsId || 'hera';
      const query = supabase.from('profiles').select('*').order('created_at', { ascending: false });
      const { data } = activeId === 'kern'
        ? await query.eq('logistics_id', 'kern')
        : await query.or('logistics_id.eq.hera,logistics_id.is.null');
      if (data) setDbProfiles(data);
    } catch (err) {
      console.warn('Profiles load error:', err);
    }
  };

  // Update profile 6-digit PIN in Supabase from Admin Desk
  const handleUpdateProfilePin = async (profileId, newPin) => {
    if (!newPin || newPin.length !== 6) {
      alert('PIN must be exactly 6 numeric digits.');
      return;
    }
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ pin: newPin })
        .eq('id', profileId);

      if (error) throw error;
      setPinUpdateStatus('✅ 6-digit PIN updated successfully in Supabase!');
      setEditingPinUser(null);
      setNewPinValue('');
      loadSupabaseProfiles();
      setTimeout(() => setPinUpdateStatus(''), 3500);
    } catch (err) {
      console.error('PIN update error:', err);
      alert('Failed to update PIN: ' + err.message);
    }
  };

  // 1. GATEWAY LOGIN & REGISTER HANDLER (Mobile Number + 6-Digit PIN with Toast & Validation)
  const handleGatewayAuthSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    if (gatewayTab === 'login') {
      const cleanInput = phoneInput.trim();
      const cleanPin = pinInput.trim();
      const digits = cleanInput.replace(/\D/g, '');
      const isEmail = cleanInput.includes('@');

      // Validation
      if (!cleanInput) {
        showToast('Please enter your Mobile Number.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      if (!isEmail && digits.length !== 10) {
        showToast('Please enter a valid 10-digit Mobile Number.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      if (!cleanPin) {
        showToast('Please enter your 6-digit Security PIN.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      if (cleanPin.length !== 6) {
        showToast('Security PIN must be exactly 6 digits.', 'warning');
        setIsLoggingIn(false);
        return;
      }

      try {
        // Query Supabase profiles table filtered by selected logistics ('hera' | 'kern')
        const { data: matchedProfiles, error: fetchErr } = await supabase
          .from('profiles')
          .select('*');

        let foundUser = null;
        if (matchedProfiles && matchedProfiles.length > 0) {
          foundUser = matchedProfiles.find(p => {
            const profileLogistics = (p.logistics_id || 'hera').toLowerCase();
            if (profileLogistics !== selectedLogistics) return false;
            const pPhone = (p.phone || '').replace(/\D/g, '');
            const phoneMatch = digits.length >= 6 && pPhone && (pPhone === digits || pPhone.endsWith(digits) || digits.endsWith(pPhone));
            const emailMatch = p.email && p.email.toLowerCase() === cleanInput.toLowerCase();
            return phoneMatch || emailMatch;
          });
        }

        // Offline/fallback for Kern client if not yet fetched
        if (!foundUser && selectedLogistics === 'kern' && digits === '9585543555') {
          if (cleanPin !== '121312') {
            showToast('Incorrect 6-digit PIN for Kern Logistics. Please verify and try again.', 'error');
            setIsLoggingIn(false);
            return;
          }
          const kernSession = {
            id: 'kern-client-lords',
            logisticsId: 'kern',
            name: 'Mr. Chidambaram',
            role: 'client',
            email: 'kern.client@lordskings.com',
            phone: '9585543555',
            company: 'LORDS AND KINGS ENTERPRISES',
            address: 'T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92'
          };
          localStorage.setItem('hera_current_user', JSON.stringify(kernSession));
          setStocks([]);
          setChallanHistory([]);
          setInwardRequests([]);
          showToast('Welcome to Kern Logistics!', 'success');
          setCurrentUser(kernSession);
          setActiveTab('clientInventory');
          setPhoneInput('');
          setPinInput('');
          setIsLoggingIn(false);
          return;
        }

        if (foundUser) {
          const userPin = (foundUser.pin || '123456').toString().trim();
          if (cleanPin !== userPin) {
            showToast('Incorrect 6-digit PIN. Please verify and try again.', 'error');
            setIsLoggingIn(false);
            return;
          }

          const logisticsCfg = getLogisticsConfig(selectedLogistics);
          const userSession = {
            id: foundUser.id,
            logisticsId: selectedLogistics,
            name: foundUser.contact_person || (foundUser.role === 'admin' ? `${logisticsCfg.label} Admin` : 'Mr. Chidambaram'),
            role: foundUser.role || 'client',
            email: foundUser.email || '',
            phone: foundUser.phone || cleanInput,
            company: foundUser.company_name || foundUser.company || (foundUser.role === 'admin' ? logisticsCfg.legalName : 'LORDS AND KINGS ENTERPRISES'),
            address: foundUser.address || (foundUser.role === 'admin' ? logisticsCfg.hubLabel : 'T/F82, ANNA FRUIT MARKET, KOYAMBEDU, CHENNAI - 92')
          };

          localStorage.setItem('hera_current_user', JSON.stringify(userSession));
          setStocks([]);
          setChallanHistory([]);
          setInwardRequests([]);
          showToast('Login successful', 'success');
          setCurrentUser(userSession);
          setActiveTab(userSession.role === 'admin' ? 'adminOverview' : 'clientInventory');
          setPhoneInput('');
          setPinInput('');
          setIsLoggingIn(false);
          return;
        }

        // If no matching user profile found in database
        showToast('No account found with this Mobile Number.', 'error');
        setIsLoggingIn(false);
        return;
      } catch (err) {
        console.error('Login error:', err);
        showToast('Authentication error. Please try again.', 'error');
        setIsLoggingIn(false);
      }
    } else {
      // Register New Merchant Client
      if (!regName.trim()) {
        showToast('Please enter Contact Person name.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      if (!regCompany.trim()) {
        showToast('Please enter Company Name.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      const regDigits = regPhone.replace(/\D/g, '');
      if (regDigits.length !== 10) {
        showToast('Please enter a valid 10-digit mobile number.', 'warning');
        setIsLoggingIn(false);
        return;
      }
      if (!pinInput.trim() || pinInput.trim().length !== 6) {
        showToast('Please create a 6-digit security PIN.', 'warning');
        setIsLoggingIn(false);
        return;
      }

      try {
        const regLogistics = getLogisticsConfig(selectedLogistics);
        const clientEmail = regEmail.trim() || `${regDigits}@${selectedLogistics === 'kern' ? 'kernlogistics' : 'heralogistics'}.com`;
        const { data, error } = await supabase.from('profiles').insert([{
          phone: regPhone.trim(),
          email: clientEmail,
          pin: pinInput.trim(),
          role: 'client',
          company_name: regCompany.trim(),
          logistics_id: selectedLogistics
        }]).select();

        const newSession = {
          id: (data && data[0]?.id) || 'client-' + Date.now(),
          logisticsId: selectedLogistics,
          name: regName.trim(),
          role: 'client',
          email: clientEmail,
          phone: regPhone.trim(),
          company: regCompany.trim(),
          address: regLogistics.hubLabel
        };

        localStorage.setItem('hera_current_user', JSON.stringify(newSession));
        setStocks([]);
        setChallanHistory([]);
        setInwardRequests([]);
        showToast('Account registered successfully!', 'success');
        setCurrentUser(newSession);
        setActiveTab('clientInventory');
        setPhoneInput('');
        setPinInput('');
        setRegName('');
        setRegCompany('');
        setRegPhone('');
        setRegEmail('');
        setIsLoggingIn(false);
      } catch (err) {
        console.error('Registration error:', err);
        showToast('Error creating account in Supabase.', 'error');
        setIsLoggingIn(false);
      }
    }
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
        // Fallback to primary Stock screen for client
        const homeTab = currentUser.role === 'admin' ? 'adminOverview' : 'clientInventory';
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
    setStocks([]);
    setChallanHistory([]);
    setInwardRequests([]);
    setCart([]);
    setCartStep('review');
  };

  // Inward Cargo Management (Add/Edit/Delete)
  const handleOpenAddInward = () => {
    setEditingStockId(null);
    const isKern = activeLogistics.id === 'kern';
    setInwardForm({
      product: '',
      clientName: isKern ? 'LORDS AND KINGS ENTERPRISES' : 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.',
      category: isKern ? 'Cold Storage' : 'Dry Goods',
      docNo: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
      grnNo: 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27',
      inDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      whLocation: isKern ? 'COLD-A1' : 'SIP-A1',
      brand: isKern ? 'PREMIUM APPLE' : 'HERA-STORED',
      variety: 'STANDARD',
      lotNo: 'LOT-' + Math.floor(1000 + Math.random() * 9000),
      count: isKern ? '' : '50KG BAGS',
      subUom: '',
      rateType: isKern ? 'Weekly' : 'Daily',
      qty: '',
      unit: isKern ? 'BOX' : 'BAGS',
      weightKg: ''
    });
    setShowInwardModal(true);
  };

  const handleOpenEditInward = (item) => {
    setEditingStockId(item.id);
    setInwardForm({
      ...item,
      inDate: item.inDate || '',
      subUom: item.subUom || '',
      rateType: item.rateType || 'Daily',
      qty: String(item.qty),
      weightKg: String(item.weightKg || '')
    });
    setShowInwardModal(true);
  };

  const handleDeleteStock = async (id) => {
    if (window.confirm('Are you sure you want to remove this consignment record from warehouse stock?')) {
      setStocks(stocks.filter(s => s.id !== id));
      try {
        await supabase.from('warehouse_stocks').delete().eq('id', id);
        showToast('Stock record deleted.', 'success');
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
          client_name: inwardForm.clientName,
          doc_no: inwardForm.docNo,
          grn_no: inwardForm.grnNo,
          in_date: inwardForm.inDate,
          product: inwardForm.product,
          category: inwardForm.category,
          brand: inwardForm.brand,
          variety: inwardForm.variety,
          wh_location: inwardForm.whLocation,
          lot_no: inwardForm.lotNo,
          count: inwardForm.count,
          sub_uom: inwardForm.subUom || '',
          rate_type: inwardForm.rateType,
          qty: qtyNum,
          unit: inwardForm.unit,
          weight_kg: weightNum,
          updated_at: new Date().toISOString()
        }).eq('id', editingStockId);
        showToast('Stock record updated!', 'success');
      } catch (err) {
        console.warn('Supabase update notice:', err);
      }
    } else {
      const newItem = {
        id: Date.now(),
        logisticsId: activeLogistics.id,
        docNo: inwardForm.docNo || 'DOC-' + Math.floor(100000 + Math.random() * 900000),
        grnNo: inwardForm.grnNo || 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27',
        inDate: inwardForm.inDate || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
        clientName: inwardForm.clientName || 'REGISTERED MERCHANT',
        product: inwardForm.product,
        category: inwardForm.category,
        brand: inwardForm.brand || 'HERA-STORED',
        variety: inwardForm.variety || 'STANDARD',
        whLocation: inwardForm.whLocation || 'SIP-A1',
        lotNo: inwardForm.lotNo || 'LOT-' + Math.floor(1000 + Math.random() * 9000),
        count: inwardForm.count || (inwardForm.unit === 'BAGS' ? '50KG BAGS' : 'STANDARD'),
        subUom: inwardForm.subUom || '',
        rateType: inwardForm.rateType || 'Daily',
        qty: qtyNum,
        unit: inwardForm.unit,
        weightKg: weightNum,
        tagClass: 'tag-blue'
      };
      setStocks([newItem, ...stocks]);

      try {
        const { error: addErr } = await supabase.from('warehouse_stocks').insert([{
          logistics_id: activeLogistics.id,
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
          sub_uom: newItem.subUom || '',
          rate_type: newItem.rateType,
          qty: newItem.qty,
          unit: newItem.unit,
          weight_kg: newItem.weightKg
        }]);
        if (!addErr) {
          await loadSupabaseData(activeLogistics.id);
        }
        showToast('New stock record added!', 'success');
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
    const formattedDate = dcDateInput || now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
    const dcNumber = 'DC/' + String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0').slice(0, 7) + '/26-27';
    const gateInNo = gateInNoInput || ('GPV/' + String(Math.floor(1000000 + Math.random() * 9000000)).padStart(7, '0').slice(0, 7) + '/26-27');

    const totalQty = cart.reduce((sum, item) => sum + (item.selectedQty || 0), 0);

    const challanObj = {
      id: Date.now(),
      dcNo: dcNumber,
      dcDate: formattedDate,
      customerName: customerName,
      address: customerAddress,
      fromCompany: fromCompany,
      fromAddress: fromAddress,
      contactPerson: contactPerson,
      contactNo: contactPhone,
      destination: destination,
      preparedBy: fromCompany || preparedBy,
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
        logistics_id: activeLogistics.id,
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

  // Bulk / Multi-row Add Products directly into warehouse_stocks (Excel fields)
  const handleBulkAddProducts = async (productRows) => {
    const clientCompany = currentUser?.company || currentUser?.name || 'LORDS AND KINGS ENTERPRISES';
    const defaultBay = activeLogistics.id === 'kern' ? 'COLD-A1' : 'SIP-A1';
    const defaultCategory = activeLogistics.id === 'kern' ? 'Cold Storage' : 'Dry Goods';

    const newStockItems = productRows.map((row, idx) => {
      const qtyNum = parseFloat(row.qty) || 0;
      const weightNum = row.unit === 'BAGS' ? qtyNum * 50 : qtyNum * 20;
      return {
        id: Date.now() + idx,
        logisticsId: activeLogistics.id,
        docNo: '',
        grnNo: row.grnNo,
        inDate: row.inDate,
        clientName: clientCompany,
        product: row.product,
        category: defaultCategory,
        brand: row.brand || '',
        variety: row.variety || '',
        whLocation: defaultBay,
        lotNo: row.lotNo || '',
        count: row.subUom || (row.unit === 'BAGS' ? '50KG BAGS' : '-'),
        rateType: row.rateType || (activeLogistics.id === 'kern' ? 'Weekly' : 'Daily'),
        qty: qtyNum,
        unit: row.unit || 'BOX',
        subUom: row.subUom || '',
        weightKg: weightNum,
        tagClass: 'tag-blue'
      };
    });

    setStocks(prev => [...prev, ...newStockItems]);

    try {
      const dbPayload = newStockItems.map(item => ({
        logistics_id: activeLogistics.id,
        client_name: item.clientName,
        doc_no: '',
        grn_no: item.grnNo,
        in_date: item.inDate,
        product: item.product,
        category: item.category,
        brand: item.brand,
        variety: item.variety,
        wh_location: item.whLocation,
        lot_no: item.lotNo,
        count: item.count,
        sub_uom: item.subUom,
        rate_type: item.rateType,
        qty: item.qty,
        unit: item.unit,
        weight_kg: item.weightKg
      }));
      const { error: insertErr } = await supabase.from('warehouse_stocks').insert(dbPayload);
      if (!insertErr) {
        await loadSupabaseData(activeLogistics.id);
      }
      showToast(`Added ${newStockItems.length} product(s) to stock!`, 'success');
      navigateToTab('clientInventory');
    } catch (err) {
      console.warn('Supabase bulk insert notice:', err);
      showToast(`Added ${newStockItems.length} product(s) locally.`, 'success');
      navigateToTab('clientInventory');
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
    const grnNumber = 'GRN/000' + Math.floor(1000 + Math.random() * 9000) + '/26-27';
    const defaultBay = activeLogistics.id === 'kern' ? 'COLD-A1' : 'SIP-A1';

    const newReq = {
      id: Date.now(),
      inwardNo: inwardNo,
      grnNo: grnNumber,
      whLocation: defaultBay,
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
      status: 'ACCEPTED',
      createdAt: formattedDate
    };

    const newStockItem = {
      id: Date.now() + 1,
      logisticsId: activeLogistics.id,
      docNo: newReq.docNo,
      grnNo: grnNumber,
      inDate: formattedDate,
      clientName: newReq.clientName,
      product: newReq.product,
      category: newReq.category,
      brand: newReq.brand,
      variety: newReq.variety,
      whLocation: defaultBay,
      lotNo: 'LOT-' + Math.floor(10000 + Math.random() * 90000),
      count: newReq.unit === 'BAGS' ? '50KG BAGS' : 'STANDARD',
      rateType: activeLogistics.id === 'kern' ? 'Weekly' : 'Daily',
      qty: qtyNum,
      unit: newReq.unit,
      subUom: '',
      weightKg: weightNum,
      tagClass: 'tag-blue'
    };

    setStocks(prev => [newStockItem, ...prev]);
    setInwardRequests(prev => [newReq, ...prev]);
    setIssuedInwardReceipt(newReq);
    showToast('Goods recorded in stock!', 'success');

    // Reset form
    setClientInwardForm({
      product: '',
      category: activeLogistics.id === 'kern' ? 'Cold Storage' : 'Cashew',
      brand: 'CAJ',
      variety: 'GRADE-A',
      qty: '',
      unit: activeLogistics.id === 'kern' ? 'BOX' : 'BAGS',
      weightKg: '',
      vehicleNo: '',
      driverPhone: '',
      expectedDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      docNo: '',
      remarks: ''
    });

    try {
      await supabase.from('warehouse_stocks').insert([{
        logistics_id: activeLogistics.id,
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
        sub_uom: '',
        rate_type: newStockItem.rateType,
        qty: newStockItem.qty,
        unit: newStockItem.unit,
        weight_kg: newStockItem.weightKg
      }]);

      await supabase.from('inward_requests').insert([{
        logistics_id: activeLogistics.id,
        inward_no: newReq.inwardNo,
        grn_no: grnNumber,
        wh_location: defaultBay,
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
        status: 'ACCEPTED'
      }]);
    } catch (err) {
      console.warn('Supabase inward request sync notice:', err);
    }
  };

  // Admin Inward Acceptance
  const handleOpenAcceptModal = (req) => {
    setAcceptingRequest(req);
    const prefix = activeLogistics.id === 'kern' ? 'COLD-A' : 'SIP-B';
    setAcceptBay(prefix + Math.floor(1 + Math.random() * 9));
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
      logisticsId: activeLogistics.id,
      docNo: acceptingRequest.docNo,
      grnNo: grnNumber,
      inDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-'),
      clientName: acceptingRequest.clientName,
      product: acceptingRequest.product,
      category: acceptingRequest.category,
      brand: acceptingRequest.brand,
      variety: acceptingRequest.variety,
      whLocation: acceptBay,
      lotNo: 'LOT-' + Math.floor(10000 + Math.random() * 90000),
      count: acceptingRequest.unit === 'BAGS' ? '50KG BAGS' : 'STANDARD',
      rateType: activeLogistics.id === 'kern' ? 'Weekly' : 'Daily',
      qty: acceptedQty,
      unit: acceptingRequest.unit,
      subUom: '',
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
        logistics_id: activeLogistics.id,
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

  // Admin Edit Delivery Note Handlers
  const handleOpenEditDeliveryNote = (dc) => {
    setEditingDeliveryNote(dc);
    setEditDcForm({
      dcNo: dc.dcNo || '',
      dcDate: dc.dcDate || '',
      customerName: dc.customerName || '',
      address: dc.address || '',
      contactPerson: dc.contactPerson || '',
      contactNo: dc.contactNo || '',
      destination: dc.destination || '',
      vehicleNo: dc.vehicleNo || '',
      gateInNo: dc.gateInNo || '',
      preparedBy: dc.preparedBy || 'ADMIN',
      totalQty: String(dc.totalQty || '')
    });
  };

  const handleSaveEditDeliveryNote = async (e) => {
    e.preventDefault();
    if (!editingDeliveryNote) return;
    setIsSavingDc(true);

    const updatedDc = {
      ...editingDeliveryNote,
      dcNo: editDcForm.dcNo.trim(),
      dcDate: editDcForm.dcDate.trim(),
      customerName: editDcForm.customerName.trim(),
      address: editDcForm.address.trim(),
      contactPerson: editDcForm.contactPerson.trim(),
      contactNo: editDcForm.contactNo.trim(),
      destination: editDcForm.destination.trim(),
      vehicleNo: editDcForm.vehicleNo.trim().toUpperCase(),
      gateInNo: editDcForm.gateInNo.trim(),
      preparedBy: editDcForm.preparedBy.trim(),
      totalQty: parseFloat(editDcForm.totalQty) || editingDeliveryNote.totalQty
    };

    // 1. Update state
    setChallanHistory(prev => prev.map(c => c.id === editingDeliveryNote.id ? updatedDc : c));
    if (issuedChallan && issuedChallan.id === editingDeliveryNote.id) {
      setIssuedChallan(updatedDc);
    }

    // 2. Update Supabase table delivery_notes if valid uuid
    try {
      if (typeof editingDeliveryNote.id === 'string' && editingDeliveryNote.id.length > 10) {
        await supabase
          .from('delivery_notes')
          .update({
            dc_no: updatedDc.dcNo,
            dc_date: updatedDc.dcDate,
            customer_name: updatedDc.customerName,
            address: updatedDc.address,
            contact_person: updatedDc.contactPerson,
            contact_no: updatedDc.contactNo,
            destination: updatedDc.destination,
            vehicle_no: updatedDc.vehicleNo,
            gate_in_no: updatedDc.gateInNo,
            prepared_by: updatedDc.preparedBy,
            total_qty: updatedDc.totalQty
          })
          .eq('id', editingDeliveryNote.id);
      }
      showToast('Delivery Note updated successfully!', 'success');
    } catch (err) {
      console.warn('Supabase delivery note update notice:', err);
      showToast('Delivery Note updated!', 'success');
    } finally {
      setIsSavingDc(false);
      setEditingDeliveryNote(null);
    }
  };

  const handleDownloadPdf = () => {
    const element = document.getElementById('challan-doc-sheet');
    if (!element) return;
    setIsDownloading(true);

    const filename = `${activeLogistics.pdfPrefix}_${activeChallanTab === 'delivery' ? 'Delivery_Challan' : 'Inward_GRN'}_${issuedChallan?.dcNo.replace(/[/\\s]/g, '_')}.pdf`;

    const frame = element.querySelector('.challan-template-frame');
    const tableContainer = element.querySelector('.challan-table-container');
    const prevFrameMinHeight = frame ? frame.style.minHeight : '';
    const prevTableMinHeight = tableContainer ? tableContainer.style.minHeight : '';

    if (frame) frame.style.minHeight = '215mm';
    if (tableContainer) tableContainer.style.minHeight = '125mm';

    const opt = {
      margin: [10, 10, 15, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (frame) frame.style.minHeight = prevFrameMinHeight;
      if (tableContainer) tableContainer.style.minHeight = prevTableMinHeight;
      setIsDownloading(false);
    }).catch(() => {
      if (frame) frame.style.minHeight = prevFrameMinHeight;
      if (tableContainer) tableContainer.style.minHeight = prevTableMinHeight;
      setIsDownloading(false);
    });
  };

  const handleDownloadInwardAdvicePdf = () => {
    const element = document.getElementById('inward-advice-sheet');
    if (!element) return;
    setIsDownloading(true);

    const filename = `${activeLogistics.pdfPrefix}_Inward_Advice_${issuedInwardReceipt?.inwardNo.replace(/[/\\s]/g, '_')}.pdf`;

    const frame = element.querySelector('.challan-template-frame');
    const tableContainer = element.querySelector('.challan-table-container');
    const prevFrameMinHeight = frame ? frame.style.minHeight : '';
    const prevTableMinHeight = tableContainer ? tableContainer.style.minHeight : '';

    if (frame) frame.style.minHeight = '215mm';
    if (tableContainer) tableContainer.style.minHeight = '125mm';

    const opt = {
      margin: [10, 10, 15, 10],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff', scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      if (frame) frame.style.minHeight = prevFrameMinHeight;
      if (tableContainer) tableContainer.style.minHeight = prevTableMinHeight;
      setIsDownloading(false);
    }).catch(() => {
      if (frame) frame.style.minHeight = prevFrameMinHeight;
      if (tableContainer) tableContainer.style.minHeight = prevTableMinHeight;
      setIsDownloading(false);
    });
  };

  const handleDownloadStockReportPdf = () => {
    const element = document.getElementById('monthly-stock-report-sheet');
    if (!element) return;
    setIsDownloading(true);

    const clientSuffix = currentUser?.role === 'admin'
      ? 'Admin_Ledger'
      : (currentUser?.company?.replace(/[^a-zA-Z0-9]/g, '_') || 'Stock_Report');
    const dateFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const filename = activeLogistics.id === 'kern'
      ? `Kern_Stock_Summary_${clientSuffix}_${dateFormatted}.pdf`
      : `Hera_Monthly_Stock_Report_${clientSuffix}_${dateFormatted}.pdf`;

    const opt = {
      margin: activeLogistics.id === 'kern' ? [6, 6, 6, 6] : [6, 6, 6, 6],
      filename: filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'] }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      setIsDownloading(false);
      setShowReportDownloadConfirm(false);
    }).catch((err) => {
      console.warn('PDF save error:', err);
      setIsDownloading(false);
      setShowReportDownloadConfirm(false);
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

  // Filter & sort stocks by GRN number (Admin & Client, Hera & Kern)
  const visibleStocks = stocks
    .filter(item => {
      // If logged in as client, only show items belonging to their company
      if (currentUser && currentUser.role === 'client') {
        if (item.clientName && !item.clientName.toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8))) {
          return false;
        }
      }
      const matchesCat = categoryFilter === 'ALL' || item.category === categoryFilter;
      const matchesSearch = searchQuery === '' ||
        (item.product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.brand || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.grnNo || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.whLocation || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.lotNo || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => (a.grnNo || '').localeCompare(b.grnNo || ''));

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
    const loginLogistics = getLogisticsConfig(selectedLogistics);
    return (
      <div className="clean-split-login">
        <div className="split-modal-container">
          {/* LEFT SIDE: WAREHOUSE HERO IMAGE */}
          <div className="login-image-side">
            <img src={heraWarehouseImg} alt={loginLogistics.label} className="login-bg-photo" />
            <div className="login-image-overlay"></div>
            <div className="login-image-content">
              <div className="login-brand-capsule">
                <img src={loginLogistics.logo} alt={`${loginLogistics.label} Logo`} className="login-brand-logo" />
              </div>
              <h1 className="login-hero-title">{loginLogistics.label}</h1>
              <p className="login-hero-subtitle">
                {selectedLogistics === 'kern' ? 'Cold & Agro Storage Portal' : 'Prime Dry Storage & Space Rental'}
              </p>
              <div className="login-hero-badge">📍 {loginLogistics.hubLabel}</div>
            </div>
          </div>

          {/* RIGHT SIDE: CLEAN FORM & 1-CLICK ROLE ENTRY */}
          <div className="login-form-side">
            <div className="login-form-wrapper">
              <div className="login-form-header">
                <h2>{gatewayTab === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
              </div>

              <form onSubmit={handleGatewayAuthSubmit} className="clean-auth-form">
                <div className="clean-input-group">
                  <label>Logistics / Warehouse <span className="req-star">*</span></label>
                  <select
                    value={selectedLogistics}
                    onChange={(e) => setSelectedLogistics(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E2E8F0',
                      fontSize: '0.95rem',
                      fontWeight: '600',
                      color: '#0F172A',
                      background: '#FFFFFF',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="hera">Hera Logistics Pvt. Ltd. (Thoothukudi)</option>
                    <option value="kern">Kern Logistics Pvt. Ltd. (Sriperumbudur)</option>
                  </select>
                </div>

                {gatewayTab === 'login' ? (
                  <>
                    <div className="clean-input-group">
                      <label>Mobile Number <span className="req-star">*</span></label>
                      <input
                        type="tel"
                        required
                        autoFocus
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>

                    <div className="clean-input-group">
                      <label>6-Digit Security PIN <span className="req-star">*</span></label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        style={{ letterSpacing: '6px', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="two-inputs-row">
                      <div className="clean-input-group">
                        <label>Contact Person <span className="req-star">*</span></label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                        />
                      </div>
                      <div className="clean-input-group">
                        <label>Company Name <span className="req-star">*</span></label>
                        <input
                          type="text"
                          required
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="clean-input-group">
                      <label>Mobile Number <span className="req-star">*</span></label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]{10}"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      />
                    </div>
                    <div className="clean-input-group">
                      <label>Set 6-Digit PIN <span className="req-star">*</span></label>
                      <input
                        type="password"
                        required
                        maxLength={6}
                        inputMode="numeric"
                        pattern="[0-9]{6}"
                        style={{ letterSpacing: '6px', fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' }}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      />
                    </div>
                  </>
                )}

                <button type="submit" className="btn-clean-login" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Verifying PIN...' : (gatewayTab === 'login' ? 'Login with PIN' : 'Create Account')}
                </button>
              </form>

              <div className="login-footer-links">
                {gatewayTab === 'login' ? (
                  <p>
                    Don't have an account?{' '}
                    <button type="button" className="link-switch-auth" onClick={() => setGatewayTab('register')}>
                      Create account here
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button type="button" className="link-switch-auth" onClick={() => setGatewayTab('login')}>
                      Login here
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Global Toast Notification */}
        {renderToast()}

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
            <img src={activeLogistics.logo} alt={`${activeLogistics.label} Logo`} className="header-brand-logo" />
            <div className="header-brand-divider"></div>
            <div className="header-brand-text">
              <span className="brand-name">{activeLogistics.id === 'kern' ? 'KERN ADMIN' : 'HERA ADMIN'}</span>
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
            <button
              type="button"
              className="btn-admin-manage-pins"
              onClick={() => { setShowPinModal(true); loadSupabaseProfiles(); }}
              title="View and update user PINs in Supabase"
            >
              🔑 Manage PINs
            </button>
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
                logistics={activeLogistics}
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
                            <div className="count-txt">{item.subUom || item.count || (Math.round(item.qty / 50) + ' Bags')}</div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: '#0f766e', fontSize: '0.92rem' }}>
                            {item.qty ? `${item.qty.toLocaleString()} ${item.unit || 'KG'}` : `0 ${item.unit || 'KG'}`}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                              <button
                                type="button"
                                className="row-dispatch-btn"
                                style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '6px 10px' }}
                                title="Edit Record"
                                onClick={(e) => { e.stopPropagation(); handleOpenEditInward(item); }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                className="row-dispatch-btn"
                                style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA', padding: '6px 10px' }}
                                title="Delete Record"
                                onClick={(e) => { e.stopPropagation(); handleDeleteStock(item.id); }}
                              >
                                🗑️
                              </button>
                              <button className="row-dispatch-btn" onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}>
                                Send &rarr;
                              </button>
                            </div>
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
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            type="button"
                            className="mobile-card-action-btn"
                            style={{ background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}
                            onClick={(e) => { e.stopPropagation(); handleOpenEditInward(item); }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            className="mobile-card-action-btn"
                            style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}
                            onClick={(e) => { e.stopPropagation(); handleDeleteStock(item.id); }}
                          >
                            🗑️
                          </button>
                          <button
                            className="mobile-card-action-btn"
                            onClick={(e) => { e.stopPropagation(); handleRowClick(item); }}
                          >
                            Send &rarr;
                          </button>
                        </div>
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
                                {req.brand && (
                                  <div className="brand-sub-badge">
                                    <span className="brand-pill tag-blue">{req.brand}</span>
                                  </div>
                                )}
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

        {/* TAB 4: OFFICIAL INWARD REPORT & DELIVERY HISTORY */}
        {activeTab === 'adminInwardReport' && (
          <div className="inward-report-screen tab-page-enter">
            <div className="report-container">
              <div className="report-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
                <div className="report-view-toggle">
                  <button
                    type="button"
                    className={`report-toggle-btn ${reportSubTab === 'stockReport' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('stockReport')}
                  >
                    📦 Stock View (Current Stock)
                  </button>
                  <button
                    type="button"
                    className={`report-toggle-btn ${reportSubTab === 'deliveryHistory' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('deliveryHistory')}
                  >
                    🚚 Delivery History
                  </button>
                  <button
                    type="button"
                    className={`report-toggle-btn ${reportSubTab === 'inwardHistory' ? 'active' : ''}`}
                    onClick={() => setReportSubTab('inwardHistory')}
                  >
                    📥 Inward History
                  </button>
                </div>

                {reportSubTab === 'stockReport' ? (
                  <button
                    className={`doc-download-btn ${activeLogistics.id === 'kern' ? 'kern-desktop-only-download' : ''}`}
                    onClick={() => setShowReportDownloadConfirm(true)}
                  >
                    Download PDF
                  </button>
                ) : reportSubTab === 'inwardHistory' ? (
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                    Total Inwards: <strong>{inwardRequests.length}</strong>
                  </div>
                ) : (
                  <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                    Total Dispatches: <strong>{challanHistory.length}</strong>
                  </div>
                )}
              </div>

              {reportSubTab === 'stockReport' ? (
                activeLogistics.id === 'kern' ? (
                  <KernStockSummaryReport
                    stocks={stocks}
                    logistics={activeLogistics}
                    partyName={stocks[0]?.clientName || 'LORDS AND KINGS ENTERPRISES'}
                    asOnDate={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                    onDownloadPdf={() => setShowReportDownloadConfirm(true)}
                  />
                ) : (
                <div className="official-report-sheet" id="monthly-stock-report-sheet">
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
                    STOCK REPORT: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
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
                )
              ) : reportSubTab === 'inwardHistory' ? (
                renderInwardHistoryCard()
              ) : (
                <div className="table-card dashboard-table-card" style={{ marginTop: '8px', padding: '16px 20px' }}>
                  <div className="dash-table-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>All Dispatched Delivery Notes & History</h3>
                      <p className="mobile-hide-subtext" style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748B' }}>
                        Master outbound delivery notes & warehouse gate pass history
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn-status-history-pill"
                      onClick={() => loadSupabaseData(currentUser?.logisticsId)}
                      style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                    >
                      🔄 Refresh
                    </button>
                  </div>

                  {challanHistory.length === 0 ? (
                    <div className="empty-cart-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                      <div className="empty-icon">🚚</div>
                      <h3>No Delivery History Yet</h3>
                      <p>When goods are dispatched, official delivery challans and records will appear here.</p>
                    </div>
                  ) : (
                    <div className="delivery-history-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {challanHistory.map((dc) => (
                        <div key={dc.id} className="mobile-stock-card" style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                          <div className="mobile-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <div>
                              <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>{dc.customerName || dc.destination || activeLogistics.hubLabel}</span>
                              <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginTop: '3px' }}>
                                {[
                                  dc.items?.map(i => i.product).filter(Boolean).join(', '),
                                  dc.vehicleNo ? `Lorry: ${dc.vehicleNo}` : '',
                                  dc.destination || ''
                                ].filter(Boolean).join(' • ')}
                              </div>
                            </div>
                            <span className="wh-bay-badge" style={{ fontSize: '0.82rem', padding: '4px 10px', background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0' }}>
                              {dc.totalQty?.toLocaleString()} Units
                            </span>
                          </div>

                          <div className="mobile-card-metrics" style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', margin: '10px 0', border: '1px solid #F1F5F9' }}>
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>DC NUMBER</span>
                              <span className="mobile-metric-value font-mono" style={{ fontWeight: '700', color: '#0F172A' }}>{dc.dcNo}</span>
                            </div>
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>DATE</span>
                              <span className="mobile-metric-value" style={{ fontWeight: '700', color: '#0F172A' }}>{dc.dcDate}</span>
                            </div>
                            <div className="mobile-metric-item">
                              <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>STATUS</span>
                              <span className="mobile-metric-value" style={{ color: '#0f766e', fontWeight: '900', letterSpacing: '0.3px' }}>DISPATCHED</span>
                            </div>
                          </div>

                          <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '500' }}>
                              Prepared: {dc.preparedBy || dc.customerName || 'ADMIN'}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                type="button"
                                className="row-dispatch-btn"
                                style={{ background: '#1E40AF', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); handleOpenEditDeliveryNote(dc); }}
                              >
                                ✏️ Edit
                              </button>
                              <button
                                type="button"
                                className="row-dispatch-btn"
                                style={{ background: '#0f766e', color: '#ffffff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                                onClick={() => setIssuedChallan(dc)}
                              >
                                View / Print &rarr;
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
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
                              <button
                                className="row-dispatch-btn"
                                style={{ background: '#1E40AF', marginRight: '6px' }}
                                onClick={() => handleOpenEditDeliveryNote(dc)}
                              >
                                ✏️ Edit
                              </button>
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
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="mobile-card-action-btn"
                              style={{ background: '#1E40AF' }}
                              onClick={(e) => { e.stopPropagation(); handleOpenEditDeliveryNote(dc); }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className="mobile-card-action-btn"
                              onClick={(e) => { e.stopPropagation(); setIssuedChallan(dc); }}
                            >
                              View / Print &rarr;
                            </button>
                          </div>
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
        {showPinModal && renderPinManagementModal()}
        {editingDeliveryNote && renderEditDeliveryNoteModal()}
        {showReportDownloadConfirm && renderReportDownloadConfirmModal()}

        {/* Global Toast Notification */}
        {renderToast()}

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
          <img src={activeLogistics.logo} alt={`${activeLogistics.label} Logo`} className="header-brand-logo" />
          <div className="header-brand-divider"></div>
          <div className="header-brand-text">
            <span className="brand-name">{activeLogistics.shortName}</span>
            <span className="brand-sub">Customer Portal</span>
          </div>
        </div>

        <nav className="header-nav-segmented client-nav">
          <button className={`nav-item-btn ${activeTab === 'clientInventory' ? 'active' : ''}`} onClick={() => navigateToTab('clientInventory')}>
            <span className="nav-icon">📦</span>
            <span className="nav-label-desktop">My Stored Items</span>
            <span className="nav-label-tablet">Stored Items</span>
            <span className="nav-label-mobile">Stock</span>
          </button>
          <button className={`nav-item-btn ${activeTab === 'clientSendGoods' ? 'active' : ''}`} onClick={() => navigateToTab('clientSendGoods')}>
            <span className="nav-icon">📥</span>
            <span className="nav-label-desktop">Add Products</span>
            <span className="nav-label-tablet">Add Products</span>
            <span className="nav-label-mobile">Add</span>
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

      {/* CLIENT TAB 1: MY INVENTORY */}
      {activeTab === 'clientInventory' && (
        <div className="stocks-page-screen tab-page-enter">
          <div className="stocks-container">
            <div className="dashboard-top-banner" style={{ marginBottom: '12px' }}>
              <div>
                <h1 className="page-heading">My Stored Cargo</h1>
              </div>
              <button className="btn-add-inward-top" onClick={() => navigateToTab('clientSendGoods')}>
                + Add Products
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
                            {item.brand && (
                              <div className="brand-sub-badge">
                                <span className={`brand-pill ${item.tagClass}`}>{item.brand}</span>
                              </div>
                            )}
                          </td>
                          <td>
                            <span className="wh-bay-badge">{item.whLocation}</span>
                          </td>
                          <td>
                            <div className="lot-txt">{item.lotNo}</div>
                            <div className="count-txt">{item.subUom || item.count || (Math.round(item.qty / 50) + ' Bags')}</div>
                          </td>
                          <td style={{ textAlign: 'right', fontWeight: '800', color: '#0f766e', fontSize: '0.94rem' }}>
                            {item.qty ? `${item.qty.toLocaleString()} ${item.unit || 'KG'}` : `0 ${item.unit || 'KG'}`}
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
                          {item.brand && (
                            <div className="brand-sub-badge" style={{ marginTop: '2px' }}>
                              <span className={`brand-pill ${item.tagClass}`}>{item.brand}</span>
                            </div>
                          )}
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

      {/* CLIENT TAB 2: ADD PRODUCTS (EXCEL FIELDS + BULK INSERT) */}
      {activeTab === 'clientSendGoods' && (
        <AddProductsPanel
          logisticsId={activeLogistics.id}
          onSaveBulkProducts={handleBulkAddProducts}
          onBack={() => navigateToTab('clientInventory')}
        />
      )}

      {/* CLIENT TAB 3: INWARD STOCK REPORT & DELIVERY HISTORY */}
      {activeTab === 'clientInwardReport' && (
        <div className="inward-report-screen tab-page-enter">
          <div className="report-container">
            <div className="report-toolbar" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div className="report-view-toggle">
                <button
                  type="button"
                  className={`report-toggle-btn ${reportSubTab === 'stockReport' ? 'active' : ''}`}
                  onClick={() => setReportSubTab('stockReport')}
                >
                  📦 Stock View (Current Stock)
                </button>
                <button
                  type="button"
                  className={`report-toggle-btn ${reportSubTab === 'deliveryHistory' ? 'active' : ''}`}
                  onClick={() => setReportSubTab('deliveryHistory')}
                >
                  🚚 Delivery History
                </button>
                <button
                  type="button"
                  className={`report-toggle-btn ${reportSubTab === 'inwardHistory' ? 'active' : ''}`}
                  onClick={() => setReportSubTab('inwardHistory')}
                >
                  📥 Inward History
                </button>
              </div>

              {reportSubTab === 'stockReport' ? (
                <button
                  className={`doc-download-btn ${activeLogistics.id === 'kern' ? 'kern-desktop-only-download' : ''}`}
                  onClick={() => setShowReportDownloadConfirm(true)}
                >
                  Download PDF
                </button>
              ) : reportSubTab === 'inwardHistory' ? (
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                  Total Inwards: <strong>{inwardRequests.length}</strong>
                </div>
              ) : (
                <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '600' }}>
                  Total Dispatches: <strong>{challanHistory.length}</strong>
                </div>
              )}
            </div>

            {reportSubTab === 'stockReport' ? (
              activeLogistics.id === 'kern' ? (
                <KernStockSummaryReport
                  stocks={stocks.filter(s => !currentUser.company || (s.clientName || '').toLowerCase().includes(currentUser.company.toLowerCase().slice(0, 8)))}
                  logistics={activeLogistics}
                  partyName={currentUser?.company || 'LORDS AND KINGS ENTERPRISES'}
                  asOnDate={new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')}
                  onDownloadPdf={() => setShowReportDownloadConfirm(true)}
                />
              ) : (
              <div className="official-report-sheet" id="monthly-stock-report-sheet">
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
                  STOCK REPORT: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
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
              )
            ) : reportSubTab === 'inwardHistory' ? (
              renderInwardHistoryCard()
            ) : (
              <div className="table-card dashboard-table-card" style={{ marginTop: '8px', padding: '16px 20px' }}>
                <div className="dash-table-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>My Delivery Notes & Challans</h3>
                    <p className="mobile-hide-subtext" style={{ margin: '3px 0 0', fontSize: '0.76rem', color: '#64748B' }}>
                      Issued outbound delivery notes & warehouse gate pass history
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-status-history-pill"
                    onClick={() => loadSupabaseData(currentUser?.logisticsId)}
                    style={{ padding: '5px 12px', fontSize: '0.76rem' }}
                  >
                    🔄 Refresh
                  </button>
                </div>

                {challanHistory.length === 0 ? (
                  <div className="empty-cart-card" style={{ padding: '36px 20px', textAlign: 'center' }}>
                    <div className="empty-icon">🚚</div>
                    <h3>No Delivery History Yet</h3>
                    <p className="mobile-hide-subtext">When goods are dispatched, your official delivery notes will appear here.</p>
                  </div>
                ) : (
                  <div className="delivery-history-cards-grid" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {challanHistory.map((dc) => (
                      <div key={dc.id} className="mobile-stock-card" style={{ border: '1px solid #E2E8F0', borderRadius: '14px', padding: '16px', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                        <div className="mobile-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                          <div>
                            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0F172A' }}>{dc.customerName || dc.destination || activeLogistics.hubLabel}</span>
                            <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#334155', marginTop: '3px' }}>
                              {[
                                dc.items?.map(i => i.product).filter(Boolean).join(', '),
                                dc.vehicleNo ? `Lorry: ${dc.vehicleNo}` : '',
                                dc.destination || ''
                              ].filter(Boolean).join(' • ')}
                            </div>
                          </div>
                          <span className="wh-bay-badge" style={{ fontSize: '0.82rem', padding: '4px 10px', background: '#F8FAFC', color: '#0F172A', border: '1px solid #E2E8F0' }}>
                            {dc.totalQty?.toLocaleString()} Units
                          </span>
                        </div>

                        <div className="mobile-card-metrics" style={{ background: '#F8FAFC', padding: '10px 14px', borderRadius: '10px', margin: '10px 0', border: '1px solid #F1F5F9' }}>
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>DC NUMBER</span>
                            <span className="mobile-metric-value font-mono" style={{ fontWeight: '700', color: '#0F172A' }}>{dc.dcNo}</span>
                          </div>
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>DATE</span>
                            <span className="mobile-metric-value" style={{ fontWeight: '700', color: '#0F172A' }}>{dc.dcDate}</span>
                          </div>
                          <div className="mobile-metric-item">
                            <span className="mobile-metric-label" style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '700' }}>STATUS</span>
                            <span className="mobile-metric-value" style={{ color: '#0f766e', fontWeight: '900', letterSpacing: '0.3px' }}>DISPATCHED</span>
                          </div>
                        </div>

                        <div className="mobile-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', paddingTop: '8px' }}>
                          <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '500' }}>
                            Prepared: {dc.preparedBy || dc.customerName || 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.'}
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {currentUser?.role === 'admin' && (
                              <button
                                type="button"
                                className="row-dispatch-btn"
                                style={{ background: '#1E40AF', color: '#ffffff', border: 'none', padding: '7px 14px', borderRadius: '8px', fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer' }}
                                onClick={(e) => { e.stopPropagation(); handleOpenEditDeliveryNote(dc); }}
                              >
                                ✏️ Edit
                              </button>
                            )}
                            <button
                              type="button"
                              className="row-dispatch-btn"
                              style={{ background: '#0f766e', color: '#ffffff', border: 'none', padding: '7px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                              onClick={() => setIssuedChallan(dc)}
                            >
                              View / Print &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CLIENT TAB 4: DELIVERY CART & CHECKOUT */}
      {activeTab === 'cart' && (
        <div className="cart-page-screen tab-page-enter">
          <div className="cart-container">
            {cart.length === 0 ? (
              <div className="empty-cart-card">
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
                        {/* FROM SECTION */}
                        <div className="form-group">
                          <label>From (Consignor / Company) <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. M/S. LORDS AND KINGS ENTERPRISES PVT.LTD."
                            value={fromCompany}
                            onChange={(e) => setFromCompany(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>From Address</label>
                          <input
                            type="text"
                            placeholder="e.g. #328, 2nd floor, Ten Square Mall, Koyambedu, Chennai-600107"
                            value={fromAddress}
                            onChange={(e) => setFromAddress(e.target.value)}
                          />
                        </div>

                        {/* TO SECTION */}
                        <div className="form-group">
                          <label>To (Consignee / Customer Name) <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. GLOBAL ENTERPRISES"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Destination City / Hub <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. CHENNAI"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>Delivery Destination Address</label>
                          <input
                            type="text"
                            placeholder="e.g. Jeevarathinam St, St, 3rd Street, Ksr Nagar, Chennai"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                          />
                        </div>

                        {/* TRANSPORT & LOGISTICS */}
                        <div className="form-group">
                          <label>Lorry / Vehicle Number <span className="req">*</span></label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. TN30BR8670"
                            value={transport}
                            onChange={(e) => setTransport(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Gate-In Pass NO (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. GPV/1193322/26-27 (Auto-generated if blank)"
                            value={gateInNoInput}
                            onChange={(e) => setGateInNoInput(e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Contact Person & Phone</label>
                          <div className="two-inputs-row">
                            <input
                              type="text"
                              placeholder="Contact Name"
                              value={contactPerson}
                              onChange={(e) => setContactPerson(e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Phone Number"
                              value={contactPhone}
                              onChange={(e) => setContactPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Dispatch Date</label>
                          <input
                            type="text"
                            placeholder="e.g. 02-Jul-2026"
                            value={dcDateInput}
                            onChange={(e) => setDcDateInput(e.target.value)}
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
      {showReportDownloadConfirm && renderReportDownloadConfirmModal()}
      {editingDeliveryNote && renderEditDeliveryNoteModal()}

      {/* Global Toast Notification */}
      {renderToast()}

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
            {editingStockId ? `Update ${activeLogistics.label} stock record` : `Add incoming items to ${activeLogistics.label}`}
          </p>

          <form onSubmit={handleSaveInwardSubmit} className="inward-entry-form">
            <div className="form-grid-two">
              <div className="form-group">
                <label>Item Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rice, Grains, Poland Gala"
                  value={inwardForm.product}
                  onChange={(e) => setInwardForm({ ...inwardForm, product: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Customer Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LORDS AND KINGS ENTERPRISES"
                  value={inwardForm.clientName}
                  onChange={(e) => setInwardForm({ ...inwardForm, clientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>GRN Number</label>
                <input
                  type="text"
                  placeholder="e.g. GRN/0002179/26-27"
                  value={inwardForm.grnNo || ''}
                  onChange={(e) => setInwardForm({ ...inwardForm, grnNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Inward Date</label>
                <input
                  type="text"
                  placeholder="e.g. 24-Oct-2026"
                  value={inwardForm.inDate || ''}
                  onChange={(e) => setInwardForm({ ...inwardForm, inDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  value={inwardForm.category}
                  onChange={(e) => setInwardForm({ ...inwardForm, category: e.target.value })}
                >
                  <option value="Dry Goods">Dry Goods / Commodities</option>
                  <option value="Cold Storage">Cold Storage / Perishables</option>
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
                <label>Warehouse Bay (e.g. COLD-A1 / SIP-C14)</label>
                <input
                  type="text"
                  placeholder="e.g. COLD-A1, SIP-C14"
                  value={inwardForm.whLocation}
                  onChange={(e) => setInwardForm({ ...inwardForm, whLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Brand / Maker</label>
                <input
                  type="text"
                  placeholder="e.g. PREMIUM APPLE, TIGER"
                  value={inwardForm.brand}
                  onChange={(e) => setInwardForm({ ...inwardForm, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Variety</label>
                <input
                  type="text"
                  placeholder="e.g. ROYAL GALA, PLUMS"
                  value={inwardForm.variety || ''}
                  onChange={(e) => setInwardForm({ ...inwardForm, variety: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Lot Number</label>
                <input
                  type="text"
                  placeholder="e.g. 9310871"
                  value={inwardForm.lotNo}
                  onChange={(e) => setInwardForm({ ...inwardForm, lotNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Packaging / UOM</label>
                <select
                  value={inwardForm.unit}
                  onChange={(e) => setInwardForm({ ...inwardForm, unit: e.target.value })}
                >
                  <option value="BAGS">BAGS</option>
                  <option value="BOX">BOX</option>
                  <option value="TRAY">TRAY</option>
                  <option value="KG">KG</option>
                  <option value="MT">MT</option>
                </select>
              </div>

              <div className="form-group">
                <label>SubUom (Size / Grade)</label>
                <input
                  type="text"
                  placeholder="e.g. C100, NO:1"
                  value={inwardForm.subUom || ''}
                  onChange={(e) => setInwardForm({ ...inwardForm, subUom: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Rate Type</label>
                <select
                  value={inwardForm.rateType || 'Daily'}
                  onChange={(e) => setInwardForm({ ...inwardForm, rateType: e.target.value })}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
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
                className="challan-tab-btn active"
                onClick={() => setActiveChallanTab('delivery')}
              >
                📄 Delivery Note / Challan
              </button>
            </div>

            <div className="toolbar-actions">
              {currentUser?.role === 'admin' && (
                <button
                  type="button"
                  className="doc-pdf-btn"
                  style={{ background: '#1E40AF', borderColor: '#1E40AF' }}
                  onClick={() => handleOpenEditDeliveryNote(issuedChallan)}
                >
                  ✏️ Edit DC Details
                </button>
              )}
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
                  <img src={activeLogistics.logo} alt={`${activeLogistics.label} Logo`} className="challan-brand-logo-img" />
                  {activeLogistics.gstNo && (
                    <div className="challan-reg-meta">
                      <div className="reg-row">
                        <span className="reg-lbl">GSTIN</span>
                        <span className="reg-colon">:</span>
                        <span className="reg-val">{activeLogistics.gstNo}</span>
                      </div>
                      <div className="reg-row">
                        <span className="reg-lbl">CIN</span>
                        <span className="reg-colon">:</span>
                        <span className="reg-val">U74900TN1993PTC024718</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="challan-company-right">
                  <h3 className="company-full-name">{activeLogistics.challanLegalName}</h3>
                  <p className="company-hub-address">
                    {activeLogistics.address}<br />
                    Tamil Nadu, India.<br />
                    Contact : {activeLogistics.phone}<br />
                    E-Mail: {activeLogistics.email || 'contact@heralogistics.com'}<br />
                    Website: {activeLogistics.website || 'www.heralogistics.com'}
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
                    <span className="meta-label">From</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">
                      <strong className="bold">{issuedChallan.fromCompany || issuedChallan.preparedBy || 'M/S. LORDS AND KINGS ENTERPRISES PVT.LTD.'}</strong>
                      <br />
                      {issuedChallan.fromAddress || '#328, 2nd floor, Ten Square Mall, Jawaharlal Nehru Road, Koyambedu, Chennai-600107'}
                    </span>
                  </div>
                  <div className="meta-row" style={{ marginTop: '5px' }}>
                    <span className="meta-label">To</span>
                    <span className="meta-colon">:</span>
                    <span className="meta-value">
                      <strong className="bold">{issuedChallan.customerName || 'GLOBAL ENTERPRISES'}</strong>
                      {issuedChallan.address && (
                        <>
                          <br />
                          {issuedChallan.address}
                        </>
                      )}
                    </span>
                  </div>
                  {issuedChallan.contactPerson && (
                    <div className="meta-row" style={{ marginTop: '2px' }}>
                      <span className="meta-label">Contact</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value">
                        {issuedChallan.contactPerson} {issuedChallan.contactNo ? `(${issuedChallan.contactNo})` : ''}
                      </span>
                    </div>
                  )}
                </div>

                <div className="meta-right-col">
                  {issuedChallan.dcNo && (
                    <div className="meta-row">
                      <span className="meta-label">DC No</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value bold">{issuedChallan.dcNo}</span>
                    </div>
                  )}
                  {issuedChallan.dcDate && (
                    <div className="meta-row">
                      <span className="meta-label">DC Date</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value">{issuedChallan.dcDate}</span>
                    </div>
                  )}
                  {issuedChallan.destination && (
                    <div className="meta-row">
                      <span className="meta-label">Destination</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value">{issuedChallan.destination}</span>
                    </div>
                  )}
                  {issuedChallan.preparedBy && (
                    <div className="meta-row">
                      <span className="meta-label">Prepared By</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value">{issuedChallan.preparedBy}</span>
                    </div>
                  )}
                  {issuedChallan.vehicleNo && (
                    <div className="meta-row">
                      <span className="meta-label">Vehicle No</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value bold">{issuedChallan.vehicleNo}</span>
                    </div>
                  )}
                  {issuedChallan.gateInNo && (
                    <div className="meta-row">
                      <span className="meta-label">Gate In NO</span>
                      <span className="meta-colon">:</span>
                      <span className="meta-value">{issuedChallan.gateInNo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table matching exact template */}
              <div className="challan-table-container">
                <table className="challan-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '38px', textAlign: 'left' }}>S.NO.</th>
                      <th style={{ width: '110px', textAlign: 'left' }}>GRN No</th>
                      <th style={{ textAlign: 'left' }}>Product Name</th>
                      <th style={{ width: '75px', textAlign: 'left' }}>LOT NO</th>
                      <th style={{ width: '85px', textAlign: 'left' }}>Packaging</th>
                      <th style={{ width: '105px', textAlign: 'right' }}>Quantity</th>
                      <th style={{ width: '65px', textAlign: 'left' }}>RateType</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issuedChallan.items && issuedChallan.items.map((item, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'left' }}>{idx + 1}</td>
                        <td className="dc-grn">{item.grnNo || '—'}</td>
                        <td>{item.variety || item.product || '—'}</td>
                        <td>{item.lotNo || '—'}</td>
                        <td>{item.count || (item.unit === 'BAGS' ? '50KG BAGS' : item.unit) || '—'}</td>
                        <td style={{ textAlign: 'right', verticalAlign: 'top', lineHeight: '1.3' }}>
                          <div style={{ fontWeight: '800', color: '#000000', fontSize: '9.5px' }}>
                            {item.unit === 'KG' || item.unit === 'KGS' || Number(item.selectedQty) > 500 ? (
                              <>
                                {Number(item.selectedQty || 0).toLocaleString()} Kgs
                                <div style={{ fontSize: '8.5px', fontWeight: '600', color: '#334155', marginTop: '1px' }}>
                                  ({(Number(item.selectedQty || 0) / 1000).toFixed(2)} Ton)
                                </div>
                              </>
                            ) : item.unit === 'BAGS' ? (
                              <>
                                {Number(item.selectedQty || 0).toLocaleString()} Bags
                                <div style={{ fontSize: '8.5px', fontWeight: '600', color: '#334155', marginTop: '1px' }}>
                                  ({(Number(item.selectedQty || 0) * 50).toLocaleString()} Kgs)
                                </div>
                              </>
                            ) : (
                              <>
                                {Number(item.selectedQty || 0).toLocaleString()} {item.unit || 'Units'}
                              </>
                            )}
                          </div>
                        </td>
                        <td>{item.rateType || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="5" className="total-label-cell" style={{ textAlign: 'right' }}>
                        Total Quantity
                      </td>
                      <td className="total-qty-cell" style={{ textAlign: 'right', verticalAlign: 'top', lineHeight: '1.3' }}>
                        <div style={{ fontWeight: '800', color: '#000000', fontSize: '9.5px' }}>
                          {issuedChallan.items?.[0]?.unit === 'KG' || issuedChallan.items?.[0]?.unit === 'KGS' || Number(issuedChallan.totalQty) > 500 ? (
                            <>
                              {Number(issuedChallan.totalQty || 0).toLocaleString()} Kgs
                              <div style={{ fontSize: '8.5px', fontWeight: '700', color: '#334155' }}>
                                ({(Number(issuedChallan.totalQty || 0) / 1000).toFixed(2)} Ton)
                              </div>
                            </>
                          ) : issuedChallan.items?.[0]?.unit === 'BAGS' ? (
                            <>
                              {Number(issuedChallan.totalQty || 0).toLocaleString()} Bags
                              <div style={{ fontSize: '8.5px', fontWeight: '700', color: '#334155' }}>
                                ({(Number(issuedChallan.totalQty || 0) * 50).toLocaleString()} Kgs)
                              </div>
                            </>
                          ) : (
                            <>
                              {Number(issuedChallan.totalQty || 0).toLocaleString()} {issuedChallan.items?.[0]?.unit || 'Units'}
                            </>
                          )}
                        </div>
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
                  <p className="remarks-text">GR: GOODS DISPATCH AUTHORIZED FROM {activeLogistics.hubLabel.toUpperCase()}</p>
                </div>
                <div className="footer-sign-col">
                  <div className="sign-company-name">For {activeLogistics.challanLegalName}</div>
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

                {currentUser?.role === 'admin' && (
                  <button
                    type="button"
                    className="action-menu-item"
                    style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}
                    onClick={() => {
                      setShowChallanActionMenu(false);
                      handleOpenEditDeliveryNote(issuedChallan);
                    }}
                  >
                    <span className="action-item-icon">✏️</span>
                    <div className="action-item-text">
                      <strong style={{ color: '#1E40AF' }}>Edit Delivery Note Details</strong>
                      <span>Modify vehicle, party, address, units</span>
                    </div>
                  </button>
                )}
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

  function renderInwardHistoryCard() {
    return (
      <div className="table-card dashboard-table-card" style={{ marginTop: '8px', padding: '16px 20px' }}>
        <div className="dash-table-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '800' }}>Past Inward History ({inwardRequests.length})</h3>
          </div>
          <button
            type="button"
            className="btn-hero-secondary"
            style={{ padding: '6px 14px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            onClick={() => loadSupabaseData(currentUser?.logisticsId)}
          >
            🔄 Refresh
          </button>
        </div>

        {inwardRequests.length === 0 ? (
          <div className="empty-cart-card" style={{ padding: '40px 20px' }}>
            <div className="empty-icon">📥</div>
            <h3>No Inward History Yet</h3>
          </div>
        ) : (
          <div className="stocks-table-wrapper">
            <div className="stocks-desktop-table">
              <table className="stocks-table">
                <thead>
                  <tr>
                    <th>GRN No</th>
                    <th>Date</th>
                    <th>Product &amp; Brand</th>
                    <th>Supplier / Notes</th>
                    <th style={{ textAlign: 'right' }}>Inward Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {inwardRequests.map((req) => (
                    <tr key={req.id}>
                      <td><div className="doc-num-bold">{req.grnNo || req.inwardNo}</div></td>
                      <td>{req.expectedDate || req.createdAt}</td>
                      <td>
                        <strong>{req.product}</strong>
                        <div className="grn-sub">{[req.brand, req.variety].filter(Boolean).join(' • ')}</div>
                      </td>
                      <td>{req.remarks || req.clientName}</td>
                      <td style={{ textAlign: 'right', fontWeight: '800', color: '#0F766E' }}>
                        {Number(req.qty || 0).toLocaleString()} {req.unit || 'BOX'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="stocks-mobile-cards">
              {inwardRequests.map((req) => (
                <div key={req.id} className="mobile-stock-card">
                  <div className="mobile-card-top">
                    <div className="mobile-card-product">
                      <span className="mobile-product-name">{req.product}</span>
                      <span className="mobile-client-name">{req.remarks || req.clientName}</span>
                    </div>
                    <span className="wh-bay-badge">{req.expectedDate || req.createdAt}</span>
                  </div>
                  <div className="mobile-card-footer">
                    <span className="mobile-more-info">{req.grnNo || req.inwardNo}</span>
                    <strong style={{ color: '#0F766E' }}>{Number(req.qty || 0).toLocaleString()} {req.unit || 'BOX'}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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
              <button
                className="doc-pdf-btn"
                onClick={handleDownloadInwardAdvicePdf}
                disabled={isDownloading}
                title="Download PDF"
                aria-label="Download PDF"
                style={{ minWidth: '42px', padding: '8px 12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isDownloading ? '⏳' : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                )}
              </button>
              <button className="doc-print-btn" onClick={() => window.print()} title="Print" aria-label="Print">
                🖨️
              </button>
              <button className="doc-close-btn" onClick={() => setIssuedInwardReceipt(null)}>&times;</button>
            </div>
          </div>

          <div className="challan-printable-sheet" id="inward-advice-sheet">
            <div className="challan-template-frame">
              <div className="challan-header-grid">
                <div className="challan-company-left">
                  <img src={activeLogistics.logo} alt={`${activeLogistics.label} Logo`} className="challan-brand-logo-img" />
                  {activeLogistics.gstNo && (
                    <div className="challan-reg-meta">
                      <div className="reg-row"><span className="reg-lbl">GSTIN</span><span className="reg-colon">:</span><span className="reg-val">{activeLogistics.gstNo}</span></div>
                      <div className="reg-row"><span className="reg-lbl">CIN</span><span className="reg-colon">:</span><span className="reg-val">U74900TN1993PTC024718</span></div>
                    </div>
                  )}
                </div>
                <div className="challan-company-right">
                  <h3 className="company-full-name">{activeLogistics.challanLegalName}</h3>
                  <p className="company-hub-address">
                    {activeLogistics.address}<br />
                    Tamil Nadu, India.<br />
                    Contact : {activeLogistics.phone}<br />
                    E-Mail: {activeLogistics.email || 'contact@heralogistics.com'}<br />
                    Website: {activeLogistics.website || 'www.heralogistics.com'}
                  </p>
                </div>
              </div>

              <div className="challan-title-bar">
                <h2>INWARD CONSIGNMENT ADVICE NOTE (PRE-ADVICE)</h2>
              </div>

              <div className="challan-meta-grid">
                <div className="meta-left-col">
                  {issuedInwardReceipt.clientName && (
                    <div className="meta-row"><span className="meta-label">Customer Name</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.clientName}</span></div>
                  )}
                  {issuedInwardReceipt.driverPhone && (
                    <div className="meta-row"><span className="meta-label">Contact Phone</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.driverPhone}</span></div>
                  )}
                  {issuedInwardReceipt.docNo && (
                    <div className="meta-row"><span className="meta-label">Invoice Ref</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.docNo}</span></div>
                  )}
                  {issuedInwardReceipt.remarks && (
                    <div className="meta-row"><span className="meta-label">Remarks</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.remarks}</span></div>
                  )}
                </div>
                <div className="meta-right-col">
                  {issuedInwardReceipt.inwardNo && (
                    <div className="meta-row"><span className="meta-label">Inward Advice No</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.inwardNo}</span></div>
                  )}
                  {issuedInwardReceipt.createdAt && (
                    <div className="meta-row"><span className="meta-label">Date Submitted</span><span className="meta-colon">:</span><span className="meta-value">{issuedInwardReceipt.createdAt}</span></div>
                  )}
                  {issuedInwardReceipt.expectedDate && (
                    <div className="meta-row"><span className="meta-label">Expected Date</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.expectedDate}</span></div>
                  )}
                  {issuedInwardReceipt.vehicleNo && (
                    <div className="meta-row"><span className="meta-label">Lorry / Vehicle</span><span className="meta-colon">:</span><span className="meta-value bold">{issuedInwardReceipt.vehicleNo}</span></div>
                  )}
                </div>
              </div>

              <div className="challan-table-container">
                <table className="challan-items-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px', textAlign: 'left' }}>S.NO.</th>
                      <th style={{ textAlign: 'left' }}>Product Description</th>
                      <th style={{ width: '120px', textAlign: 'left' }}>Variety</th>
                      <th style={{ width: '110px', textAlign: 'right' }}>Declared Qty</th>
                      <th style={{ width: '120px', textAlign: 'right' }}>Weight (KG)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td><strong>{issuedInwardReceipt.product}</strong></td>
                      <td>{issuedInwardReceipt.variety || '—'}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{issuedInwardReceipt.qty} {issuedInwardReceipt.unit}</td>
                      <td style={{ textAlign: 'right' }}>{issuedInwardReceipt.weightKg ? Number(issuedInwardReceipt.weightKg).toLocaleString() + ' KG' : '—'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="challan-footer-grid">
                <div className="footer-remarks-col">
                  <div className="remarks-header-row"><span className="remarks-title">INSTRUCTIONS FOR TRANSPORTER:</span><span className="eoe-tag">E. & O.E</span></div>
                  <p className="remarks-text">Please present this Inward Advice Note upon vehicle arrival at Hera Logistics Warehouse Gate.</p>
                </div>
                <div className="footer-sign-col">
                  <div className="sign-company-name">For {activeLogistics.label} Hub</div>
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
                        <button
                          className="row-dispatch-btn"
                          title="Download / View Advice"
                          aria-label="Download / View Advice"
                          style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          onClick={() => { setShowInwardStatusModal(false); setIssuedInwardReceipt(req); }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
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
              <p className="mobile-hide-subtext">When you dispatch items from your inventory, official delivery notes will appear here.</p>
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

  function renderReportDownloadConfirmModal() {
    return (
      <div className="modal-backdrop report-confirm-backdrop" onClick={() => !isDownloading && setShowReportDownloadConfirm(false)}>
        <div className="modal-card report-confirm-modal-simple" onClick={(e) => e.stopPropagation()}>
          <div className="report-confirm-simple-body">
            <div className="report-simple-icon">📄</div>
            <h3 className="report-simple-title">Download Stock Report?</h3>
            <p className="report-simple-subtitle">Do you want to download the PDF?</p>
          </div>

          <div className="report-simple-actions">
            <button
              type="button"
              className="btn-simple-no"
              onClick={() => setShowReportDownloadConfirm(false)}
              disabled={isDownloading}
            >
              No
            </button>
            <button
              type="button"
              className="btn-simple-yes"
              onClick={handleDownloadStockReportPdf}
              disabled={isDownloading}
            >
              {isDownloading ? 'Saving...' : 'Yes'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderPinManagementModal() {
    return (
      <div className="modal-backdrop" onClick={() => setShowPinModal(false)}>
        <div className="modal-card wide-modal" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
          <div className="modal-header-simple" style={{ marginBottom: '14px' }}>
            <div className="modal-header-title-box">
              <div className="simple-badge-hub">🛡️ Master Access Control</div>
              <h2>🔑 Supabase Profile PIN Manager</h2>
            </div>
            <button className="modal-close-icon" onClick={() => setShowPinModal(false)}>✕</button>
          </div>

          <p style={{ fontSize: '0.84rem', color: '#64748B', margin: '0 0 16px 0' }}>
            View and manage 6-digit access PINs and mobile numbers stored in the Supabase <code>profiles</code> table.
          </p>

          {pinUpdateStatus && (
            <div style={{ background: '#ECFDF5', color: '#065F46', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontWeight: 'bold', fontSize: '0.85rem' }}>
              {pinUpdateStatus}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
            {dbProfiles.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', background: '#F8FAFC', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontWeight: '600' }}>Fetching accounts from Supabase...</p>
              </div>
            ) : (
              dbProfiles.map((p) => (
                <div
                  key={p.id}
                  style={{
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    background: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: '800', fontSize: '0.92rem', color: '#0F172A' }}>
                        {p.company_name || p.email}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                        📱 <strong>{p.phone || 'No phone'}</strong> &bull; ✉️ {p.email}
                      </div>
                    </div>
                    <span style={{
                      background: p.role === 'admin' ? '#FEF2F2' : '#F0FDFA',
                      color: p.role === 'admin' ? '#991B1B' : '#0D9488',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: '800'
                    }}>
                      {p.role === 'admin' ? '🛡️ Admin' : '👤 Customer'}
                    </span>
                  </div>

                  {editingPinUser === p.id ? (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <input
                        type="text"
                        maxLength={6}
                        autoFocus
                        placeholder="New 6-digit PIN"
                        value={newPinValue}
                        onChange={(e) => setNewPinValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        style={{
                          width: '150px',
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1.5px solid #0F766E',
                          fontWeight: 'bold',
                          letterSpacing: '3px',
                          fontSize: '1rem',
                          textAlign: 'center'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateProfilePin(p.id, newPinValue)}
                        style={{
                          background: '#0F766E',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Save PIN
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingPinUser(null); setNewPinValue(''); }}
                        style={{
                          background: '#E2E8F0',
                          color: '#475569',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontWeight: '600',
                          fontSize: '0.82rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
                      <div style={{ fontSize: '0.82rem', color: '#334155' }}>
                        Active 6-Digit PIN: <strong style={{ letterSpacing: '2px', background: '#F8FAFC', padding: '2px 8px', borderRadius: '4px', border: '1px solid #CBD5E1' }}>{p.pin || '123456'}</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setEditingPinUser(p.id); setNewPinValue(p.pin || '123456'); }}
                        style={{
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          border: '1px solid #BFDBFE',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          fontSize: '0.76rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Change PIN
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="modal-actions" style={{ marginTop: '16px' }}>
            <button type="button" className="btn-hero-secondary" onClick={() => setShowPinModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  function renderEditDeliveryNoteModal() {
    if (!editingDeliveryNote) return null;
    return (
      <div className="modal-backdrop" onClick={() => setEditingDeliveryNote(null)}>
        <div className="modal-card wide-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
          <div className="dispatch-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 className="modal-title" style={{ margin: 0, fontSize: '1.2rem', textAlign: 'left' }}>
                ✏️ Edit Delivery Note (Admin)
              </h2>
              <p className="modal-sub-clean" style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#64748B', textAlign: 'left' }}>
                Update transport, vehicle, address, and consignment fields
              </p>
            </div>
            <button className="modal-close-icon" onClick={() => setEditingDeliveryNote(null)}>✕</button>
          </div>

          <form onSubmit={handleSaveEditDeliveryNote} className="inward-entry-form">
            <div className="form-grid-two">
              <div className="form-group">
                <label>DC Number <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={editDcForm.dcNo}
                  onChange={(e) => setEditDcForm({ ...editDcForm, dcNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Dispatch Date <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={editDcForm.dcDate}
                  onChange={(e) => setEditDcForm({ ...editDcForm, dcDate: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Customer / Party Name <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={editDcForm.customerName}
                  onChange={(e) => setEditDcForm({ ...editDcForm, customerName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Destination Hub / Place <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={editDcForm.destination}
                  onChange={(e) => setEditDcForm({ ...editDcForm, destination: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Delivery Address</label>
                <input
                  type="text"
                  value={editDcForm.address}
                  onChange={(e) => setEditDcForm({ ...editDcForm, address: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Lorry / Vehicle Number <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  value={editDcForm.vehicleNo}
                  onChange={(e) => setEditDcForm({ ...editDcForm, vehicleNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Gate-In Pass No</label>
                <input
                  type="text"
                  value={editDcForm.gateInNo}
                  onChange={(e) => setEditDcForm({ ...editDcForm, gateInNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Person</label>
                <input
                  type="text"
                  value={editDcForm.contactPerson}
                  onChange={(e) => setEditDcForm({ ...editDcForm, contactPerson: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  type="text"
                  value={editDcForm.contactNo}
                  onChange={(e) => setEditDcForm({ ...editDcForm, contactNo: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Prepared By / Signatory</label>
                <input
                  type="text"
                  value={editDcForm.preparedBy}
                  onChange={(e) => setEditDcForm({ ...editDcForm, preparedBy: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Total Dispatched Units</label>
                <input
                  type="number"
                  step="any"
                  value={editDcForm.totalQty}
                  onChange={(e) => setEditDcForm({ ...editDcForm, totalQty: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button type="button" className="btn-hero-secondary" onClick={() => setEditingDeliveryNote(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-hero-primary" style={{ background: '#1E40AF', borderColor: '#1E40AF' }} disabled={isSavingDc}>
                {isSavingDc ? 'Saving...' : '💾 Save DC Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  function renderToast() {
    if (!toast) return null;
    return (
      <div className={`hera-toast-floating toast-${toast.type || 'error'}`}>
        <span className="toast-icon">
          {toast.type === 'success' ? '✅' : toast.type === 'warning' ? '⚠️' : '❌'}
        </span>
        <span className="toast-message">{toast.message}</span>
        <button className="toast-close" onClick={() => setToast(null)} title="Dismiss">✕</button>
      </div>
    );
  }

  function renderInstallBanner() {
    if (!showInstallBanner) return null;
    return (
      <div className="pwa-install-banner">
        <div className="pwa-install-left">
          <img src={activeLogistics.logo} alt={`${activeLogistics.label} Logo`} className="pwa-install-logo" />
          <div className="pwa-install-text">
            <strong>Install {activeLogistics.label} App</strong>
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
