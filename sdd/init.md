# Init — NaturaStock Cusco

## Estado actual del proyecto

- **Proyecto**: NaturaStock Cusco — Sistema web de gestión de inventario para productos naturales.
- **Frontend**: HTML, CSS (Design System propio), JavaScript vanilla (SPA).
- **Backend**: Supabase (PostgreSQL) — 9 tablas.
- **Deployment**: Vercel.
- **Moneda**: Soles Peruanos (S/).
- **Diseño**: Inspirado en Google Stitch, paleta andina.

## Estado de funcionamiento

- ✅ Login funcional (admin / 123456).
- ✅ Dashboard funcional con estadísticas.
- ✅ CRUD de productos, categorías, proveedores, clientes.
- ✅ Ventas con detalle y comprobante autogenerado.
- ✅ Inventario con entradas/salidas e historial.
- ✅ Reportes de stock bajo, agotados, valor total, distribución.
- ✅ Supabase conectado y operativo.
- ✅ Vercel configurado y desplegando correctamente.
- ✅ Productos con imágenes locales en `imagenes_productos_fondo_logo/`.

## Punto estable actual

- **Commit**: `bddae64` — "Punto de restauración estable con Supabase funcionando"
- **Commit HEAD**: `f484ebc` — "login centrado y mejora visual productos"
- **No existen tags** — se recomienda crear `v1.0-estable`.

## Archivos principales

| Archivo | Propósito |
|---------|-----------|
| `index.html` | Aplicación principal (SPA) |
| `style.css` | Sistema de diseño (Design Tokens) |
| `app.js` | Lógica de la aplicación (~1433 líneas) |
| `config.js` | Configuración de Supabase (URL + anonKey) |
| `supabase-schema.sql` | Esquema completo de base de datos |
| `vercel.json` | Configuración de despliegue Vercel |
| `package.json` | Script `build` para empaquetado |
| `scripts/build.js` | Script de build |
| `imagenes_productos_fondo_logo/` | Imágenes locales de productos |
