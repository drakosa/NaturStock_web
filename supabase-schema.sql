-- NaturaStock Cusco - Database Schema
-- Ejecutar en SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS productos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER NOT NULL DEFAULT 5,
    descripcion TEXT,
    estado VARCHAR(20) NOT NULL DEFAULT 'disponible',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
    id BIGSERIAL PRIMARY KEY,
    producto_id BIGINT NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
    tipo_movimiento VARCHAR(20) NOT NULL CHECK (tipo_movimiento IN ('entrada', 'salida')),
    cantidad INTEGER NOT NULL,
    descripcion TEXT,
    fecha_movimiento TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_productos_categoria ON productos(categoria);
CREATE INDEX IF NOT EXISTS idx_productos_estado ON productos(estado);
CREATE INDEX IF NOT EXISTS idx_movimientos_producto ON movimientos_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_movimientos_fecha ON movimientos_inventario(fecha_movimiento DESC);
CREATE INDEX IF NOT EXISTS idx_movimientos_tipo ON movimientos_inventario(tipo_movimiento);

-- Trigger: updated_at
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS trg_products_updated_at ON productos;
CREATE TRIGGER trg_products_updated_at
    BEFORE UPDATE ON productos FOR EACH ROW
    EXECUTE FUNCTION update_products_updated_at();

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

-- RLS
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE movimientos_inventario ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon read productos" ON productos FOR SELECT USING (true);
CREATE POLICY "Allow anon insert productos" ON productos FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update productos" ON productos FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete productos" ON productos FOR DELETE USING (true);
CREATE POLICY "Allow anon read movimientos" ON movimientos_inventario FOR SELECT USING (true);
CREATE POLICY "Allow anon insert movimientos" ON movimientos_inventario FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon delete movimientos" ON movimientos_inventario FOR DELETE USING (true);

-- Sample data
INSERT INTO productos (nombre, categoria, precio, stock, stock_minimo, descripcion) VALUES
('Miel de Abeja Pura 500ml', 'Mieles', 25.00, 120, 10, 'Miel de abeja 100% natural de los valles de Cusco.'),
('Muña Andina 100g', 'Hierbas', 8.50, 200, 15, 'Hierba aromática andina tradicional.'),
('Maca Negra en Polvo 250g', 'Suplementos', 18.00, 85, 8, 'Maca negra orgánica de Junín.'),
('Quinua Real Orgánica 1kg', 'Suplementos', 12.00, 45, 10, 'Quinua real orgánica del Altiplano.'),
('Uña de Gato Corteza 150g', 'Medicinales', 15.00, 60, 5, 'Corteza de uña de gato amazónica.'),
('Té de Coca 25 bolsitas', 'Infusiones', 6.50, 300, 20, 'Té de hoja de coca tradicional.'),
('Pomada Natural de Arcilla 100g', 'Cosmética natural', 22.00, 30, 5, 'Pomada de arcilla con hierbas andinas.'),
('Aceite Esencial de Eucalipto 30ml', 'Medicinales', 28.00, 15, 5, 'Aceite esencial puro de eucalipto.'),
('Infusión de Manzanilla 20 sobres', 'Infusiones', 5.00, 250, 15, 'Manzanilla orgánica del Valle Sagrado.'),
('Crema de mano de Caléndula 75ml', 'Cosmética natural', 19.00, 40, 8, 'Crema hidratante con caléndula y aceites naturales.');

INSERT INTO movimientos_inventario (producto_id, tipo_movimiento, cantidad, descripcion) VALUES
(1, 'entrada', 50, 'Reabastecimiento semanal'),
(4, 'salida', 10, 'Despacho a tienda principal'),
(2, 'entrada', 30, 'Nueva cosecha'),
(6, 'salida', 45, 'Pedido distribuidor'),
(3, 'entrada', 20, 'Reabastecimiento de maca'),
(9, 'salida', 60, 'Pedido mayorista');
