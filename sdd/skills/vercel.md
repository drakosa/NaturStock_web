# Vercel Skill

## Configuración actual
- `vercel.json` con configuración SPA (todas las rutas → `index.html`).
- `outputDirectory` en `.` (raíz del proyecto).
- Sin servidor Node.js, solo estático.

## Comandos
- `npm run build` ejecuta `scripts/build.js` (minificación/empaquetado).
- El despliegue se hace desde el dashboard de Vercel (conectado a GitHub).

## Reglas
- No modificar `vercel.json` sin justificación.
- No cambiar la estrategia de routing SPA.
- Verificar que el build no produzca errores antes de hacer deploy.
- No exponer archivos de configuración local en producción.
