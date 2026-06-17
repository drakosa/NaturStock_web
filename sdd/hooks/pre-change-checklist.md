# Pre-Change Checklist

Antes de modificar cualquier archivo del proyecto, ejecutar estos pasos:

## Git
- [ ] `git status` — Verificar que no hay cambios sin commit.
- [ ] `git log --oneline -3` — Identificar el commit actual.
- [ ] Anotar el commit actual como punto de restauración.

## Planificación
- [ ] Revisar `sdd/memory.md` para restricciones activas.
- [ ] Revisar `sdd/specs/` para la especificación relevante.
- [ ] Identificar qué archivos se modificarán.
- [ ] Confirmar que los cambios no afectan Supabase (a menos que esté autorizado).
- [ ] Confirmar que los cambios no afectan la lógica funcional principal (a menos que esté autorizado).
- [ ] Tener claros los criterios de éxito (output esperado).

## Precaución
- [ ] Hacer backup mental del estado actual (o crear una rama git si el cambio es riesgoso).
- [ ] No modificar `config.js`, `supabase-schema.sql` ni credenciales.
- [ ] No modificar `initSupabase()` ni `loadData()` sin autorización.
