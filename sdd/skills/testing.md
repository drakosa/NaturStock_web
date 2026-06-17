# Testing Skill

## Estrategia

Este proyecto no cuenta con un framework de testing automatizado. Las pruebas son manuales.

## Áreas de prueba

### Pruebas funcionales
- Login: credenciales válidas e inválidas.
- CRUD productos: crear, editar, eliminar, buscar, filtrar.
- CRUD categorías, proveedores, clientes.
- Ventas: registro, cálculo de totales, descuento de stock.
- Inventario: entrada, salida, historial.
- Reportes: datos correctos y gráfico.

### Pruebas de regresión
- Después de cualquier cambio, ejecutar la lista de verificación en `specs/08-verificacion.md`.
- Verificar que los módulos no afectados sigan funcionando.

### Pruebas de conectividad
- Modo online: Supabase responde correctamente.
- Modo offline: la aplicación opera sin Supabase (si aplica).

## Herramientas
- Consola del navegador (F12) para depuración.
- Network tab para verificar peticiones a Supabase.
- No hay pruebas unitarias ni de integración automatizadas por ahora.
