-- NaturaStock Cusco - Database Schema Completo
-- Ejecutar en SQL Editor de Supabase

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- 1. USUARIOS
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL DEFAULT 'default_hash',
    rol VARCHAR(50) NOT NULL DEFAULT 'administrador',
    telefono VARCHAR(20),
    ubicacion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIAS
CREATE TABLE IF NOT EXISTS categorias (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROVEEDORES
CREATE TABLE IF NOT EXISTS proveedores (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTOS
CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    categoria_id BIGINT REFERENCES categorias(id) ON DELETE SET NULL,
    proveedor_id BIGINT REFERENCES proveedores(id) ON DELETE SET NULL,
    precio DECIMAL(10,2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo_documento VARCHAR(20) DEFAULT 'DNI',
    numero_documento VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VENTAS
CREATE TABLE IF NOT EXISTS ventas (
    id BIGSERIAL PRIMARY KEY,
    cliente_id BIGINT REFERENCES clientes(id) ON DELETE SET NULL,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    tipo_comprobante VARCHAR(20) DEFAULT 'Boleta',
    numero_comprobante VARCHAR(50) UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. DETALLE VENTAS
CREATE TABLE IF NOT EXISTS detalle_ventas (
    id BIGSERIAL PRIMARY KEY,
    venta_id BIGINT NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE RESTRICT,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL
);

-- 8. MOVIMIENTOS INVENTARIO
CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    descripcion TEXT,
    usuario_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
    fecha_movimiento TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. ALERTAS STOCK
CREATE TABLE IF NOT EXISTS alertas_stock (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50) NOT NULL DEFAULT 'stock_bajo',
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento DESC);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);
CREATE INDEX IF NOT EXISTS idx_ventas_cliente ON ventas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ventas_fecha ON ventas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detalle_venta ON detalle_ventas(venta_id);
CREATE INDEX IF NOT EXISTS idx_alertas_producto ON alertas_stock(producto_id);
CREATE INDEX IF NOT EXISTS idx_alertas_leida ON alertas_stock(leida);

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: updated_at para productos
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_products_updated_at ON productos;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON productos FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

-- Trigger: updated_at para usuarios
CREATE OR REPLACE FUNCTION update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_updated_at ON usuarios;
CREATE TRIGGER trg_usuarios_updated_at
    BEFORE UPDATE ON usuarios FOR EACH ROW
    EXECUTE FUNCTION update_usuarios_updated_at();

-- Trigger: updated_at para categorias
CREATE OR REPLACE FUNCTION update_categorias_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_categorias_updated_at ON categorias;
CREATE TRIGGER trg_categorias_updated_at
    BEFORE UPDATE ON categorias FOR EACH ROW
    EXECUTE FUNCTION update_categorias_updated_at();

-- Trigger: updated_at para proveedores
CREATE OR REPLACE FUNCTION update_proveedores_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proveedores_updated_at ON proveedores;
CREATE TRIGGER trg_proveedores_updated_at
    BEFORE UPDATE ON proveedores FOR EACH ROW
    EXECUTE FUNCTION update_proveedores_updated_at();

-- Trigger: updated_at para clientes
CREATE OR REPLACE FUNCTION update_clientes_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_clientes_updated_at ON clientes;
CREATE TRIGGER trg_clientes_updated_at
    BEFORE UPDATE ON clientes FOR EACH ROW
    EXECUTE FUNCTION update_clientes_updated_at();

-- Trigger: auto-update stock on movement
CREATE OR REPLACE FUNCTION update_stock_on_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo_movimiento = 'entrada' THEN
        UPDATE productos SET stock = stock + NEW.cantidad WHERE id = NEW.producto_id;
    ELSIF NEW.tipo_movimiento = 'salida' THEN
        UPDATE productos SET stock = GREATEST(stock - NEW.cantidad, 0) WHERE id = NEW.producto_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_stock ON movimientos_inventario;
CREATE TRIGGER trg_update_stock
    AFTER INSERT ON movimientos_inventario FOR EACH ROW
    EXECUTE FUNCTION update_stock_on_movement();

-- Trigger: auto-update estado based on stock
CREATE OR REPLACE FUNCTION update_product_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock = 0 THEN NEW.estado := 'agotado';
    ELSIF NEW.stock <= NEW.stock_minimo THEN NEW.estado := 'bajo_stock';
    ELSE NEW.estado := 'disponible';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_status ON productos;
CREATE TRIGGER trg_update_product_status
    BEFORE INSERT OR UPDATE OF stock, stock_minimo ON productos FOR EACH ROW
    EXECUTE FUNCTION update_product_status();

-- Trigger: create alert when stock is low
CREATE OR REPLACE FUNCTION check_low_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock > 0 AND NEW.stock <= NEW.stock_minimo THEN
        INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje)
        VALUES (NEW.id, 'stock_bajo', 'El producto "' || NEW.nombre || '" tiene stock bajo: ' || NEW.stock || ' unidades.');
    ELSIF NEW.stock = 0 THEN
        INSERT INTO alertas_stock (producto_id, tipo_alerta, mensaje)
        VALUES (NEW.id, 'agotado', 'El producto "' || NEW.nombre || '" está agotado.');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_low_stock ON productos;
CREATE TRIGGER trg_check_low_stock
    AFTER INSERT OR UPDATE OF stock ON productos FOR EACH ROW
    EXECUTE FUNCTION check_low_stock_alert();

-- Trigger: generate codigo automatically
CREATE OR REPLACE FUNCTION generate_product_codigo()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.codigo IS NULL THEN
        NEW.codigo := 'SKU-' || LPAD(NEW.id::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_product_codigo ON productos;
CREATE TRIGGER trg_generate_product_codigo
    BEFORE INSERT ON productos FOR EACH ROW
    EXECUTE FUNCTION generate_product_codigo();

-- Trigger: auto-generate numero_comprobante
CREATE OR REPLACE FUNCTION generate_comprobante_numero()
RETURNS TRIGGER AS $$
DECLARE
    seq INTEGER;
BEGIN
    SELECT COALESCE(MAX(CAST(SPLIT_PART(numero_comprobante, '-', 2) AS INTEGER)), 0) + 1 INTO seq FROM ventas;
    NEW.numero_comprobante := 'V' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(seq::TEXT, 4, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_comprobante ON ventas;
CREATE TRIGGER trg_generate_comprobante
    BEFORE INSERT ON ventas FOR EACH ROW
    EXECUTE FUNCTION generate_comprobante_numero();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE detalle_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas_stock ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura para todos (anon)
CREATE POLICY "Allow anon read usuarios" ON usuarios FOR SELECT USING (true);
CREATE POLICY "Allow anon read categorias" ON categorias FOR SELECT USING (true);
CREATE POLICY "Allow anon read proveedores" ON proveedores FOR SELECT USING (true);
CREATE POLICY "Allow anon read productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Allow anon read clientes" ON clientes FOR SELECT USING (true);
CREATE POLICY "Allow anon read ventas" ON ventas FOR SELECT USING (true);
CREATE POLICY "Allow anon read detalle_ventas" ON detalle_ventas FOR SELECT USING (true);
CREATE POLICY "Allow anon read movimientos" ON movimientos_inventario FOR SELECT USING (true);
CREATE POLICY "Allow anon read alertas" ON alertas_stock FOR SELECT USING (true);

-- Políticas de inserción
CREATE POLICY "Allow anon insert categorias" ON categorias FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert proveedores" ON proveedores FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert productos" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert clientes" ON clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert ventas" ON ventas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert detalle_ventas" ON detalle_ventas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon insert movimientos" ON movimientos_inventario FOR INSERT WITH CHECK (true);

-- Políticas de actualización
CREATE POLICY "Allow anon update categorias" ON categorias FOR UPDATE USING (true);
CREATE POLICY "Allow anon update proveedores" ON proveedores FOR UPDATE USING (true);
CREATE POLICY "Allow anon update productos" ON productos FOR UPDATE USING (true);
CREATE POLICY "Allow anon update clientes" ON clientes FOR UPDATE USING (true);
CREATE POLICY "Allow anon update alertas" ON alertas_stock FOR UPDATE USING (true);

-- Políticas de eliminación
CREATE POLICY "Allow anon delete categorias" ON categorias FOR DELETE USING (true);
CREATE POLICY "Allow anon delete proveedores" ON proveedores FOR DELETE USING (true);
CREATE POLICY "Allow anon delete productos" ON productos FOR DELETE USING (true);
CREATE POLICY "Allow anon delete clientes" ON clientes FOR DELETE USING (true);
CREATE POLICY "Allow anon delete movimientos" ON movimientos_inventario FOR DELETE USING (true);
CREATE POLICY "Allow anon delete detalle_ventas" ON detalle_ventas FOR DELETE USING (true);
CREATE POLICY "Allow anon delete ventas" ON ventas FOR DELETE USING (true);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Usuario admin
INSERT INTO usuarios (nombre, email, password_hash, rol, telefono, ubicacion)
VALUES ('Admin', 'admin@naturastock.pe', 'default_hash', 'administrador', '+51 984 000 000', 'Cusco, Perú')
ON CONFLICT (email) DO NOTHING;

-- Categorías
INSERT INTO categorias (nombre, descripcion) VALUES
    ('Infusiones', 'Tés e infusiones de hierbas andinas'),
    ('Suplementos', 'Suplementos nutricionales naturales'),
    ('Hierbas', 'Hierbas aromáticas y medicinales'),
    ('Mieles', 'Miel de abeja y derivados'),
    ('Medicinales', 'Plantas medicinales tradicionales'),
    ('Cosmética natural', 'Cosméticos y cuidados naturales')
ON CONFLICT (nombre) DO NOTHING;

-- Proveedores
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
    ('Hierbas del Valle SRL', 'Carlos Mamani', '+51 984 111 111', 'carlos@hierbasdelvalle.pe', 'Av. de la Cultura 123, Cusco'),
    ('Andean Naturals EIRL', 'María Quispe', '+51 984 222 222', 'maria@andeannaturals.pe', 'Jr. Libertad 456, Urubamba'),
    ('Mieles del Sur SAC', 'Pedro Huamán', '+51 984 333 333', 'pedro@mielesdelsur.pe', 'Calle Real 789, Cusco'),
    ('Cosmética Nativa', 'Lucía Vargas', '+51 984 444 444', 'lucia@cosmeticanativa.pe', 'Av. Sol 321, Cusco')
ON CONFLICT DO NOTHING;

-- Productos
INSERT INTO productos (codigo, nombre, categoria_id, proveedor_id, precio, stock, stock_minimo, descripcion) VALUES
    ('SKU-0001', 'Miel de Abeja Pura 500ml', (SELECT id FROM categorias WHERE nombre='Mieles'), (SELECT id FROM proveedores WHERE nombre='Mieles del Sur SAC'), 25.00, 120, 10, 'Miel de abeja 100% natural de los valles de Cusco.'),
    ('SKU-0002', 'Muña Andina 100g', (SELECT id FROM categorias WHERE nombre='Hierbas'), (SELECT id FROM proveedores WHERE nombre='Hierbas del Valle SRL'), 8.50, 200, 15, 'Hierba aromática andina tradicional.'),
    ('SKU-0003', 'Maca Negra en Polvo 250g', (SELECT id FROM categorias WHERE nombre='Suplementos'), (SELECT id FROM proveedores WHERE nombre='Andean Naturals EIRL'), 18.00, 85, 8, 'Maca negra orgánica de Junín.'),
    ('SKU-0004', 'Quinua Real Orgánica 1kg', (SELECT id FROM categorias WHERE nombre='Suplementos'), (SELECT id FROM proveedores WHERE nombre='Andean Naturals EIRL'), 12.00, 45, 10, 'Quinua real orgánica del Altiplano.'),
    ('SKU-0005', 'Uña de Gato Corteza 150g', (SELECT id FROM categorias WHERE nombre='Medicinales'), (SELECT id FROM proveedores WHERE nombre='Hierbas del Valle SRL'), 15.00, 60, 5, 'Corteza de uña de gato amazónica.'),
    ('SKU-0006', 'Té de Coca 25 bolsitas', (SELECT id FROM categorias WHERE nombre='Infusiones'), (SELECT id FROM proveedores WHERE nombre='Hierbas del Valle SRL'), 6.50, 300, 20, 'Té de hoja de coca tradicional.'),
    ('SKU-0007', 'Pomada Natural de Arcilla 100g', (SELECT id FROM categorias WHERE nombre='Cosmética natural'), (SELECT id FROM proveedores WHERE nombre='Cosmética Nativa'), 22.00, 30, 5, 'Pomada de arcilla con hierbas andinas.'),
    ('SKU-0008', 'Aceite Esencial de Eucalipto 30ml', (SELECT id FROM categorias WHERE nombre='Medicinales'), (SELECT id FROM proveedores WHERE nombre='Cosmética Nativa'), 28.00, 15, 5, 'Aceite esencial puro de eucalipto.'),
    ('SKU-0009', 'Infusión de Manzanilla 20 sobres', (SELECT id FROM categorias WHERE nombre='Infusiones'), (SELECT id FROM proveedores WHERE nombre='Hierbas del Valle SRL'), 5.00, 250, 15, 'Manzanilla orgánica del Valle Sagrado.'),
    ('SKU-0010', 'Crema de Mano de Caléndula 75ml', (SELECT id FROM categorias WHERE nombre='Cosmética natural'), (SELECT id FROM proveedores WHERE nombre='Cosmética Nativa'), 19.00, 40, 8, 'Crema hidratante con caléndula y aceites naturales.')
ON CONFLICT (codigo) DO NOTHING;

-- Clientes
INSERT INTO clientes (nombre, tipo_documento, numero_documento, telefono, email, direccion) VALUES
    ('Juan Pérez García', 'DNI', '12345678', '+51 987 654 321', 'juan@email.com', 'Av. Tullumayo 123, Cusco'),
    ('María Torres Luna', 'DNI', '23456789', '+51 987 654 322', 'maria@email.com', 'Jr. San Blas 456, Cusco'),
    ('Comercial Andina SAC', 'RUC', '20123456789', '+51 987 654 323', 'ventas@comercialandina.pe', 'Calle Suecia 789, Cusco'),
    ('Botica Natural EIRL', 'RUC', '20234567890', '+51 987 654 324', 'info@boticanatural.pe', 'Av. El Sol 321, Cusco')
ON CONFLICT (numero_documento) DO NOTHING;

-- Ventas de ejemplo
INSERT INTO ventas (cliente_id, usuario_id, total, tipo_comprobante) VALUES
    ((SELECT id FROM clientes WHERE numero_documento='12345678'), (SELECT id FROM usuarios WHERE email='admin@naturastock.pe'), 56.00, 'Boleta'),
    ((SELECT id FROM clientes WHERE numero_documento='20123456789'), (SELECT id FROM usuarios WHERE email='admin@naturastock.pe'), 124.50, 'Factura')
ON CONFLICT DO NOTHING;

-- Detalle de ventas
INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, p.id, 2, p.precio, 2 * p.precio
FROM ventas v, productos p
WHERE v.total = 56.00 AND p.nombre = 'Miel de Abeja Pura 500ml'
  AND NOT EXISTS (SELECT 1 FROM detalle_ventas dv WHERE dv.venta_id = v.id);

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, p.id, 4, p.precio, 4 * p.precio
FROM ventas v, productos p
WHERE v.total = 56.00 AND p.nombre = 'Muña Andina 100g'
  AND NOT EXISTS (SELECT 1 FROM detalle_ventas dv WHERE dv.venta_id = v.id AND dv.producto_id = p.id);

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, p.id, 3, p.precio, 3 * p.precio
FROM ventas v, productos p
WHERE v.total = 124.50 AND p.nombre = 'Maca Negra en Polvo 250g'
  AND NOT EXISTS (SELECT 1 FROM detalle_ventas dv WHERE dv.venta_id = v.id);

INSERT INTO detalle_ventas (venta_id, producto_id, cantidad, precio_unitario, subtotal)
SELECT v.id, p.id, 5, p.precio, 5 * p.precio
FROM ventas v, productos p
WHERE v.total = 124.50 AND p.nombre = 'Aceite Esencial de Eucalipto 30ml'
  AND NOT EXISTS (SELECT 1 FROM detalle_ventas dv WHERE dv.venta_id = v.id AND dv.producto_id = p.id);

-- Movimientos de inventario
INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, descripcion, usuario_id) VALUES
    ((SELECT id FROM productos WHERE codigo='SKU-0001'), 'entrada', 50, 'Reabastecimiento semanal', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe')),
    ((SELECT id FROM productos WHERE codigo='SKU-0004'), 'salida', 10, 'Despacho a tienda principal', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe')),
    ((SELECT id FROM productos WHERE codigo='SKU-0002'), 'entrada', 30, 'Nueva cosecha', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe')),
    ((SELECT id FROM productos WHERE codigo='SKU-0006'), 'salida', 45, 'Pedido distribuidor', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe')),
    ((SELECT id FROM productos WHERE codigo='SKU-0003'), 'entrada', 20, 'Reabastecimiento de maca', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe')),
    ((SELECT id FROM productos WHERE codigo='SKU-0009'), 'salida', 60, 'Pedido mayorista', (SELECT id FROM usuarios WHERE email='admin@naturastock.pe'));
