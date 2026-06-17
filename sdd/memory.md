# Memory — NaturaStock Cusco

Registro de memoria del proyecto para mantener contexto entre sesiones.

---

## Versión estable actual

- **Último commit funcional**: `f484ebc` — "login centrado y mejora visual productos"
- **Commit de restauración**: `bddae64` — "Punto de restauración estable con Supabase funcionando"
- **Estado**: Working tree limpio (`git status` sin cambios).
- **Tag**: No existe. Se recomienda crear `v1.0-estable` apuntando a `bddae64`.

## Conexión Supabase — validada

- **URL**: `https://mwffklvdkalrcwuxizkg.supabase.co`
- **Estado**: Conexión operativa y verificada.
- **SDK**: Supabase JS v2 cargado vía CDN.
- **Modo offline**: Detectado automáticamente si la conexión falla.
- **Base de datos alineada con `app.js`**: No desincronizar.

## Despliegue en Vercel — validado

- **Archivo**: `vercel.json` con configuración SPA.
- **Estado**: Despliegue operativo.
- **Routing**: Todas las rutas redirigen a `index.html`.

## Imágenes locales de productos

- **Ubicación**: `imagenes_productos_fondo_logo/`
- **Propósito**: Almacenamiento local de imágenes de productos.
- **Regla**: No mover, renombrar ni eliminar sin autorización.

## Productos registrados actualmente

- Miel de Abeja Pura 500ml
- Muña Andina 100g
- Maca Negra en Polvo 250g
- Quinua Real Orgánica 1kg
- Uña de Gato Corteza 150g
- Té de Coca 25 bolsitas
- Pomada Natural de Arcilla 100g
- Aceite Esencial de Eucalipto 30ml
- Infusión de Manzanilla 20 sobres
- Crema de Mano de Caléndula 75ml

## Decisiones y restricciones activas

- Supabase ya está corregido y funcionando. No modificar.
- No usar datos demo ni semilla en producción.
- No tocar `loadData()` ni `initSupabase()` sin autorización explícita.
- No modificar `config.js` — contiene las credenciales activas de Supabase.
- La aplicación NO debe mostrar datos demo — solo datos reales de la BD.

## Historial de correcciones importantes

| Fecha | Cambio | Commit |
|-------|--------|--------|
| — | Punto de restauración estable con Supabase funcionando | `bddae64` |
| — | Fix supabase login and dashboard | `4047c2e` |
| — | Fix supabase load and vercel output | `2b60189` |
| — | Fix supabase configuration | `fd607db` |
| — | Restore supabase script in index | `f743c5b` |
| — | Fix supabase cdn | `7b076b5` |
| — | Fix supabase url | `ba513c1` |
| — | Configure supabase connection | `4940037` |
| — | Login centrado y mejora visual productos | `f484ebc` |
| — | Productos con imágenes y ficha informativa | `1e0c237` |

## Notas

- Toda nueva funcionalidad debe ser especificada en `specs/` antes de implementarse.
- Ningún cambio debe romper la compatibilidad con la base de datos existente.
- El historial refleja que Supabase requirió varias correcciones hasta quedar estable — no regresar a estados anteriores.
