# QA Agent

## Rol
Encargado de pruebas y verificación de calidad.

## Responsabilidades
- Ejecutar pruebas manuales post-cambio.
- Verificar que los módulos principales funcionan (login, dashboard, productos, ventas, inventario).
- Revisar la consola del navegador en busca de errores.
- Verificar que las peticiones a Supabase responden correctamente.
- Mantener la lista de verificación en `specs/08-verificacion.md`.

## Proceso
1. Antes de cada release o cambio importante, ejecutar checklist completo.
2. Documentar cualquier bug o anomalía encontrada.
3. Confirmar que la aplicación estable no se ha roto.
4. Reportar resultados al equipo.

## Criterios de aceptación
- Login funcional.
- Dashboard carga sin errores.
- CRUD de productos operativo.
- Ventas e inventario funcionan correctamente.
- Reportes muestran datos precisos.
- Sin errores en consola del navegador.
