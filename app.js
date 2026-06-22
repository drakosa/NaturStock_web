let supabaseClient = null;
let isOffline = false;

let products = [];
let categories = [];
let suppliers = [];
let clients = [];
let sales = [];
let saleDetails = [];
let movements = [];
let alerts = [];

let currentPage = { products: 1, movements: 1, sales: 1 };
const PAGE_SIZE = 10;
let editingProductId = null;
let editingCategoryId = null;
let editingSupplierId = null;
let editingClientId = null;
let productFilterCategory = '';
let productFilterStatus = '';

function initSupabase() {
  try {
    if (typeof SUPABASE_CONFIG === 'undefined') {
      isOffline = true;
      return;
    }
    const url = SUPABASE_CONFIG.url;
    const key = SUPABASE_CONFIG.anonKey;
    const isPlaceholder = !url || !key ||
      url.includes('tu-proyecto') || key.includes('tu-anon-key') ||
      url.includes('__SUPABASE_URL__');
    if (isPlaceholder) {
      isOffline = true;
      return;
    }
    const lib = window.supabase;
    if (!lib) {
      isOffline = true;
      return;
    }
    supabaseClient = lib.createClient(url, key);
    isOffline = false;
  } catch (e) {
    isOffline = true;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  setupLogin();
  setupRouting();
  setupLogout();
  setupProductFilters();
  setupGlobalSearch();
  setupModals();
  setupProfileLogout();
});

function setupLogin() {
  document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value.trim();
    const errorEl = document.getElementById('loginError');
    if (user === 'admin' && pass === '123456') {
      errorEl.classList.remove('show');
      document.getElementById('loginScreen').style.display = 'none';
      document.getElementById('appShell').classList.add('active');
      loadData();
    } else {
      errorEl.classList.add('show');
    }
  });
  document.querySelectorAll('#loginForm input').forEach(inp => {
    inp.addEventListener('focus', () => { inp.parentElement.style.transform = 'scale(1.01)'; });
    inp.addEventListener('blur', () => { inp.parentElement.style.transform = ''; });
  });
}

function setupRouting() {
  window.addEventListener('hashchange', handleRoute);
  if (!window.location.hash) {
    window.location.hash = 'dashboard';
  } else {
    handleRoute();
  }
}

function handleRoute() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));

  const pageMap = {
    dashboard: 'pageDashboard',
    products: 'pageProducts',
    categories: 'pageCategories',
    suppliers: 'pageSuppliers',
    clients: 'pageClients',
    sales: 'pageSales',
    inventory: 'pageInventory',
    reports: 'pageReports',
    profile: 'pageProfile'
  };

  const page = document.getElementById(pageMap[hash]);
  const navLink = document.querySelector(`.sidebar-nav a[data-page="${hash}"]`);
  if (page) {
    page.classList.add('active');
    if (navLink) navLink.classList.add('active');
    document.title = `NaturaStock Cusco - ${page.querySelector('h2')?.textContent || hash}`;
    loadPageData(hash);
  }
  closeSidebar();
}

function loadPageData(page) {
  switch (page) {
    case 'dashboard': loadDashboard(); break;
    case 'products': renderProducts(); break;
    case 'categories': renderCategories(); break;
    case 'suppliers': renderSuppliers(); break;
    case 'clients': renderClients(); break;
    case 'sales': renderSales(); break;
    case 'inventory': renderMovements(); break;
    case 'reports': loadReports(); break;
  }
}

async function loadData() {
  if (isOffline) {
    loadExampleData();
    return;
  }
  try {
    const [prodRes, movRes, catRes, supRes, cliRes, saleRes, detailRes, alertRes] = await Promise.all([
      supabaseClient.from('productos').select('*, categorias(nombre), proveedores(nombre)').order('created_at', { ascending: false }),
      supabaseClient.from('movimientos_inventario').select('*, productos(nombre)').order('fecha_movimiento', { ascending: false }),
      supabaseClient.from('categorias').select('*').order('nombre'),
      supabaseClient.from('proveedores').select('*').order('nombre'),
      supabaseClient.from('clientes').select('*').order('nombre'),
      supabaseClient.from('ventas').select('*, clientes(nombre)').order('created_at', { ascending: false }),
      supabaseClient.from('detalle_ventas').select('*, productos(nombre, precio)'),
      supabaseClient.from('alertas_stock').select('*, productos(nombre)').order('created_at', { ascending: false }).limit(20)
    ]);
    if (prodRes.data) products = prodRes.data.map(p => normalizeProduct(p));
    if (movRes.data) movements = movRes.data;
    if (catRes.data) categories = catRes.data;
    if (supRes.data) suppliers = supRes.data;
    if (cliRes.data) clients = cliRes.data;
    if (saleRes.data) sales = saleRes.data;
    if (detailRes.data) saleDetails = detailRes.data;
    if (alertRes.data) alerts = alertRes.data;
  } catch (e) {
    console.error('Error al conectar con Supabase:', e);
    showToast('Error al conectar con Supabase: ' + (e.message || 'desconocido'), 'error');
  }
  renderProducts();
  renderCategories();
  renderSuppliers();
  renderClients();
  renderSales();
  renderMovements();
  loadDashboard();
  loadReports();
}

function normalizeProduct(p) {
  return {
    ...p,
    image_url: p.image_url || null,
    categoria: p.categorias?.nombre || '',
    proveedor: p.proveedores?.nombre || '',
    categoria_nombre: p.categorias?.nombre || '',
    proveedor_nombre: p.proveedores?.nombre || ''
  };
}

