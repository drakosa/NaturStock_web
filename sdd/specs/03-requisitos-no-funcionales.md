# Requisitos No Funcionales

## Rendimiento (RNF-01)
- La aplicación debe cargar en menos de 3 segundos en conexiones de banda ancha.
- Las consultas a Supabase deben responder en menos de 500 ms.
- Paginación implementada para conjuntos de datos grandes (10 ítems por página).

## Seguridad (RNF-02)
- Las credenciales de Supabase usan la anon key (publishable) — no exponer la service_role key.
- No almacenar contraseñas en texto plano (actualmente esquema local, migrar a hash si se requiere).
- Validaciones del lado del cliente antes de enviar datos.

## Usabilidad (RNF-03)
- Interfaz responsive (adaptable a desktop y tablet).
- Navegación tipo SPA sin recarga completa de página.
- Feedback visual para acciones (toast/notificaciones).
- Diseño consistente con paleta de colores andina.

## Disponibilidad (RNF-04)
- Despliegue en Vercel con alta disponibilidad.
- Supabase como backend con SLA estándar.
- Modo offline si Supabase no está disponible (datos en memoria).

## Mantenibilidad (RNF-05)
- Código estructurado en funciones modulares en `app.js`.
- Esquema de base de datos documentado en `supabase-schema.sql`.
- SDD (Spec Driven Development) para cambios futuros.

## Compatibilidad (RNF-06)
- Navegadores modernos: Chrome, Firefox, Edge, Safari (últimas 2 versiones).
- Sin dependencias externas ni frameworks JS pesados.
