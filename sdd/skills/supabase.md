# Supabase Skill

## Configuración actual
- **URL**: `https://mwffklvdkalrcwuxizkg.supabase.co`
- **Anon Key**: Configurada en `config.js`
- **SDK**: Supabase JS CDN (window.supabase)

## Conexión
- Inicialización en `initSupabase()` dentro de `app.js`.
- Cliente disponible como `supabaseClient` (variable global).
- Modo offline detectado automáticamente si la conexión falla.

## Reglas estrictas
- **NO MODIFICAR** la URL ni la anon key.
- **NO MODIFICAR** el esquema de base de datos sin autorización explícita.
- **NO MODIFICAR** `initSupabase()` ni `loadData()`.
- **NO ejecutar consultas SQL** en producción sin aprobación.
- Las consultas se hacen vía la API REST de Supabase (`supabaseClient.from('tabla').select()`).

## Tablas disponibles
usuarios, categorias, proveedores, productos, clientes, ventas, detalle_ventas, movimientos_inventario, alertas_stock