function loadExampleData() {
  categories = [
    { id: 1, nombre: 'Infusiones', descripcion: 'Tés e infusiones de hierbas andinas', created_at: new Date().toISOString() },
    { id: 2, nombre: 'Suplementos', descripcion: 'Suplementos nutricionales naturales', created_at: new Date().toISOString() },
    { id: 3, nombre: 'Hierbas', descripcion: 'Hierbas aromáticas y medicinales', created_at: new Date().toISOString() },
    { id: 4, nombre: 'Mieles', descripcion: 'Miel de abeja y derivados', created_at: new Date().toISOString() },
    { id: 5, nombre: 'Medicinales', descripcion: 'Plantas medicinales tradicionales', created_at: new Date().toISOString() },
    { id: 6, nombre: 'Cosmética natural', descripcion: 'Cosméticos y cuidados naturales', created_at: new Date().toISOString() }
  ];
  suppliers = [
    { id: 1, nombre: 'Hierbas del Valle SRL', contacto: 'Carlos Mamani', telefono: '+51 984 111 111', email: 'carlos@hierbasdelvalle.pe', direccion: 'Av. de la Cultura 123, Cusco' },
    { id: 2, nombre: 'Andean Naturals EIRL', contacto: 'María Quispe', telefono: '+51 984 222 222', email: 'maria@andeannaturals.pe', direccion: 'Jr. Libertad 456, Urubamba' },
    { id: 3, nombre: 'Mieles del Sur SAC', contacto: 'Pedro Huamán', telefono: '+51 984 333 333', email: 'pedro@mielesdelsur.pe', direccion: 'Calle Real 789, Cusco' },
    { id: 4, nombre: 'Cosmética Nativa', contacto: 'Lucía Vargas', telefono: '+51 984 444 444', email: 'lucia@cosmeticanativa.pe', direccion: 'Av. Sol 321, Cusco' }
  ];
  clients = [
    { id: 1, nombre: 'Juan Pérez García', tipo_documento: 'DNI', numero_documento: '12345678', telefono: '+51 987 654 321', email: 'juan@email.com', direccion: 'Av. Tullumayo 123, Cusco' },
    { id: 2, nombre: 'María Torres Luna', tipo_documento: 'DNI', numero_documento: '23456789', telefono: '+51 987 654 322', email: 'maria@email.com', direccion: 'Jr. San Blas 456, Cusco' },
    { id: 3, nombre: 'Comercial Andina SAC', tipo_documento: 'RUC', numero_documento: '20123456789', telefono: '+51 987 654 323', email: 'ventas@comercialandina.pe', direccion: 'Calle Suecia 789, Cusco' },
    { id: 4, nombre: 'Botica Natural EIRL', tipo_documento: 'RUC', numero_documento: '20234567890', telefono: '+51 987 654 324', email: 'info@boticanatural.pe', direccion: 'Av. El Sol 321, Cusco' }
  ];
  products = [
    { id: 1, codigo: 'SKU-0001', nombre: 'Miel de Abeja Pura 500ml', categoria_id: 4, proveedor_id: 3, categoria: 'Mieles', proveedor: 'Mieles del Sur SAC', precio: 25.00, stock: 120, stock_minimo: 10, descripcion: 'Miel de abeja 100% natural de los valles de Cusco.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 2, codigo: 'SKU-0002', nombre: 'Muña Andina 100g', categoria_id: 3, proveedor_id: 1, categoria: 'Hierbas', proveedor: 'Hierbas del Valle SRL', precio: 8.50, stock: 200, stock_minimo: 15, descripcion: 'Hierba aromática andina tradicional.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 3, codigo: 'SKU-0003', nombre: 'Maca Negra en Polvo 250g', categoria_id: 2, proveedor_id: 2, categoria: 'Suplementos', proveedor: 'Andean Naturals EIRL', precio: 18.00, stock: 5, stock_minimo: 8, descripcion: 'Maca negra orgánica de Junín.', image_url: null, estado: 'bajo_stock', created_at: new Date().toISOString() },
    { id: 4, codigo: 'SKU-0004', nombre: 'Quinua Real Orgánica 1kg', categoria_id: 2, proveedor_id: 2, categoria: 'Suplementos', proveedor: 'Andean Naturals EIRL', precio: 12.00, stock: 0, stock_minimo: 10, descripcion: 'Quinua real orgánica del Altiplano.', image_url: null, estado: 'agotado', created_at: new Date().toISOString() },
    { id: 5, codigo: 'SKU-0005', nombre: 'Uña de Gato Corteza 150g', categoria_id: 5, proveedor_id: 1, categoria: 'Medicinales', proveedor: 'Hierbas del Valle SRL', precio: 15.00, stock: 60, stock_minimo: 5, descripcion: 'Corteza de uña de gato amazónica.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 6, codigo: 'SKU-0006', nombre: 'Té de Coca 25 bolsitas', categoria_id: 1, proveedor_id: 1, categoria: 'Infusiones', proveedor: 'Hierbas del Valle SRL', precio: 6.50, stock: 300, stock_minimo: 20, descripcion: 'Té de hoja de coca tradicional.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 7, codigo: 'SKU-0007', nombre: 'Pomada Natural de Arcilla 100g', categoria_id: 6, proveedor_id: 4, categoria: 'Cosmética natural', proveedor: 'Cosmética Nativa', precio: 22.00, stock: 30, stock_minimo: 5, descripcion: 'Pomada de arcilla con hierbas andinas.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 8, codigo: 'SKU-0008', nombre: 'Aceite Esencial de Eucalipto 30ml', categoria_id: 5, proveedor_id: 4, categoria: 'Medicinales', proveedor: 'Cosmética Nativa', precio: 28.00, stock: 2, stock_minimo: 5, descripcion: 'Aceite esencial puro de eucalipto.', image_url: null, estado: 'bajo_stock', created_at: new Date().toISOString() },
    { id: 9, codigo: 'SKU-0009', nombre: 'Infusión de Manzanilla 20 sobres', categoria_id: 1, proveedor_id: 1, categoria: 'Infusiones', proveedor: 'Hierbas del Valle SRL', precio: 5.00, stock: 250, stock_minimo: 15, descripcion: 'Manzanilla orgánica del Valle Sagrado.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() },
    { id: 10, codigo: 'SKU-0010', nombre: 'Crema de Mano de Caléndula 75ml', categoria_id: 6, proveedor_id: 4, categoria: 'Cosmética natural', proveedor: 'Cosmética Nativa', precio: 19.00, stock: 40, stock_minimo: 8, descripcion: 'Crema hidratante con caléndula y aceites naturales.', image_url: null, estado: 'disponible', created_at: new Date().toISOString() }
  ];
  sales = [
    { id: 1, cliente_id: 1, total: 56.00, tipo_comprobante: 'Boleta', numero_comprobante: 'V20240601-0001', created_at: new Date(Date.now() - 3600000).toISOString(), clientes: { nombre: 'Juan Pérez García' } },
    { id: 2, cliente_id: 3, total: 124.50, tipo_comprobante: 'Factura', numero_comprobante: 'V20240601-0002', created_at: new Date(Date.now() - 7200000).toISOString(), clientes: { nombre: 'Comercial Andina SAC' } }
  ];
  saleDetails = [
    { id: 1, venta_id: 1, producto_id: 1, cantidad: 2, precio_unitario: 25.00, subtotal: 50.00, productos: { nombre: 'Miel de Abeja Pura 500ml' } },
    { id: 2, venta_id: 1, producto_id: 2, cantidad: 4, precio_unitario: 8.50, subtotal: 6.00, productos: { nombre: 'Muña Andina 100g' } },
    { id: 3, venta_id: 2, producto_id: 3, cantidad: 3, precio_unitario: 18.00, subtotal: 54.00, productos: { nombre: 'Maca Negra en Polvo 250g' } },
    { id: 4, venta_id: 2, producto_id: 8, cantidad: 5, precio_unitario: 28.00, subtotal: 70.50, productos: { nombre: 'Aceite Esencial de Eucalipto 30ml' } }
  ];
  movements = [
    { id: 1, producto_id: 1, tipo_movimiento: 'entrada', cantidad: 50, descripcion: 'Reabastecimiento semanal', fecha_movimiento: new Date(Date.now() - 3600000).toISOString(), productos: { nombre: 'Miel de Abeja Pura 500ml' } },
    { id: 2, producto_id: 4, tipo_movimiento: 'salida', cantidad: 10, descripcion: 'Despacho a tienda principal', fecha_movimiento: new Date(Date.now() - 7200000).toISOString(), productos: { nombre: 'Quinua Real Orgánica 1kg' } },
    { id: 3, producto_id: 2, tipo_movimiento: 'entrada', cantidad: 30, descripcion: 'Nueva cosecha', fecha_movimiento: new Date(Date.now() - 10800000).toISOString(), productos: { nombre: 'Muña Andina 100g' } },
    { id: 4, producto_id: 6, tipo_movimiento: 'salida', cantidad: 45, descripcion: 'Pedido distribuidor', fecha_movimiento: new Date(Date.now() - 14400000).toISOString(), productos: { nombre: 'Té de Coca 25 bolsitas' } },
    { id: 5, producto_id: 3, tipo_movimiento: 'entrada', cantidad: 20, descripcion: 'Reabastecimiento de maca', fecha_movimiento: new Date(Date.now() - 18000000).toISOString(), productos: { nombre: 'Maca Negra en Polvo 250g' } }
  ];
  alerts = [
    { id: 1, producto_id: 3, tipo_alerta: 'stock_bajo', mensaje: 'El producto "Maca Negra en Polvo 250g" tiene stock bajo: 5 unidades.', leida: false, created_at: new Date().toISOString(), productos: { nombre: 'Maca Negra en Polvo 250g' } },
    { id: 2, producto_id: 8, tipo_alerta: 'stock_bajo', mensaje: 'El producto "Aceite Esencial de Eucalipto 30ml" tiene stock bajo: 2 unidades.', leida: false, created_at: new Date().toISOString(), productos: { nombre: 'Aceite Esencial de Eucalipto 30ml' } }
  ];
  renderProducts();
  renderCategories();
  renderSuppliers();
  renderClients();
  renderSales();
  renderMovements();
  loadDashboard();
  loadReports();
}

function loadDashboard() {
  const total = products.length;
  const lowStock = products.filter(p => p.estado === 'bajo_stock').length;
  const outOfStock = products.filter(p => p.estado === 'agotado').length;
  const totalValue = products.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const totalMovements = movements.length;
  const totalClients = clients.length;
  const totalSuppliers = suppliers.length;

  const todaySales = sales.filter(s => isToday(new Date(s.created_at)));
  const daySalesTotal = todaySales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);

  const availablePct = total > 0 ? Math.round(((total - lowStock - outOfStock) / total) * 100) : 0;
  const stockHealth = lowStock + outOfStock;

  document.getElementById('dashTotalProducts').textContent = total;
  document.getElementById('dashLowStock').textContent = lowStock;
  document.getElementById('dashOutOfStock').textContent = outOfStock;
  document.getElementById('dashTotalValue').textContent = 'S/ ' + formatCurrency(totalValue);
  document.getElementById('dashTotalMovements').textContent = totalMovements;
  document.getElementById('dashDaySales').textContent = 'S/ ' + formatCurrency(daySalesTotal);

  document.getElementById('dashProdTrend').innerHTML = availablePct + '% disponible';
  document.getElementById('dashLowStockTrend').innerHTML = lowStock + ' cr\u00edticos';
  document.getElementById('dashOutTrend').innerHTML = outOfStock + ' agotados';
  document.getElementById('dashValueTrend').innerHTML = movements.length + ' movimientos';
  document.getElementById('dashSalesTrend').innerHTML = todaySales.length + ' ventas hoy';

  const statGrid = document.getElementById('dashboardStats');
  const extraStats = statGrid.querySelectorAll('.stat-card-extra');
  extraStats.forEach(el => el.remove());

  const extras = [
    { icon: 'people', label: 'Clientes', value: totalClients, trend: 'Registrados' },
    { icon: 'local_shipping', label: 'Proveedores', value: totalSuppliers, trend: 'Asociados' }
  ];
  extras.forEach(ex => {
    const div = document.createElement('div');
    div.className = 'stat-card stat-card-extra';
    div.innerHTML = '<div class="stat-card-header"><div class="stat-icon"><span class="material-icons">' + ex.icon + '</span></div><span class="stat-trend neutral">' + ex.trend + '</span></div><p class="stat-label">' + ex.label + '</p><p class="stat-value">' + ex.value + '</p>';
    statGrid.appendChild(div);
  });

  renderCategoryChart();
  renderDashMovements();
}

function isToday(date) {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function renderCategoryChart() {
  const container = document.getElementById('categoryChart');
  const cats = {};
  products.forEach(p => { cats[p.categoria] = (cats[p.categoria] || 0) + 1; });
  const entries = Object.entries(cats);
  const max = Math.max(...entries.map(([,v]) => v), 1);
  container.innerHTML = entries.map(([cat, count]) => {
    const height = (count / max) * 100;
    const catShort = cat.length > 12 ? cat.substring(0, 10) + '...' : cat;
    return '<div class="chart-bar" style="height:' + height + '%" title="' + cat + ': ' + count + '">' +
      '<span class="chart-bar-label">' + catShort + '</span></div>';
  }).join('') || '<p style="color:var(--on-surface-variant);padding:16px;">Sin productos</p>';
}

function renderDashMovements() {
  const tbody = document.getElementById('dashMovementsTable');
  const recent = movements.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay movimientos recientes</td></tr>';
    return;
  }
  tbody.innerHTML = recent.map(m => {
    const prodName = m.productos?.nombre || products.find(p => p.id === m.producto_id)?.nombre || 'Producto';
    const isEntry = m.tipo_movimiento === 'entrada';
    return '<tr>' +
      '<td style="font-size:14px;">' + formatDate(m.fecha_movimiento) + '</td>' +
      '<td style="font-size:14px;font-weight:600;">' + prodName + '</td>' +
      '<td><span class="badge ' + (isEntry ? 'badge-success' : 'badge-warning') + '"><span class="badge-dot"></span> ' + (isEntry ? 'Entrada' : 'Salida') + '</span></td>' +
      '<td class="text-right" style="font-size:14px;font-weight:600;color:' + (isEntry ? 'var(--primary)' : 'var(--error)') + ';">' + (isEntry ? '+' : '-') + m.cantidad + '</td>' +
      '</tr>';
  }).join('');
}

function setupProductFilters() {
  document.getElementById('filterCategory').addEventListener('change', (e) => {
    productFilterCategory = e.target.value;
    currentPage.products = 1;
    renderProducts();
  });
  document.getElementById('filterStatus').addEventListener('change', (e) => {
    productFilterStatus = e.target.value;
    currentPage.products = 1;
    renderProducts();
  });
}

function setupGlobalSearch() {
  let searchTimeout;
  document.getElementById('globalSearch').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentPage.products = 1;
      renderProducts();
    }, 300);
  });
}

