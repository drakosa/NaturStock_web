# Agent Instructions — NaturaStock Cusco

Este archivo define cómo debe comportarse OpenCode al trabajar en el proyecto **NaturaStock Cusco**, un sistema web de gestión e inventario para productos naturales y botánicos.

## Misión del proyecto

Proveer una herramienta digital eficiente, confiable y fácil de usar para la gestión de inventario, ventas, clientes y proveedores de productos naturales en la región de Cusco, Perú.

## Objetivos del sistema

- Digitalizar el control de inventario de productos botánicos y naturales.
- Facilitar el registro y seguimiento de ventas con generación automática de comprobantes.
- Mantener un historial completo de movimientos de inventario (entradas y salidas).
- Proveer reportes útiles para la toma de decisiones (stock bajo, valor total, distribución).
- Operar de forma estable y rápida como SPA (Single Page Application).

## Orden de operación obligatorio

1. **Leer `init.md`** — Comprender el estado actual del proyecto.
2. **Revisar `memory.md`** — Conocer restricciones activas y decisiones previas.
3. **Revisar `specs/`** — Leer las especificaciones relevantes antes de proponer cambios.
4. **Consultar `skills/`** — Si la tarea involucra frontend, Supabase, Vercel, UI/UX o testing.
5. **Delegar a `subagents/`** — Si la tarea corresponde a un rol especializado.

## Reglas fundamentales

- **No modificar Supabase** sin autorización explícita del usuario.
- **No cambiar lógica funcional** (`app.js`, `config.js`, `index.html`, `style.css`) sin autorización.
- **No modificar base de datos, tablas, consultas SQL, credenciales**.
- **No alterar login, dashboard, productos, ventas, inventario, clientes, proveedores, reportes**.
- **No modificar `initSupabase()` ni `loadData()`** — la conexión con Supabase ya está validada y operativa.
- **No modificar la configuración de Vercel** — el despliegue ya está funcionando.
- **No mover ni renombrar imágenes** — están en `imagenes_productos_fondo_logo/`.
- No hacer commit sin aprobación del usuario.
- Mantener la versión estable actual como punto de restauración.

## Restricciones específicas de Supabase

- La conexión se realiza mediante `supabaseClient` (SDK JS v2).
- Las consultas usan la API REST de Supabase (`supabaseClient.from('tabla').select()`).
- No ejecutar consultas SQL directas en producción.
- No modificar el esquema de tablas, índices o triggers existentes.
- La anon key en `config.js` es publishable — no reemplazarla por la service_role key.

## Estilo de trabajo

- Preferir cambios pequeños, atómicos y verificables.
- Antes de cada cambio: `git status`, revisar archivos afectados.
- Después de cada cambio: probar login, dashboard, productos, revisar consola del navegador.
- Documentar en `memory.md` cualquier decisión relevante.

## Proceso de validación antes de commits

1. Ejecutar `git diff --stat` y verificar que solo se modificaron los archivos esperados.
2. Probar manualmente: login, dashboard, sección de productos.
3. Revisar consola del navegador (F12) — sin errores.
4. Verificar que las peticiones a Supabase responden 200.
5. Confirmar que no hay secretos o credenciales expuestas en el diff.
6. Obtener aprobación explícita del usuario antes de hacer commit.
