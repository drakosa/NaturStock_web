# Requisitos Funcionales

## Módulos del sistema

### 1. Inicio de Sesión (RF-01)
- Login con usuario y contraseña.
- Credenciales por defecto: admin / 123456.
- Redirección al dashboard tras autenticación exitosa.

### 2. Dashboard (RF-02)
- Vista de estadísticas principales:
  - Total de productos registrados.
  - Total de clientes.
  - Total de proveedores.
  - Valor total del inventario (S/).
  - Productos con stock bajo (<= 5 unidades).
  - Movimientos recientes de inventario.
  - Ventas del día (monto total en S/).

### 3. Productos (RF-03)
- CRUD completo: crear, leer, actualizar y eliminar productos.
- Campos: nombre, SKU (autogenerado), descripción, precio, stock, categoría, proveedor, imagen.
- Búsqueda por nombre o SKU.
- Filtros por categoría y estado (activo/inactivo).
- Paginación (10 ítems por página).
- Vista de ficha informativa por producto.

### 4. Categorías (RF-04)
- CRUD completo de categorías botánicas.
- Cada categoría tiene: nombre y descripción.

### 5. Proveedores (RF-05)
- CRUD completo de proveedores.
- Campos: nombre, contacto, teléfono, email, dirección.

### 6. Clientes (RF-06)
- CRUD completo de clientes.
- Campos: nombre, tipo de documento (DNI/RUC), número de documento, teléfono, email, dirección.

### 7. Ventas (RF-07)
- Registro de ventas con cabecera y detalle.
- Selección de cliente.
- Selección de productos con cantidad.
- Comprobante autogenerado (código de venta).
- Cálculo automático de subtotales y total.
- Descuento del stock al confirmar la venta.

### 8. Inventario (RF-08)
- Registro de entradas y salidas de stock.
- Historial completo de movimientos.
- Motivo registrado para cada movimiento.

### 9. Reportes (RF-09)
- Productos con stock bajo.
- Productos agotados (stock = 0).
- Valor total del inventario.
- Distribución de productos por categoría (gráfico).

### 10. Perfil (RF-10)
- Información del usuario actual.
- Cierre de sesión.