function getFilteredProducts() {
  const search = document.getElementById('globalSearch').value.toLowerCase().trim();
  return products.filter(p => {
    if (productFilterCategory && p.categoria !== productFilterCategory) return false;
    if (productFilterStatus && p.estado !== productFilterStatus) return false;
    if (search && !p.nombre.toLowerCase().includes(search)) return false;
    return true;
  });
}

const productInfoData = {
  'Miel de Abeja': {
    category: 'Alimentos',
    description: 'Miel natural obtenida de abejas de los valles del Cusco.',
    queEs: 'Miel natural obtenida de abejas de los valles del Cusco.',
    paraQueSirve: 'Ayuda a endulzar naturalmente alimentos y bebidas.',
    beneficios: ['Fuente natural de energ\u00eda', 'Aporta antioxidantes', 'Sabor natural'],
    formaDeUso: 'Consumir directamente o agregar a bebidas.',
    presentacion: 'Frasco de 500ml',
    infoComplementaria: 'Producto 100% natural, sin aditivos ni conservantes.'
  },
  'Mu\u00f1a Andina': {
    category: 'Infusiones',
    description: 'Hierba arom\u00e1tica tradicional de los Andes.',
    queEs: 'Hierba arom\u00e1tica tradicional de los Andes.',
    paraQueSirve: 'Se utiliza en infusiones digestivas.',
    beneficios: ['Aroma refrescante', 'Uso tradicional andino', 'F\u00e1cil preparaci\u00f3n'],
    formaDeUso: 'Preparar una infusi\u00f3n con agua caliente.',
    presentacion: 'Bolsa de 100g',
    infoComplementaria: 'Producto natural de los valles andinos.'
  },
  'Maca': {
    category: 'Suplementos',
    description: 'Suplemento natural elaborado a base de maca negra.',
    queEs: 'Suplemento natural elaborado a base de maca negra.',
    paraQueSirve: 'Complemento alimenticio tradicional.',
    beneficios: ['Producto andino', 'F\u00e1cil incorporaci\u00f3n a bebidas', 'Alto valor nutricional'],
    formaDeUso: 'Mezclar con jugos, leche o batidos.',
    presentacion: 'Bolsa de 250g',
    infoComplementaria: 'Maca negra seleccionada de la meseta de Jun\u00edn.'
  },
  'Quinua': {
    category: 'Alimentos',
    description: 'Grano andino de alta calidad.',
    queEs: 'Grano andino de alta calidad.',
    paraQueSirve: 'Alimento nutritivo para diversas preparaciones.',
    beneficios: ['Fuente de prote\u00edna vegetal', 'Vers\u00e1til en cocina', 'Producto natural'],
    formaDeUso: 'Cocinar antes de consumir.',
    presentacion: 'Bolsa de 1kg',
    infoComplementaria: 'Quinua real org\u00e1nica certificada.'
  },
  'U\u00f1a de Gato': {
    category: 'Infusiones',
    description: 'Corteza natural proveniente de la Amazon\u00eda.',
    queEs: 'Corteza natural proveniente de la Amazon\u00eda.',
    paraQueSirve: 'Uso tradicional en infusiones.',
    beneficios: ['Producto natural', 'Tradici\u00f3n amaz\u00f3nica', 'F\u00e1cil preparaci\u00f3n'],
    formaDeUso: 'Preparar en infusi\u00f3n.',
    presentacion: 'Bolsa de 150g',
    infoComplementaria: 'Corteza seleccionada de la Amazon\u00eda peruana.'
  },
  'T\u00e9 de Coca': {
    category: 'Infusiones',
    description: 'Infusi\u00f3n elaborada con hoja de coca.',
    queEs: 'Infusi\u00f3n elaborada con hoja de coca.',
    paraQueSirve: 'Bebida tradicional andina.',
    beneficios: ['F\u00e1cil preparaci\u00f3n', 'Aroma caracter\u00edstico', 'Producto tradicional'],
    formaDeUso: 'Colocar una bolsita en agua caliente.',
    presentacion: 'Caja de 25 bolsitas',
    infoComplementaria: 'Hojas de coca seleccionadas de los valles del Cusco.'
  },
  'Pomada': {
    category: 'Cosm\u00e9tica',
    description: 'Pomada cosm\u00e9tica natural elaborada con arcilla.',
    queEs: 'Pomada cosm\u00e9tica natural elaborada con arcilla.',
    paraQueSirve: 'Uso cosm\u00e9tico externo.',
    beneficios: ['Ingredientes naturales', 'F\u00e1cil aplicaci\u00f3n', 'Producto artesanal'],
    formaDeUso: 'Aplicar sobre la piel seg\u00fan necesidad.',
    presentacion: 'Envase de 100g',
    infoComplementaria: 'Elaborada con arcilla natural y ingredientes org\u00e1nicos.'
  },
  'Eucalipto': {
    category: 'Aromaterapia',
    description: 'Aceite esencial concentrado de eucalipto.',
    queEs: 'Aceite esencial concentrado de eucalipto.',
    paraQueSirve: 'Uso arom\u00e1tico y cosm\u00e9tico.',
    beneficios: ['Aroma fresco', 'F\u00e1cil aplicaci\u00f3n', 'Producto natural'],
    formaDeUso: 'Utilizar seg\u00fan indicaciones del envase.',
    presentacion: 'Frasco de 30ml',
    infoComplementaria: 'Aceite esencial puro, sin aditivos.'
  },
  'Manzanilla': {
    category: 'Infusiones',
    description: 'Infusi\u00f3n natural de flores de manzanilla.',
    queEs: 'Infusi\u00f3n natural de flores de manzanilla.',
    paraQueSirve: 'Bebida tradicional de consumo diario.',
    beneficios: ['Aroma suave', 'F\u00e1cil preparaci\u00f3n', 'Producto natural'],
    formaDeUso: 'Preparar con agua caliente.',
    presentacion: 'Caja de 20 sobres',
    infoComplementaria: 'Flores de manzanilla seleccionadas.'
  },
  'Cal\u00e9ndula': {
    category: 'Cosm\u00e9tica',
    description: 'Crema hidratante elaborada con cal\u00e9ndula.',
    queEs: 'Crema hidratante elaborada con cal\u00e9ndula.',
    paraQueSirve: 'Cuidado e hidrataci\u00f3n de la piel.',
    beneficios: ['Textura suave', 'Uso diario', 'Ingredientes naturales'],
    formaDeUso: 'Aplicar sobre las manos limpias.',
    presentacion: 'Tubo de 75ml',
    infoComplementaria: 'F\u00f3rmula con extracto natural de cal\u00e9ndula.'
  }
};

