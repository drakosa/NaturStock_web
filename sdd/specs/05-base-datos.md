# Base de Datos

## Resumen de tablas principales

| # | Tabla | Propósito | Relaciones |
|---|-------|-----------|------------|
| 1 | `productos` | Catálogo de productos naturales | FK → categorias, proveedores |
| 2 | `categorias` | Categorías botánicas | Referenciada por productos |
| 3 | `proveedores` | Proveedores de insumos | Referenciada por productos |
| 4 | `clientes` | Clientes del negocio | Referenciada por ventas |
| 5 | `ventas` | Cabecera de ventas realizadas | FK → clientes, usuarios |
| 6 | `detalle_ventas` | Detalle de productos vendidos | FK → ventas, productos |
| 7 | `movimientos_inventario` | Historial de entradas y salidas | FK → productos, usuarios |

## Esquema general (9 tablas)

### 1. `usuarios`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| nombre | VARCHAR(255) | Nombre del usuario |
| email | VARCHAR(255) UNIQUE | Correo electrónico |
| password_hash | VARCHAR(255) | Hash de contraseña |
| rol | VARCHAR(50) | Rol (administrador) |
| telefono | VARCHAR(20) | Teléfono |
| ubicacion | VARCHAR(255) | Ubicación |
| activo | BOOLEAN | Estado activo/inactivo |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### 2. `categorias`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| nombre | VARCHAR(100) UNIQUE | Nombre de categoría |
| descripcion | TEXT | Descripción |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### 3. `proveedores`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| nombre | VARCHAR(255) | Nombre del proveedor |
| contacto | VARCHAR(255) | Persona de contacto |
| telefono | VARCHAR(50) | Teléfono |
| email | VARCHAR(255) | Correo electrónico |
| direccion | TEXT | Dirección |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### 4. `productos`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| nombre | VARCHAR(255) | Nombre del producto |
| sku | VARCHAR(50) UNIQUE | Código SKU autogenerado |
| descripcion | TEXT | Descripción |
| precio | DECIMAL(10,2) | Precio unitario |
| stock | INTEGER | Cantidad en inventario |
| categoria_id | BIGINT FK → categorias(id) | Categoría |
| proveedor_id | BIGINT FK → proveedores(id) | Proveedor |
| imagen | TEXT | URL/ruta de imagen |
| activo | BOOLEAN | Estado activo/inactivo |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### 5. `clientes`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| nombre | VARCHAR(255) | Nombre del cliente |
| tipo_documento | VARCHAR(20) | DNI o RUC |
| numero_documento | VARCHAR(20) | Número de documento |
| telefono | VARCHAR(50) | Teléfono |
| email | VARCHAR(255) | Correo electrónico |
| direccion | TEXT | Dirección |
| created_at | TIMESTAMPTZ | Fecha de creación |
| updated_at | TIMESTAMPTZ | Última actualización |

### 6. `ventas`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| codigo | VARCHAR(50) UNIQUE | Código de comprobante |
| cliente_id | BIGINT FK → clientes(id) | Cliente |
| usuario_id | BIGINT FK → usuarios(id) | Usuario que registró |
| total | DECIMAL(10,2) | Monto total |
| created_at | TIMESTAMPTZ | Fecha de venta |

### 7. `detalle_ventas`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| venta_id | BIGINT FK → ventas(id) | Venta asociada |
| producto_id | BIGINT FK → productos(id) | Producto vendido |
| cantidad | INTEGER | Cantidad |
| precio_unitario | DECIMAL(10,2) | Precio en el momento de venta |
| subtotal | DECIMAL(10,2) | Subtotal (cantidad × precio) |

### 8. `movimientos_inventario`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| producto_id | BIGINT FK → productos(id) | Producto |
| tipo | VARCHAR(10) | entrada / salida |
| cantidad | INTEGER | Cantidad movida |
| motivo | TEXT | Razón del movimiento |
| usuario_id | BIGINT FK → usuarios(id) | Usuario que registró |
| created_at | TIMESTAMPTZ | Fecha del movimiento |

### 9. `alertas_stock`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | BIGSERIAL PK | ID único |
| producto_id | BIGINT FK → productos(id) | Producto alertado |
| tipo | VARCHAR(20) | stock_bajo o agotado |
| mensaje | TEXT | Descripción de la alerta |
| leida | BOOLEAN | Estado de lectura |
| created_at | TIMESTAMPTZ | Fecha de creación |

## Índices
- `idx_productos_nombre` — búsqueda por nombre de producto
- `idx_productos_sku` — búsqueda por SKU
- `idx_productos_categoria` — filtro por categoría
- `idx_movimientos_producto` — historial por producto
- `idx_ventas_cliente` — ventas por cliente
- `idx_ventas_fecha` — ventas por fecha

## Triggers
- `trigger_updated_at` — actualiza `updated_at` automáticamente en todas las tablas que lo tienen.
- Función `actualizar_stock()` — se ejecuta al insertar un movimiento de inventario para actualizar el stock del producto correspondiente.
