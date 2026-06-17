# Control de Cambios

## Política de versionado

- Usar commits descriptivos en español.
- Mantener un commit de restauración estable identificable.
- Se recomienda crear un tag `v1.0-estable` apuntando al commit de restauración.
- No hacer merge ni push sin verificar que la aplicación funciona.

## Flujo de cambio recomendado

```
1. [Pre-cambio] Ejecutar checklist pre-change (hooks/pre-change-checklist.md)
2. [Cambio]    Hacer cambios pequeños y atómicos
3. [Prueba]    Verificar login, dashboard, productos y consola
4. [Git]       git diff --stat (revisar cambios)
5. [Post]      Ejecutar checklist post-change (hooks/post-change-checklist.md)
6. [Commit]    Solo con aprobación del usuario
7. [Memoria]   Actualizar memory.md si es relevante
```

## Lo que NO debe cambiarse sin autorización

- Configuración de Supabase (`config.js`).
- Esquema de base de datos (tablas, columnas, consultas SQL).
- Credenciales o claves API.
- Lógica de `initSupabase()`, `loadData()`.
- Funcionalidad principal de login, dashboard, productos, ventas, inventario.

## Lo que SÍ puede cambiarse con especificación

- Nuevos módulos o funcionalidades (previa especificación en `specs/`).
- Mejoras visuales (UI/UX) que no alteren la lógica de negocio.
- Corrección de errores (bugs) que no afecten la estabilidad.
- Optimizaciones de rendimiento que no cambien comportamiento.