function getProductImage(productName) {
  const map = [
    { key: 'Miel de Abeja', file: 'Miel de Abeja.png' },
    { key: 'Mu\u00f1a Andina', file: 'Mu\u00f1a Andina.png' },
    { key: 'Maca Negra en Polvo', file: 'Maca Negra en Polvo.png' },
    { key: 'Maca en Polvo', file: 'Maca en Polvo.png' },
    { key: 'Maca', file: 'Maca en Polvo.png' },
    { key: 'Quinua Real Org\u00e1nica', file: 'Quinua Real Org\u00e1nica.png' },
    { key: 'Quinua Premium', file: 'Quinua Premium.png' },
    { key: 'Quinua', file: 'Quinua Premium.png' },
    { key: 'U\u00f1a de Gato', file: 'U\u00f1a de Gato.png' },
    { key: 'T\u00e9 de Coca', file: 'T\u00e9 de Coca.png' },
    { key: 'Pomada Natural de Arcilla', file: 'Pomada Natural de Arcilla.png' },
    { key: 'Aceite Esencial de Eucalipto', file: 'Aceite Esencial de Eucalipto.png' },
    { key: 'Crema de Mano de Cal\u00e9ndula', file: 'Crema de Mano de Cal\u00e9ndula.png' },
    { key: 'Manzanilla', file: 'Manzanilla.png' },
    { key: 'Hierba Luisa', file: 'Hierba Luisa.png' },
    { key: 'Jarabe', file: 'Jarabe Natural.png' },
    { key: 'Prop\u00f3leo', file: 'Prop\u00f3leo.png' }
  ];
  const lower = productName.toLowerCase();
  for (const entry of map) {
    if (lower.includes(entry.key.toLowerCase())) {
      return 'imagenes_productos_fondo_logo/' + encodeURI(entry.file);
    }
  }
  return null;
}

function renderProducts() {
  const filtered = getFilteredProducts();
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  currentPage.products = Math.min(currentPage.products, totalPages);
  const start = (currentPage.products - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  document.getElementById('prodTotal').textContent = products.length;
  document.getElementById('prodLowStock').textContent = products.filter(p => p.estado === 'bajo_stock' || p.estado === 'agotado').length;
  document.getElementById('prodValue').textContent = 'S/ ' + formatCurrency(products.reduce((s, p) => s + p.precio * p.stock, 0));
  document.getElementById('prodCategories').textContent = new Set(products.map(p => p.categoria)).size;

  const catFilter = document.getElementById('filterCategory');
  const cats = [...new Set(products.map(p => p.categoria))];
  catFilter.innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map(c => '<option value="' + c + '"' + (c === productFilterCategory ? ' selected' : '') + '>' + c + '</option>').join('');

  const grid = document.getElementById('productsGrid');
  if (pageItems.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--on-surface-variant);"><span class="material-icons" style="font-size:48px;opacity:0.3;margin-bottom:16px;">inventory_2</span><p style="font-size:16px;font-weight:500;">No se encontraron productos</p><p style="font-size:14px;margin-top:4px;">Intenta con otros filtros o agrega un nuevo producto</p></div>';
  } else {
    grid.innerHTML = pageItems.map(p => {
      const imgSrc = p.image_url || getProductImage(p.nombre);
      const imgHtml = imgSrc
        ? '<img src="' + imgSrc + '" alt="' + p.nombre.replace(/"/g,'&quot;') + '" loading="lazy" onerror="this.outerHTML=\'<span class=material-icons placeholder-icon>eco</span>\'">'
        : '<span class="material-icons placeholder-icon">eco</span>';
      const badgeClass = p.estado === 'disponible' ? 'badge-success' : p.estado === 'bajo_stock' ? 'badge-warning' : 'badge-danger';
      const badgeText = p.estado === 'disponible' ? 'Disponible' : p.estado === 'bajo_stock' ? 'Stock Bajo' : 'Agotado';
      return '<div class="product-card">' +
        '<div class="product-card-image" onclick="openProductInfo(' + p.id + ')">' + imgHtml +
          '<div class="product-card-actions">' +
            '<button class="btn-edit" onclick="event.stopPropagation();editProduct(' + p.id + ')" title="Editar"><span class="material-icons">edit</span></button>' +
            '<button class="btn-delete" onclick="event.stopPropagation();deleteProduct(' + p.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="product-card-body">' +
          '<span class="product-card-category">' + p.categoria + '</span>' +
          '<h3 class="product-card-name"><a href="javascript:void(0)" onclick="openProductInfo(' + p.id + ')">' + p.nombre + '</a></h3>' +
          '<div class="product-card-footer">' +
            '<span class="product-card-price">S/ ' + formatCurrency(p.precio) + '</span>' +
            '<span class="product-card-stock">' + p.stock + ' und</span>' +
          '</div>' +
          '<div class="product-card-status">' +
            '<span class="badge ' + badgeClass + '"><span class="badge-dot"></span> ' + badgeText + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }
  document.getElementById('productPaginationInfo').textContent =
    'Mostrando ' + (filtered.length === 0 ? 0 : start + 1) + ' a ' + Math.min(start + PAGE_SIZE, filtered.length) + ' de ' + filtered.length + ' productos';
  renderPagination('productPagination', currentPage.products, totalPages, 'products');
}

function openProductModal(productId) {
  editingProductId = productId || null;
  const modal = document.getElementById('productModal');
  const title = document.getElementById('productModalTitle');
  const form = document.getElementById('productForm');
  form.reset();
  resetImagePreview();

  const catSelect = document.getElementById('prodCategory');
  catSelect.innerHTML = '<option value="">Seleccionar</option>' +
    categories.map(c => '<option value="' + c.nombre + '">' + c.nombre + '</option>').join('');

  if (editingProductId) {
    const p = products.find(pr => pr.id === editingProductId);
    if (!p) return;
    title.textContent = 'Editar Producto';
    document.getElementById('prodName').value = p.nombre;
    document.getElementById('prodCategory').value = p.categoria || '';
    document.getElementById('prodPrice').value = p.precio;
    document.getElementById('prodStock').value = p.stock;
    document.getElementById('prodMinStock').value = p.stock_minimo;
    document.getElementById('prodDesc').value = p.descripcion || '';
    if (p.image_url) {
      document.getElementById('prodImageUrl').value = p.image_url;
      updateImagePreview(p.image_url);
    }
  } else {
    title.textContent = 'Registrar Producto';
  }
  modal.classList.add('active');
}

function resetImagePreview() {
  const container = document.getElementById('imagePreviewContainer');
  const img = document.getElementById('imagePreview');
  container.style.display = 'none';
  container.classList.remove('has-image');
  img.src = '';
}

function updateImagePreview(url) {
  const container = document.getElementById('imagePreviewContainer');
  const img = document.getElementById('imagePreview');
  if (url && url.trim()) {
    img.src = url.trim();
    container.style.display = 'block';
    container.classList.add('has-image');
    img.onerror = function() {
      img.src = '';
      container.classList.remove('has-image');
      img.alt = 'Error al cargar imagen';
    };
    img.onload = function() {
      container.classList.add('has-image');
    };
  } else {
    resetImagePreview();
  }
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function openProductInfo(productId) {
  const p = products.find(pr => pr.id === productId);
  if (!p) return;
  const key = Object.keys(productInfoData).find(k => p.nombre.toLowerCase().includes(k.toLowerCase()));
  const info = key ? productInfoData[key] : null;
  if (!info) {
    showToast('Informaci\u00f3n no disponible para este producto.', 'info');
    return;
  }
  const imgSrc = p.image_url || getProductImage(p.nombre);
  const imgHtml = imgSrc
    ? '<img src="' + imgSrc + '" alt="' + p.nombre.replace(/"/g,'&quot;') + '" onerror="this.outerHTML=\'<span class=material-icons placeholder-icon style=font-size:64px;color:var(--primary);opacity:0.25;>eco</span>\'">'
    : '<span class="material-icons placeholder-icon">eco</span>';

  const badgeClass = p.estado === 'disponible' ? 'badge-success' : p.estado === 'bajo_stock' ? 'badge-warning' : 'badge-danger';
  const badgeText = p.estado === 'disponible' ? 'Disponible' : p.estado === 'bajo_stock' ? 'Stock Bajo' : 'Agotado';

  document.getElementById('productInfoImage').innerHTML =
    imgHtml +
    '<button class="product-info-close" onclick="closeProductInfo()"><span class="material-icons">close</span></button>';

  document.getElementById('productInfoBody').innerHTML =
    '<div class="product-info-header">' +
      '<span class="product-info-category">' + (p.categoria || 'General') + '</span>' +
      '<h2>' + p.nombre + '</h2>' +
      '<div class="product-info-price-row">' +
        '<span class="product-info-price">S/ ' + formatCurrency(p.precio) + '</span>' +
        '<span class="badge ' + badgeClass + '"><span class="badge-dot"></span> ' + badgeText + '</span>' +
        '<span style="font-size:14px;font-weight:500;color:var(--on-surface-variant);margin-left:auto;">Stock: ' + p.stock + ' und</span>' +
      '</div>' +
    '</div>' +
    '<p class="product-info-desc">' + info.description + '</p>' +
    '<div class="product-info-sections">' +
      '<div class="info-section"><h4>\u00bfQu\u00e9 es?</h4><p>' + info.queEs + '</p></div>' +
      '<div class="info-section"><h4>\u00bfPara qu\u00e9 sirve?</h4><p>' + info.paraQueSirve + '</p></div>' +
      '<div class="info-section"><h4>Beneficios principales</h4><ul class="product-info-benefits">' +
        info.beneficios.map(function(b) { return '<li>' + b + '</li>'; }).join('') +
      '</ul></div>' +
      '<div class="info-section"><h4>Forma de uso</h4><p>' + info.formaDeUso + '</p></div>' +
      '<div class="info-section"><h4>Presentaci\u00f3n</h4><p>' + info.presentacion + '</p></div>' +
      '<div class="info-section"><h4>Informaci\u00f3n complementaria</h4><p>' + info.infoComplementaria + '</p></div>' +
    '</div>' +
    '<button class="product-info-back" onclick="closeProductInfo()">Volver</button>';
  document.getElementById('productInfoOverlay').classList.add('active');
}

function closeProductInfo() {
  document.getElementById('productInfoOverlay').classList.remove('active');
}

function setupModals() {
  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const catName = document.getElementById('prodCategory').value;
    const cat = categories.find(c => c.nombre === catName);
    const imageUrl = document.getElementById('prodImageUrl').value.trim() || null;
    const data = {
      nombre: document.getElementById('prodName').value.trim(),
      categoria_id: cat ? cat.id : null,
      precio: parseFloat(document.getElementById('prodPrice').value) || 0,
      stock: parseInt(document.getElementById('prodStock').value) || 0,
      stock_minimo: parseInt(document.getElementById('prodMinStock').value) || 5,
      descripcion: document.getElementById('prodDesc').value.trim(),
      image_url: imageUrl
    };
    if (editingProductId) {
      await updateProduct(editingProductId, data);
    } else {
      await createProduct(data);
    }
    closeModal('productModal');
  });

  document.getElementById('movementForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      producto_id: parseInt(document.getElementById('movProduct').value),
      tipo_movimiento: document.getElementById('movType').value,
      cantidad: parseInt(document.getElementById('movQuantity').value) || 0,
      descripcion: document.getElementById('movDesc').value.trim()
    };
    await createMovement(data);
    closeModal('movementModal');
  });

  document.getElementById('categoryForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('catName').value.trim(),
      descripcion: document.getElementById('catDesc').value.trim()
    };
    if (editingCategoryId) {
      await updateCategory(editingCategoryId, data);
    } else {
      await createCategory(data);
    }
    closeModal('categoryModal');
  });

  document.getElementById('supplierForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('supName').value.trim(),
      contacto: document.getElementById('supContact').value.trim(),
      telefono: document.getElementById('supPhone').value.trim(),
      email: document.getElementById('supEmail').value.trim(),
      direccion: document.getElementById('supAddress').value.trim()
    };
    if (editingSupplierId) {
      await updateSupplier(editingSupplierId, data);
    } else {
      await createSupplier(data);
    }
    closeModal('supplierModal');
  });

  document.getElementById('clientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('cliName').value.trim(),
      tipo_documento: document.getElementById('cliDocType').value,
      numero_documento: document.getElementById('cliDocNum').value.trim(),
      telefono: document.getElementById('cliPhone').value.trim(),
      email: document.getElementById('cliEmail').value.trim(),
      direccion: document.getElementById('cliAddress').value.trim()
    };
    if (editingClientId) {
      await updateClient(editingClientId, data);
    } else {
      await createClient(data);
    }
    closeModal('clientModal');
  });

  document.getElementById('saleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await createSale();
    closeModal('saleModal');
  });

  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) el.classList.remove('active');
    });
  });

  document.getElementById('productInfoOverlay').addEventListener('click', function(e) {
    if (e.target === this) closeProductInfo();
  });

  document.getElementById('prodImageUrl').addEventListener('input', function(e) {
    updateImagePreview(e.target.value);
  });
}

