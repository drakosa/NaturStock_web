# Post-Change Checklist

Después de modificar código, ejecutar estas verificaciones:

## Pruebas funcionales
- [ ] Login: iniciar sesión con admin / 123456.
- [ ] Dashboard: verificar que las estadísticas cargan.
- [ ] Productos: la lista se renderiza, búsqueda y filtros funcionan.
- [ ] Ventas: registrar una venta de prueba (opcional).
- [ ] Inventario: verificar movimientos (opcional).
- [ ] Reportes: los datos se muestran correctamente.

## Consola del navegador
- [ ] Abrir F12 → Console.
- [ ] No hay errores JavaScript.
- [ ] No hay warnings de Supabase.
- [ ] Las peticiones de red a Supabase responden 200.

## Git
- [ ] `git diff --stat` — Revisar qué archivos se modificaron.
- [ ] Verificar que solo se modificaron los archivos intencionados.
- [ ] No hay cambios accidentales en `config.js`, `supabase-schema.sql` o credenciales.
- [ ] No hay datos sensibles en el diff.

## Documentación
- [ ] Si el cambio es relevante, actualizar `sdd/memory.md`.
- [ ] Si se agregó funcionalidad, actualizar `sdd/specs/` correspondiente.

## Decisión final
- [ ] La aplicación funciona correctamente (SÍ/NO).
- [ ] Se puede hacer commit (solo con aprobación del usuario).
