// ============================================
// NaturaStock Cusco - Application Logic
// ============================================

// --- Supabase Client ---
let supabase = null;
let isOffline = false;

function initSupabase() {
  try {
    const lib = typeof supabaseClient !== 'undefined' ? supabaseClient : window.supabase;
    if (!lib || SUPABASE_CONFIG.url.includes('tu-proyecto')) {
      isOffline = true;
      return;
    }
    supabase = lib.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
    isOffline = false;
  } catch (e) {
    isOffline = true;
  }
}

// --- State ---
let products = [];
let movements = [];
let currentPage = { products: 1, movements: 1 };
const PAGE_SIZE = 10;
let editingProductId = null;
let productFilterCategory = '';
let productFilterStatus = '';

// --- DOM Ready ---
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  setupLogin();
  setupRouting();
  setupLogout();
  setupProductFilters();
  setupGlobalSearch();
  setupModals();
  setupProfileLogout();

  if (isOffline) {
    loadExampleData();
  }
});

// ============================================
// LOGIN
// ============================================
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
    inp.addEventListener('focus', () => {
      inp.parentElement.style.transform = 'scale(1.01)';
    });
    inp.addEventListener('blur', () => {
      inp.parentElement.style.transform = '';
    });
  });
}

// ============================================
// SPA ROUTING
// ============================================
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
    case 'inventory': renderMovements(); break;
    case 'reports': loadReports(); break;
  }
}

// ============================================
// DATA LOADING
// ============================================
async function loadData() {
  if (isOffline) {
    loadExampleData();
    return;
  }
  try {
    const [prodRes, movRes] = await Promise.all([
      supabase.from('productos').select('*').order('created_at', { ascending: false }),
      supabase.from('movimientos_inventario').select('*, productos(nombre)').order('fecha_movimiento', { ascending: false })
    ]);
    if (prodRes.data) products = prodRes.data;
    if (movRes.data) movements = movRes.data;
  } catch (e) {
    showToast('Error al conectar con Supabase. Usando datos de ejemplo.', 'error');
    loadExampleData();
    isOffline = true;
  }
  renderProducts();
  renderMovements();
  loadDashboard();
  loadReports();
}