async function createProduct(data) {
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabaseClient.from('productos').insert(data).select('*, categorias(nombre), proveedores(nombre)');
      if (error) throw error;
      if (inserted) products.unshift(normalizeProduct(inserted[0]));
    } catch (e) {
      showToast('Error al guardar en Supabase. Guardando localmente.', 'error');
      addLocalProduct(data);
    }
  } else {
    addLocalProduct(data);
  }
  showToast('Producto registrado correctamente', 'success');
  renderProducts();
  loadDashboard();
}

function addLocalProduct(data) {
  const newId = Math.max(...products.map(p => p.id), 0) + 1;
  const estado = data.stock === 0 ? 'agotado' : data.stock <= data.stock_minimo ? 'bajo_stock' : 'disponible';
  const cat = categories.find(c => c.id === data.categoria_id);
  products.unshift({
    id: newId,
    codigo: 'SKU-' + String(newId).padStart(4, '0'),
    ...data,
    image_url: data.image_url || null,
    categoria: cat ? cat.nombre : '',
    proveedor: '',
    estado,
    created_at: new Date().toISOString()
  });
}

async function updateProduct(id, data) {
  const updateData = { ...data };
  if (updateData.image_url === '') updateData.image_url = null;
  if (!isOffline) {
    try {
      const { error } = await supabaseClient.from('productos').update(updateData).eq('id', id);
      if (error) throw error;
    } catch (e) {
      showToast('Error al actualizar en Supabase.', 'error');
    }
  }
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    const cat = categories.find(c => c.id === data.categoria_id);
    products[idx] = { ...products[idx], ...updateData, categoria: cat ? cat.nombre : products[idx].categoria };
    products[idx].estado = data.stock === 0 ? 'agotado' : data.stock <= data.stock_minimo ? 'bajo_stock' : 'disponible';
  }
  showToast('Producto actualizado correctamente', 'success');
  renderProducts();
  loadDashboard();
}

async function deleteProduct(id) {
  const p = products.find(pr => pr.id === id);
  if (!confirm('¿Está seguro que desea eliminar "' + (p?.nombre || '') + '"?')) return;
  if (!isOffline) {
    try {
      await supabaseClient.from('movimientos_inventario').delete().eq('producto_id', id);
      await supabaseClient.from('productos').delete().eq('id', id);
    } catch (e) { showToast('Error al eliminar en Supabase.', 'error'); }
  }
  products = products.filter(pr => pr.id !== id);
  movements = movements.filter(m => m.producto_id !== id);
  showToast('Producto eliminado correctamente', 'success');
  renderProducts();
  loadDashboard();
  renderMovements();
}

function editProduct(id) { openProductModal(id); }

function renderCategories() {
  document.getElementById('catTotal').textContent = categories.length;
  document.getElementById('catProducts').textContent = products.filter(p => p.categoria_id).length;

  const tbody = document.getElementById('categoriesTableBody');
  if (categories.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay categorías registradas</td></tr>';
    return;
  }
  tbody.innerHTML = categories.map(c => {
    const count = products.filter(p => p.categoria === c.nombre || p.categoria_id === c.id).length;
    return '<tr>' +
      '<td style="font-size:14px;font-weight:600;">' + c.nombre + '</td>' +
      '<td style="font-size:14px;">' + (c.descripcion || '-') + '</td>' +
      '<td style="font-size:14px;font-weight:600;">' + count + '</td>' +
      '<td class="text-center"><div class="table-actions">' +
        '<button class="btn-edit" onclick="editCategory(' + c.id + ')" title="Editar"><span class="material-icons">edit</span></button>' +
        '<button class="btn-delete" onclick="deleteCategory(' + c.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
      '</div></td></tr>';
  }).join('');
}

function openCategoryModal(id) {
  editingCategoryId = id || null;
  const modal = document.getElementById('categoryModal');
  document.getElementById('categoryForm').reset();
  if (editingCategoryId) {
    const c = categories.find(cat => cat.id === editingCategoryId);
    if (!c) return;
    document.getElementById('categoryModalTitle').textContent = 'Editar Categoría';
    document.getElementById('catName').value = c.nombre;
    document.getElementById('catDesc').value = c.descripcion || '';
  } else {
    document.getElementById('categoryModalTitle').textContent = 'Registrar Categoría';
  }
  modal.classList.add('active');
}

function editCategory(id) { openCategoryModal(id); }

async function createCategory(data) {
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabaseClient.from('categorias').insert(data).select();
      if (error) throw error;
      if (inserted) categories.push(inserted[0]);
    } catch (e) { showToast('Error al guardar en Supabase.', 'error'); addLocalCategory(data); }
  } else { addLocalCategory(data); }
  showToast('Categoría registrada correctamente', 'success');
  renderCategories();
  loadDashboard();
}

function addLocalCategory(data) {
  const newId = Math.max(...categories.map(c => c.id), 0) + 1;
  categories.push({ id: newId, ...data, created_at: new Date().toISOString() });
}

