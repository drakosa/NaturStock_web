# Flujos Principales

## 1. Flujo Login (Inicio de Sesión)
```
Usuario → Ingresa credenciales (admin / 123456) → app.js valida localmente
  ├── Éxito → Guarda sesión en memoria (usuario actual)
  │         → Muestra dashboard con estadísticas
  │         → Habilita navegación a todos los módulos
  └── Error → Muestra mensaje de error en el formulario de login
              → Permite reintentar
```

## 2. Flujo Gestión de Productos
```
Usuario → Navega a Productos
  → app.js carga productos desde Supabase (tabla: productos)
  → Renderiza tabla con paginación (10 por página)

  [CREAR]
  → Click "Nuevo Producto"
  → Llena formulario: nombre, descripción, precio, stock,
    categoría (select), proveedor (select), imagen (texto)
  → app.js genera SKU automáticamente
  → Guarda en Supabase (INSERT productos)
  → Refresca tabla local
  → Muestra notificación de éxito

  [EDITAR]
  → Click en producto → formulario precargado
  → Modifica campos → Guarda (UPDATE productos)
  → Refresca tabla

  [ELIMINAR]
  → Click eliminar → confirmación
  → Elimina (DELETE productos)
  → Refresca tabla

  [BUSCAR / FILTRAR]
  → Escribe en buscador → filtra por nombre o SKU
  → Selecciona categoría/estado → filtra resultados
```

## 3. Flujo Gestión de Inventario
```
Usuario → Navega a Inventario
  → app.js carga movimientos desde Supabase (tabla: movimientos_inventario)
  → Renderiza historial de movimientos

  [REGISTRAR ENTRADA]
  → Click "Nuevo Movimiento"
  → Selecciona producto
  → Tipo: entrada
  → Ingresa cantidad y motivo
  → Guarda en Supabase (INSERT movimientos_inventario)
  → Trigger actualiza stock del producto (+cantidad)
  → Refresca tabla de movimientos y stock

  [REGISTRAR SALIDA]
  → Click "Nuevo Movimiento"
  → Selecciona producto
  → Tipo: salida
  → Ingresa cantidad y motivo
  → Guarda en Supabase (INSERT movimientos_inventario)
  → Trigger actualiza stock del producto (-cantidad)
  → Refresca tabla de movimientos y stock
```

## 4. Flujo Registro de Ventas
```
Usuario → Navega a Ventas → Click "Nueva Venta"
  → app.js carga clientes y productos desde Supabase

  [SELECCIONAR CLIENTE]
  → Busca cliente existente o crea uno nuevo

  [AGREGAR PRODUCTOS]
  → Busca producto y selecciona cantidad
  → app.js calcula subtotal (cantidad × precio)
  → Agrega a la lista de detalles de venta
  → Muestra total acumulado

  [CONFIRMAR VENTA]
  → app.js genera código de comprobante (automático)
  → Inserta cabecera en ventas (INSERT ventas)
  → Inserta detalle en detalle_ventas (INSERT detalle_ventas)
  → Inserta movimiento de salida en movimientos_inventario
  → Trigger actualiza stock de cada producto vendido
  → Renderiza comprobante de venta
```

## 5. Flujo de Reportes
```
Usuario → Navega a Reportes
  → app.js consulta productos con stock <= 5 (stock bajo)
  → Consulta productos con stock = 0 (agotados)
  → Calcula suma de (precio × stock) para valor total
  → Cuenta productos por categoría
  → Renderiza tablas y gráfico de distribución
```

## 6. Flujo de modo offline
```
initSupabase() falla → isOffline = true
  → Las funciones CRUD detectan isOffline
  → Operan solo con datos en memoria (arrays locales)
  → Los cambios NO persisten al recargar la página
  → Se muestra indicador visual de modo offline
```