function loadExampleData() {
  products = [
    { id: 1, nombre: 'Miel de Abeja Pura 500ml', categoria: 'Mieles', precio: 25.00, stock: 120, stock_minimo: 10, descripcion: 'Miel de abeja 100% natural de los valles de Cusco.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 2, nombre: 'Muña Andina 100g', categoria: 'Hierbas', precio: 8.50, stock: 200, stock_minimo: 15, descripcion: 'Hierba aromática andina tradicional.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 3, nombre: 'Maca Negra en Polvo 250g', categoria: 'Suplementos', precio: 18.00, stock: 5, stock_minimo: 8, descripcion: 'Maca negra orgánica de Junín.', estado: 'bajo_stock', created_at: new Date().toISOString() },
    { id: 4, nombre: 'Quinua Real Orgánica 1kg', categoria: 'Suplementos', precio: 12.00, stock: 0, stock_minimo: 10, descripcion: 'Quinua real orgánica del Altiplano.', estado: 'agotado', created_at: new Date().toISOString() },
    { id: 5, nombre: 'Uña de Gato Corteza 150g', categoria: 'Medicinales', precio: 15.00, stock: 60, stock_minimo: 5, descripcion: 'Corteza de uña de gato amazónica.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 6, nombre: 'Té de Coca 25 bolsitas', categoria: 'Infusiones', precio: 6.50, stock: 300, stock_minimo: 20, descripcion: 'Té de hoja de coca tradicional.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 7, nombre: 'Pomada Natural de Arcilla 100g', categoria: 'Cosmética natural', precio: 22.00, stock: 30, stock_minimo: 5, descripcion: 'Pomada de arcilla con hierbas andinas.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 8, nombre: 'Aceite Esencial de Eucalipto 30ml', categoria: 'Medicinales', precio: 28.00, stock: 2, stock_minimo: 5, descripcion: 'Aceite esencial puro de eucalipto.', estado: 'bajo_stock', created_at: new Date().toISOString() },
    { id: 9, nombre: 'Infusión de Manzanilla 20 sobres', categoria: 'Infusiones', precio: 5.00, stock: 250, stock_minimo: 15, descripcion: 'Manzanilla orgánica del Valle Sagrado.', estado: 'disponible', created_at: new Date().toISOString() },
    { id: 10, nombre: 'Crema de Mano de Caléndula 75ml', categoria: 'Cosmética natural', precio: 19.00, stock: 40, stock_minimo: 8, descripcion: 'Crema hidratante con caléndula y aceites naturales.', estado: 'disponible', created_at: new Date().toISOString() }
  ];
  movements = [
    { id: 1, producto_id: 1, tipo_movimiento: 'entrada', cantidad: 50, descripcion: 'Reabastecimiento semanal', fecha_movimiento: new Date(Date.now() - 3600000).toISOString(), productos: { nombre: 'Miel de Abeja Pura 500ml' } },
    { id: 2, producto_id: 4, tipo_movimiento: 'salida', cantidad: 10, descripcion: 'Despacho a tienda principal', fecha_movimiento: new Date(Date.now() - 7200000).toISOString(), productos: { nombre: 'Quinua Real Orgánica 1kg' } },
    { id: 3, producto_id: 2, tipo_movimiento: 'entrada', cantidad: 30, descripcion: 'Nueva cosecha', fecha_movimiento: new Date(Date.now() - 10800000).toISOString(), productos: { nombre: 'Muña Andina 100g' } },
    { id: 4, producto_id: 6, tipo_movimiento: 'salida', cantidad: 45, descripcion: 'Pedido distribuidor', fecha_movimiento: new Date(Date.now() - 14400000).toISOString(), productos: { nombre: 'Té de Coca 25 bolsitas' } },
    { id: 5, producto_id: 3, tipo_movimiento: 'entrada', cantidad: 20, descripcion: 'Reabastecimiento de maca', fecha_movimiento: new Date(Date.now() - 18000000).toISOString(), productos: { nombre: 'Maca Negra en Polvo 250g' } }
  ];
  renderProducts();
  renderMovements();
  loadDashboard();
  loadReports();
}

// ============================================
// DASHBOARD
// ============================================
function loadDashboard() {
  const total = products.length;
  const lowStock = products.filter(p => p.estado === 'bajo_stock').length;
  const outOfStock = products.filter(p => p.estado === 'agotado').length;
  const totalValue = products.reduce((sum, p) => sum + (p.precio * p.stock), 0);
  const totalMovements = movements.length;
  const daySales = movements
    .filter(m => m.tipo_movimiento === 'salida' && isToday(new Date(m.fecha_movimiento)))
    .reduce((sum, m) => sum + (m.cantidad * getPrice(m.producto_id)), 0);

  document.getElementById('dashTotalProducts').textContent = total;
  document.getElementById('dashLowStock').textContent = lowStock;
  document.getElementById('dashOutOfStock').textContent = outOfStock;
  document.getElementById('dashTotalValue').textContent = 'S/ ' + formatCurrency(totalValue);
  document.getElementById('dashTotalMovements').textContent = totalMovements;
  document.getElementById('dashDaySales').textContent = 'S/ ' + formatCurrency(daySales);

  document.getElementById('dashProdTrend').textContent = total + ' total';
  document.getElementById('dashLowStockTrend').textContent = lowStock + ' críticos';
  document.getElementById('dashOutTrend').textContent = outOfStock + ' agotados';
  document.getElementById('dashValueTrend').textContent = 'S/ ' + formatCurrency(totalValue);
  document.getElementById('dashSalesTrend').textContent = 'S/ ' + formatCurrency(daySales);

  renderCategoryChart();
  renderDashMovements();
}

function isToday(date) {
  const now = new Date();
  return date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
}

function getPrice(productId) {
  const p = products.find(pr => pr.id === productId);
  return p ? p.precio : 0;
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

// ============================================
// PRODUCTS CRUD
// ============================================
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

  const tbody = document.getElementById('productsTableBody');
  if (pageItems.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:24px;color:var(--on-surface-variant);">No se encontraron productos</td></tr>';
  } else {
    tbody.innerHTML = pageItems.map(p => {
      const icons = ['eco', 'grass', 'spa', 'local_florist', 'psychology_alt', 'water_drop', 'science', 'filter_vintage', 'grain', 'park'];
      const icon = icons[p.id % icons.length];
      const badgeClass = p.estado === 'disponible' ? 'badge-success' : p.estado === 'bajo_stock' ? 'badge-warning' : 'badge-danger';
      const badgeText = p.estado === 'disponible' ? 'Disponible' : p.estado === 'bajo_stock' ? 'Stock Bajo' : 'Agotado';
      return '<tr>' +
        '<td><div class="table-product-cell"><div class="table-product-icon"><span class="material-icons">' + icon + '</span></div><div class="table-product-info"><p>' + p.nombre + '</p><p>SKU-' + String(p.id).padStart(4, '0') + '</p></div></div></td>' +
        '<td><span class="category-tag">' + p.categoria + '</span></td>' +
        '<td class="text-right" style="font-size:14px;font-weight:600;">S/ ' + formatCurrency(p.precio) + '</td>' +
        '<td class="text-right" style="font-size:14px;font-weight:600;">' + p.stock + '</td>' +
        '<td><span class="badge ' + badgeClass + '"><span class="badge-dot"></span> ' + badgeText + '</span></td>' +
        '<td class="text-center"><div class="table-actions">' +
          '<button class="btn-edit" onclick="editProduct(' + p.id + ')" title="Editar"><span class="material-icons">edit</span></button>' +
          '<button class="btn-delete" onclick="deleteProduct(' + p.id + ')" title="Eliminar"><span class="material-icons">delete</span></button>' +
        '</div></td></tr>';
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

  if (editingProductId) {
    const p = products.find(pr => pr.id === editingProductId);
    if (!p) return;
    title.textContent = 'Editar Producto';
    document.getElementById('prodName').value = p.nombre;
    document.getElementById('prodCategory').value = p.categoria;
    document.getElementById('prodPrice').value = p.precio;
    document.getElementById('prodStock').value = p.stock;
    document.getElementById('prodMinStock').value = p.stock_minimo;
    document.getElementById('prodDesc').value = p.descripcion || '';
  } else {
    title.textContent = 'Registrar Producto';
  }
  modal.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('active');
}

function setupModals() {
  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
      nombre: document.getElementById('prodName').value.trim(),
      categoria: document.getElementById('prodCategory').value,
      precio: parseFloat(document.getElementById('prodPrice').value) || 0,
      stock: parseInt(document.getElementById('prodStock').value) || 0,
      stock_minimo: parseInt(document.getElementById('prodMinStock').value) || 5,
      descripcion: document.getElementById('prodDesc').value.trim()
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

  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) el.classList.remove('active');
    });
  });
}