async function updateCategory(id, data) {
  if (!isOffline) {
    try {
      await supabaseClient.from('categorias').update(data).eq('id', id);
    } catch (e) { showToast('Error al actualizar en Supabase.', 'error'); }
  }
  const idx = categories.findIndex(c => c.id === id);
  if (idx !== -1) categories[idx] = { ...categories[idx], ...data };
  showToast('Categoría actualizada correctamente', 'success');
  renderCategories();
}

async function deleteCategory(id) {
  if (!confirm('¿Está seguro de eliminar esta categoría?')) return;
  if (!isOffline) {
    try { await supabaseClient.from('categorias').delete().eq('id', id); } catch (e) { showToast('Error al eliminar.', 'error'); }
  }
  categories = categories.filter(c => c.id !== id);
  showToast('Categoría eliminada correctamente', 'success');
  renderCategories();
  loadDashboard();
}

function renderSuppliers() {
  document.getElementById('supTotal').textContent = suppliers.length;
  document.getElementById('supProducts').textContent = products.filter(p => p.proveedor_id).length;

  const tbody = document.getElementById('suppliersTableBody');
  if (suppliers.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay proveedores registrados</td></tr>';
    return;
  }
  tbody.innerHTML = suppliers.map(s =>
    '<tr><td style="font-size:14px;font-weight:600;">' + s.nombre + '</td>' +
    '<td style="font-size:14px;">' + (s.contacto || '-') + '</td>' +
    '<td style="font-size:14px;">' + (s.telefono || '-') + '</td>' +
    '<td style="font-size:14px;">' + (s.email || '-') + '</td>' +
    '<td style="font-size:14px;">' + (s.direccion || '-') + '</td>' +
    '<td class="text-center"><div class="table-actions">' +
      '<button class="btn-edit" onclick="editSupplier(' + s.id + ')" title="Editar"><span class="material-icons">edit</span></button>' +
      '<button class="btn-delete" onclick="deleteSupplier(' + s.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
    '</div></td></tr>'
  ).join('');
}

function openSupplierModal(id) {
  editingSupplierId = id || null;
  const modal = document.getElementById('supplierModal');
  document.getElementById('supplierForm').reset();
  if (editingSupplierId) {
    const s = suppliers.find(sup => sup.id === editingSupplierId);
    if (!s) return;
    document.getElementById('supplierModalTitle').textContent = 'Editar Proveedor';
    document.getElementById('supName').value = s.nombre;
    document.getElementById('supContact').value = s.contacto || '';
    document.getElementById('supPhone').value = s.telefono || '';
    document.getElementById('supEmail').value = s.email || '';
    document.getElementById('supAddress').value = s.direccion || '';
  } else {
    document.getElementById('supplierModalTitle').textContent = 'Registrar Proveedor';
  }
  modal.classList.add('active');
}

function editSupplier(id) { openSupplierModal(id); }

async function createSupplier(data) {
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabaseClient.from('proveedores').insert(data).select();
      if (error) throw error;
      if (inserted) suppliers.push(inserted[0]);
    } catch (e) { showToast('Error al guardar en Supabase.', 'error'); addLocalSupplier(data); }
  } else { addLocalSupplier(data); }
  showToast('Proveedor registrado correctamente', 'success');
  renderSuppliers();
  loadDashboard();
}

function addLocalSupplier(data) {
  const newId = Math.max(...suppliers.map(s => s.id), 0) + 1;
  suppliers.push({ id: newId, ...data, created_at: new Date().toISOString() });
}

async function updateSupplier(id, data) {
  if (!isOffline) {
    try { await supabaseClient.from('proveedores').update(data).eq('id', id); } catch (e) { showToast('Error al actualizar.', 'error'); }
  }
  const idx = suppliers.findIndex(s => s.id === id);
  if (idx !== -1) suppliers[idx] = { ...suppliers[idx], ...data };
  showToast('Proveedor actualizado correctamente', 'success');
  renderSuppliers();
}

async function deleteSupplier(id) {
  if (!confirm('¿Está seguro de eliminar este proveedor?')) return;
  if (!isOffline) {
    try { await supabaseClient.from('proveedores').delete().eq('id', id); } catch (e) { showToast('Error al eliminar.', 'error'); }
  }
  suppliers = suppliers.filter(s => s.id !== id);
  showToast('Proveedor eliminado correctamente', 'success');
  renderSuppliers();
  loadDashboard();
}

function renderClients() {
  document.getElementById('cliTotal').textContent = clients.length;
  document.getElementById('cliSales').textContent = sales.filter(s => s.cliente_id).length;

  const tbody = document.getElementById('clientsTableBody');
  if (clients.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay clientes registrados</td></tr>';
    return;
  }
  tbody.innerHTML = clients.map(c =>
    '<tr><td style="font-size:14px;font-weight:600;">' + c.nombre + '</td>' +
    '<td style="font-size:14px;">' + (c.tipo_documento || 'DNI') + ': ' + (c.numero_documento || '-') + '</td>' +
    '<td style="font-size:14px;">' + (c.telefono || '-') + '</td>' +
    '<td style="font-size:14px;">' + (c.email || '-') + '</td>' +
    '<td style="font-size:14px;">' + (c.direccion || '-') + '</td>' +
    '<td class="text-center"><div class="table-actions">' +
      '<button class="btn-edit" onclick="editClient(' + c.id + ')" title="Editar"><span class="material-icons">edit</span></button>' +
      '<button class="btn-delete" onclick="deleteClient(' + c.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
    '</div></td></tr>'
  ).join('');
}

function openClientModal(id) {
  editingClientId = id || null;
  const modal = document.getElementById('clientModal');
  document.getElementById('clientForm').reset();
  if (editingClientId) {
    const c = clients.find(cli => cli.id === editingClientId);
    if (!c) return;
    document.getElementById('clientModalTitle').textContent = 'Editar Cliente';
    document.getElementById('cliName').value = c.nombre;
    document.getElementById('cliDocType').value = c.tipo_documento || 'DNI';
    document.getElementById('cliDocNum').value = c.numero_documento || '';
    document.getElementById('cliPhone').value = c.telefono || '';
    document.getElementById('cliEmail').value = c.email || '';
    document.getElementById('cliAddress').value = c.direccion || '';
  } else {
    document.getElementById('clientModalTitle').textContent = 'Registrar Cliente';
  }
  modal.classList.add('active');
}

function editClient(id) { openClientModal(id); }

async function createClient(data) {
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabaseClient.from('clientes').insert(data).select();
      if (error) throw error;
      if (inserted) clients.push(inserted[0]);
    } catch (e) { showToast('Error al guardar en Supabase.', 'error'); addLocalClient(data); }
  } else { addLocalClient(data); }
  showToast('Cliente registrado correctamente', 'success');
  renderClients();
  loadDashboard();
}

function addLocalClient(data) {
  const newId = Math.max(...clients.map(c => c.id), 0) + 1;
  clients.push({ id: newId, ...data, created_at: new Date().toISOString() });
}

async function updateClient(id, data) {
  if (!isOffline) {
    try { await supabaseClient.from('clientes').update(data).eq('id', id); } catch (e) { showToast('Error al actualizar.', 'error'); }
  }
  const idx = clients.findIndex(c => c.id === id);
  if (idx !== -1) clients[idx] = { ...clients[idx], ...data };
  showToast('Cliente actualizado correctamente', 'success');
  renderClients();
}

async function deleteClient(id) {
  if (!confirm('¿Está seguro de eliminar este cliente?')) return;
  if (!isOffline) {
    try { await supabaseClient.from('clientes').delete().eq('id', id); } catch (e) { showToast('Error al eliminar.', 'error'); }
  }
  clients = clients.filter(c => c.id !== id);
  showToast('Cliente eliminado correctamente', 'success');
  renderClients();
  loadDashboard();
}

function renderSales() {
  const totalSalesToday = sales.filter(s => isToday(new Date(s.created_at))).length;
  const todayRevenue = sales.filter(s => isToday(new Date(s.created_at))).reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0);
  const totalPages = Math.ceil(totalSales / PAGE_SIZE) || 1;
  currentPage.sales = Math.min(currentPage.sales, totalPages);
  const start = (currentPage.sales - 1) * PAGE_SIZE;
  const pageItems = sales.slice(start, start + PAGE_SIZE);

  document.getElementById('saleToday').textContent = totalSalesToday;
  document.getElementById('saleRevenue').textContent = 'S/ ' + formatCurrency(todayRevenue);
  document.getElementById('saleTotal').textContent = totalSales;
  document.getElementById('saleTotalRevenue').textContent = 'S/ ' + formatCurrency(totalRevenue);
  document.getElementById('saleCount').textContent = 'Mostrando todas las ventas (' + totalSales + ')';

  const tbody = document.getElementById('salesTableBody');
  if (pageItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay ventas registradas</td></tr>';
  } else {
    tbody.innerHTML = pageItems.map(s => {
      const clienteNombre = s.clientes?.nombre || clients.find(c => c.id === s.cliente_id)?.nombre || 'Sin cliente';
      return '<tr>' +
        '<td style="font-size:14px;font-weight:600;">' + (s.numero_comprobante || 'N/A') + '</td>' +
        '<td style="font-size:14px;">' + clienteNombre + '</td>' +
        '<td class="text-right" style="font-size:14px;font-weight:600;">S/ ' + formatCurrency(parseFloat(s.total) || 0) + '</td>' +
        '<td><span class="category-tag">' + s.tipo_comprobante + '</span></td>' +
        '<td style="font-size:14px;">' + formatDate(s.created_at) + '</td>' +
        '<td class="text-center"><div class="table-actions">' +
          '<button class="btn-edit" onclick="viewSaleDetail(' + s.id + ')" title="Ver detalle"><span class="material-icons">receipt</span></button>' +
          '<button class="btn-delete" onclick="deleteSale(' + s.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
        '</div></td></tr>';
    }).join('');
  }
  document.getElementById('salePaginationInfo').textContent =
    'Mostrando ' + (totalSales === 0 ? 0 : start + 1) + ' a ' + Math.min(start + PAGE_SIZE, totalSales) + ' de ' + totalSales + ' ventas';
  renderPagination('salePagination', currentPage.sales, totalPages, 'sales');
}

function viewSaleDetail(saleId) {
  const modal = document.getElementById('saleDetailModal');
  const sale = sales.find(s => s.id === saleId);
  if (!sale) return;
  const clienteNombre = sale.clientes?.nombre || clients.find(c => c.id === sale.cliente_id)?.nombre || 'Sin cliente';
  document.getElementById('saleDetailInfo').innerHTML =
    '<div><strong>Comprobante:</strong> ' + (sale.numero_comprobante || 'N/A') + '</div>' +
    '<div><strong>Cliente:</strong> ' + clienteNombre + '</div>' +
    '<div><strong>Fecha:</strong> ' + formatDate(sale.created_at) + '</div>' +
    '<div><strong>Total:</strong> S/ ' + formatCurrency(parseFloat(sale.total) || 0) + '</div>';
  const details = saleDetails.filter(d => d.venta_id === saleId);
  const tbody = document.getElementById('saleDetailBody');
  if (details.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;padding:16px;color:var(--on-surface-variant);">Sin detalle</td></tr>';
  } else {
    tbody.innerHTML = details.map(d => {
      const prodName = d.productos?.nombre || products.find(p => p.id === d.producto_id)?.nombre || 'Producto';
      return '<tr><td>' + prodName + '</td><td class="text-right">' + d.cantidad + '</td><td class="text-right">S/ ' + formatCurrency(parseFloat(d.precio_unitario) || 0) + '</td><td class="text-right">S/ ' + formatCurrency(parseFloat(d.subtotal) || 0) + '</td></tr>';
    }).join('');
    tbody.innerHTML += '<tr style="font-weight:700;border-top:2px solid var(--primary);"><td colspan="3" class="text-right">Total</td><td class="text-right">S/ ' + formatCurrency(parseFloat(sale.total) || 0) + '</td></tr>';
  }
  modal.classList.add('active');
}

async function deleteSale(id) {
  if (!confirm('¿Está seguro de eliminar esta venta? Se eliminarán también los detalles.')) return;
  if (!isOffline) {
    try {
      await supabaseClient.from('detalle_ventas').delete().eq('venta_id', id);
      await supabaseClient.from('ventas').delete().eq('id', id);
    } catch (e) { showToast('Error al eliminar en Supabase.', 'error'); }
  }
  saleDetails = saleDetails.filter(d => d.venta_id !== id);
  sales = sales.filter(s => s.id !== id);
  showToast('Venta eliminada correctamente', 'success');
  renderSales();
  loadDashboard();
}

function openSaleModal() {
  if (clients.length === 0) {
    showToast('Registre un cliente primero.', 'info');
    return;
  }
  if (products.length === 0) {
    showToast('Registre un producto primero.', 'info');
    return;
  }
  const modal = document.getElementById('saleModal');
  document.getElementById('saleForm').reset();

  const clientSelect = document.getElementById('saleClient');
  clientSelect.innerHTML = '<option value="">Seleccionar cliente</option>' +
    clients.map(c => '<option value="' + c.id + '">' + c.nombre + (c.numero_documento ? ' (' + c.numero_documento + ')' : '') + '</option>').join('');

  const container = document.getElementById('saleDetailsContainer');
  container.innerHTML = getSaleDetailRowHtml(0);
  updateSaleTotal();
  modal.classList.add('active');
}

let saleDetailRowCount = 0;

function getSaleDetailRowHtml(index) {
  return '<div class="sale-detail-row" style="display:grid;grid-template-columns:2fr 1fr 1fr 1fr auto;gap:8px;align-items:end;">' +
    '<div class="form-group"><label>Producto</label><select class="sale-product" onchange="onSaleProductChange(this)" required>' +
      '<option value="">Seleccionar</option>' +
      products.map(p => '<option value="' + p.id + '" data-precio="' + p.precio + '">' + p.nombre + ' (Stock: ' + p.stock + ')</option>').join('') +
    '</select></div>' +
    '<div class="form-group"><label>Cant.</label><input type="number" class="sale-qty" value="1" min="1" onchange="updateSaleTotal()" required></div>' +
    '<div class="form-group"><label>P. Unit.</label><input type="text" class="sale-price" readonly style="background:var(--surface-container-low);"></div>' +
    '<div class="form-group"><label>Subtotal</label><input type="text" class="sale-subtotal" readonly style="background:var(--surface-container-low);"></div>' +
    '<button type="button" class="btn btn-icon" onclick="removeSaleDetailRow(this)" style="margin-bottom:4px;color:var(--error);"><span class="material-icons">remove_circle</span></button>' +
  '</div>';
}

function addSaleDetailRow() {
  const container = document.getElementById('saleDetailsContainer');
  container.insertAdjacentHTML('beforeend', getSaleDetailRowHtml());
}

function removeSaleDetailRow(btn) {
  const container = document.getElementById('saleDetailsContainer');
  if (container.children.length <= 1) {
    showToast('Debe tener al menos un producto.', 'info');
    return;
  }
  btn.closest('.sale-detail-row').remove();
  updateSaleTotal();
}

function onSaleProductChange(select) {
  const option = select.options[select.selectedIndex];
  const precio = option ? parseFloat(option.dataset.precio) || 0 : 0;
  const row = select.closest('.sale-detail-row');
  row.querySelector('.sale-price').value = 'S/ ' + formatCurrency(precio);
  updateSaleTotal();
}

function updateSaleTotal() {
  let total = 0;
  document.querySelectorAll('.sale-detail-row').forEach(row => {
    const select = row.querySelector('.sale-product');
    const qty = parseInt(row.querySelector('.sale-qty').value) || 0;
    const option = select.options[select.selectedIndex];
    const precio = option ? parseFloat(option.dataset.precio) || 0 : 0;
    const subtotal = qty * precio;
    row.querySelector('.sale-price').value = 'S/ ' + formatCurrency(precio);
    row.querySelector('.sale-subtotal').value = 'S/ ' + formatCurrency(subtotal);
    total += subtotal;
  });
  document.getElementById('saleTotalDisplay').textContent = 'S/ ' + formatCurrency(total);
}

async function createSale() {
  const cliente_id = parseInt(document.getElementById('saleClient').value);
  if (!cliente_id) { showToast('Seleccione un cliente.', 'error'); return; }
  const tipo_comprobante = document.getElementById('saleDocType').value;

  const rows = [];
  document.querySelectorAll('.sale-detail-row').forEach(row => {
    const producto_id = parseInt(row.querySelector('.sale-product').value);
    const cantidad = parseInt(row.querySelector('.sale-qty').value) || 0;
    const option = row.querySelector('.sale-product').options[row.querySelector('.sale-product').selectedIndex];
    const precio = option ? parseFloat(option.dataset.precio) || 0 : 0;
    if (producto_id && cantidad > 0) {
      rows.push({ producto_id, cantidad, precio_unitario: precio, subtotal: cantidad * precio });
    }
  });
  if (rows.length === 0) { showToast('Agregue al menos un producto.', 'error'); return; }
  const total = rows.reduce((s, r) => s + r.subtotal, 0);

  if (!isOffline) {
    try {
      const { data: venta, error: ventaError } = await supabaseClient.from('ventas').insert({
        cliente_id, tipo_comprobante, total
      }).select();
      if (ventaError) throw ventaError;
      if (venta && venta[0]) {
        const detalles = rows.map(r => ({ ...r, venta_id: venta[0].id }));
        const { error: detError } = await supabaseClient.from('detalle_ventas').insert(detalles);
        if (detError) throw detError;
        for (const r of rows) {
          await supabaseClient.from('movimientos_inventario').insert({
            producto_id: r.producto_id, tipo_movimiento: 'salida',
            cantidad: r.cantidad, descripcion: 'Venta #' + venta[0].numero_comprobante
          });
        }
        const { data: fullVenta } = await supabaseClient.from('ventas').select('*, clientes(nombre)').eq('id', venta[0].id).single();
        if (fullVenta) sales.unshift(fullVenta);
        const detailInserts = detalles.map(d => ({ ...d, productos: products.find(p => p.id === d.producto_id) ? { nombre: products.find(p => p.id === d.producto_id).nombre } : {} }));
        saleDetails.unshift(...detailInserts);
      }
    } catch (e) { showToast('Error al registrar venta en Supabase.', 'error'); addLocalSale(cliente_id, tipo_comprobante, total, rows); }
  } else { addLocalSale(cliente_id, tipo_comprobante, total, rows); }
  showToast('Venta registrada correctamente', 'success');
  renderSales();
  loadDashboard();
  renderProducts();
}