async function createProduct(data) {
  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabase.from('productos').insert(data).select();
      if (error) throw error;
      if (inserted) products.unshift(inserted[0]);
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
  products.unshift({ id: newId, ...data, estado, created_at: new Date().toISOString() });
}

async function updateProduct(id, data) {
  if (!isOffline) {
    try {
      const { error } = await supabase.from('productos').update(data).eq('id', id);
      if (error) throw error;
    } catch (e) {
      showToast('Error al actualizar en Supabase.', 'error');
    }
  }
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...data };
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
      await supabase.from('movimientos_inventario').delete().eq('producto_id', id);
      await supabase.from('productos').delete().eq('id', id);
    } catch (e) {
      showToast('Error al eliminar en Supabase.', 'error');
    }
  }
  products = products.filter(pr => pr.id !== id);
  movements = movements.filter(m => m.producto_id !== id);
  showToast('Producto eliminado correctamente', 'success');
  renderProducts();
  loadDashboard();
  renderMovements();
}

function editProduct(id) {
  openProductModal(id);
}

// ============================================
// INVENTORY / MOVEMENTS
// ============================================
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
  if (data.cantidad <= 0) {
    showToast('La cantidad debe ser mayor a 0', 'error');
    return;
  }

  if (!isOffline) {
    try {
      const { data: inserted, error } = await supabase.from('movimientos_inventario').insert(data).select();
      if (error) throw error;
      if (inserted) movements.unshift(inserted[0]);
    } catch (e) {
      showToast('Error al registrar en Supabase.', 'error');
      addLocalMovement(data);
    }
  } else {
    addLocalMovement(data);
  }
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

// ============================================
// REPORTS
// ============================================
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

// ============================================
// LOGOUT
// ============================================
function setupLogout() {
  document.getElementById('logoutBtn').addEventListener('click', (e) => {
    e.preventDefault();
    logout();
  });
}

function setupProfileLogout() {
  document.getElementById('profileLogoutBtn').addEventListener('click', () => {
    logout();
  });
}

function logout() {
  document.getElementById('appShell').classList.remove('active');
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginForm').reset();
  window.location.hash = '';
}

// ============================================
// SIDEBAR TOGGLE (Mobile)
// ============================================
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('active');
});

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('active');
}

document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar);

// ============================================
// HELPERS
// ============================================
function formatCurrency(value) {
  return value.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function renderPagination(containerId, current, total, type) {
  const container = document.getElementById(containerId);
  if (!container || total <= 1) {
    if (container) container.innerHTML = '';
    return;
  }

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