function addLocalSale(cliente_id, tipo_comprobante, total, rows) {
  const newId = Math.max(...sales.map(s => s.id), 0) + 1;
  const cli = clients.find(c => c.id === cliente_id);
  const now = new Date().toISOString();
  const comprobante = 'V' + now.substring(0, 10).replace(/-/g, '') + '-' + String(newId).padStart(4, '0');
  sales.unshift({
    id: newId, cliente_id, total, tipo_comprobante, numero_comprobante: comprobante, created_at: now,
    clientes: cli ? { nombre: cli.nombre } : { nombre: 'Sin cliente' }
  });
  rows.forEach((r, i) => {
    const prod = products.find(p => p.id === r.producto_id);
    saleDetails.unshift({
      id: Date.now() + i, venta_id: newId, ...r,
      productos: prod ? { nombre: prod.nombre } : { nombre: 'Producto' }
    });
    if (prod) {
      prod.stock = Math.max(prod.stock - r.cantidad, 0);
      prod.estado = prod.stock === 0 ? 'agotado' : prod.stock <= prod.stock_minimo ? 'bajo_stock' : 'disponible';
    }
  });
}

function renderMovements() {
  const totalPages = Math.ceil(movements.length / PAGE_SIZE) || 1;
  currentPage.movements = Math.min(currentPage.movements, totalPages);
  const start = (currentPage.movements - 1) * PAGE_SIZE;
  const pageItems = movements.slice(start, start + PAGE_SIZE);

  const entries = movements.filter(m => m.tipo_movimiento === 'entrada').reduce((s, m) => s + m.cantidad, 0);
  const exits = movements.filter(m => m.tipo_movimiento === 'salida').reduce((s, m) => s + m.cantidad, 0);
  document.getElementById('invEntries').textContent = entries;
  document.getElementById('invExits').textContent = exits;
  document.getElementById('invTotal').textContent = movements.length;

  const tbody = document.getElementById('movementsTableBody');
  if (pageItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay movimientos registrados</td></tr>';
    return;
  }
  tbody.innerHTML = pageItems.map(m => {
    const prodName = m.productos?.nombre || products.find(p => p.id === m.producto_id)?.nombre || 'Producto';
    const isEntry = m.tipo_movimiento === 'entrada';
    return '<tr>' +
      '<td style="font-size:14px;">' + formatDate(m.fecha_movimiento) + '</td>' +
      '<td style="font-size:14px;font-weight:600;">' + prodName + '</td>' +
      '<td><span class="badge ' + (isEntry ? 'badge-success' : 'badge-warning') + '"><span class="badge-dot"></span> ' + (isEntry ? 'Entrada' : 'Salida') + '</span></td>' +
      '<td class="text-right" style="font-size:14px;font-weight:600;color:' + (isEntry ? 'var(--primary)' : 'var(--error)') + ';">' + (isEntry ? '+' : '-') + m.cantidad + ' und</td>' +
      '<td style="font-size:14px;">' + (m.descripcion || '-') + '</td>' +
      '</tr>';
  }).join('');
  document.getElementById('movementCount').textContent = 'Mostrando todos los movimientos (' + movements.length + ')';
  document.getElementById('movementPaginationInfo').textContent =
    'Mostrando ' + (movements.length === 0 ? 0 : start + 1) + ' a ' + Math.min(start + PAGE_SIZE, movements.length) + ' de ' + movements.length + ' movimientos';
  renderPagination('movementPagination', currentPage.movements, totalPages, 'movements');
}

async function openMovementModal() {
  if (products.length === 0) {
    showToast('No hay productos registrados. Cree un producto primero.', 'info');
    return;
  }
  const select = document.getElementById('movProduct');
  select.innerHTML = '<option value="">Seleccionar producto</option>' +
    products.map(p => '<option value="' + p.id + '">' + p.nombre + ' (Stock: ' + p.stock + ')</option>').join('');
  document.getElementById('movementForm').reset();
  document.getElementById('movementModal').classList.add('active');
}

async function createMovement(data) {
  if (data.cantidad <= 0) { showToast('La cantidad debe ser mayor a 0', 'error'); return; }
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabaseClient.from('movimientos_inventario').insert(data).select();
      if (error) throw error;
      if (inserted) movements.unshift(inserted[0]);
    } catch (e) { showToast('Error al registrar en Supabase.', 'error'); addLocalMovement(data); }
  } else { addLocalMovement(data); }
  showToast('Movimiento registrado correctamente', 'success');
  renderMovements();
  loadDashboard();
}

function addLocalMovement(data) {
  const prod = products.find(p => p.id === data.producto_id);
  if (!prod) return;
  const newId = Math.max(...movements.map(m => m.id), 0) + 1;
  movements.unshift({
    id: newId, ...data, fecha_movimiento: new Date().toISOString(),
    productos: { nombre: prod.nombre }
  });
  if (data.tipo_movimiento === 'entrada') {
    prod.stock += data.cantidad;
  } else {
    prod.stock = Math.max(prod.stock - data.cantidad, 0);
  }
  prod.estado = prod.stock === 0 ? 'agotado' : prod.stock <= prod.stock_minimo ? 'bajo_stock' : 'disponible';
}

function loadReports() {
  const total = products.length;
  const lowStock = products.filter(p => p.estado === 'bajo_stock').length;
  const outOfStock = products.filter(p => p.estado === 'agotado').length;
  const totalValue = products.reduce((s, p) => s + p.precio * p.stock, 0);

  document.getElementById('repTotalProducts').textContent = total;
  document.getElementById('repLowStock').textContent = lowStock;
  document.getElementById('repOutOfStock').textContent = outOfStock;
  document.getElementById('repTotalValue').textContent = 'S/ ' + formatCurrency(totalValue);

  const lowItems = products.filter(p => p.estado === 'bajo_stock' || p.estado === 'agotado');
  const tbody = document.getElementById('repLowStockTable');
  if (lowItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No hay productos con stock bajo</td></tr>';
  } else {
    tbody.innerHTML = lowItems.map(p =>
      '<tr><td style="font-size:14px;font-weight:600;">' + p.nombre + '</td>' +
      '<td class="text-right" style="font-size:14px;font-weight:600;color:' + (p.estado === 'agotado' ? 'var(--error)' : 'var(--on-surface)') + ';">' + p.stock + '</td>' +
      '<td class="text-right" style="font-size:14px;">' + p.stock_minimo + '</td></tr>'
    ).join('');
  }

  const container = document.getElementById('reportCategoryBars');
  const cats = {};
  products.forEach(p => { cats[p.categoria] = (cats[p.categoria] || 0) + 1; });
  const entries = Object.entries(cats);
  const max = Math.max(...entries.map(([,v]) => v), 1);
  container.innerHTML = entries.map(([cat, count]) => {
    const pct = (count / max) * 100;
    return '<div class="cat-bar">' +
      '<span class="cat-bar-label">' + cat + '</span>' +
      '<div class="cat-bar-track"><div class="cat-bar-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="cat-bar-count">' + count + '</span></div>';
  }).join('') || '<p style="color:var(--on-surface-variant);padding:16px;">Sin productos</p>';
}

function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

function setupProfileLogout() {
  document.getElementById('profileLogoutBtn').addEventListener('click', () => { logout(); });
}

function logout() {
  document.getElementById('appShell').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
  window.location.hash = '';
}

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
});

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

function formatCurrency(value) {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderPagination(containerId, current, total, type) {
  const container = document.getElementById(containerId);
  if (!container || total <= 1) { if (container) container.innerHTML = ''; return; }
  let html = '<button class="pagination-btn"' + (current <= 1 ? ' disabled' : '') + ' onclick="goToPage(\'' + type + '\', ' + (current - 1) + ')">' +
    '<span class="material-icons" style="font-size:20px;">chevron_left</span></button>';
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      html += '<button class="pagination-btn' + (i === current ? ' active' : '') + '" onclick="goToPage(\'' + type + '\', ' + i + ')">' + i + '</button>';
    } else if (i === current - 2 || i === current + 2) {
      html += '<button class="pagination-btn" disabled>...</button>';
    }
  }
  html += '<button class="pagination-btn"' + (current >= total ? ' disabled' : '') + ' onclick="goToPage(\'' + type + '\', ' + (current + 1) + ')">' +
    '<span class="material-icons" style="font-size:20px;">chevron_right</span></button>';
  container.innerHTML = html;
}

function goToPage(type, page) {
  currentPage[type] = page;
  if (type === 'products') renderProducts();
  else if (type === 'sales') renderSales();
  else renderMovements();
}

function showToast(message, type) {
  if (!type) type = 'success';
  const container = document.getElementById('toastContainer');
  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="material-icons" style="font-size:20px;">' + (icons[type] || 'info') + '</span> ' + message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
