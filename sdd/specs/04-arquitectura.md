# Arquitectura del Sistema

## Arquitectura NaturaStock

```
┌─────────────────────────────────────────────────┐
│                   USUARIO                        │
│          (Navegador Web / Cliente)               │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│           FRONTEND  HTML/CSS/JS                  │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │index.html│  │style.css │  │   app.js        │ │
│  │(SPA DOM) │  │(Design   │  │(Controlador,    │ │
│  │          │  │ System)  │  │ CRUD, lógica)   │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │         config.js (Supabase URL + Key)        │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│            SUPABASE  REST API                    │
│                                                   │
│  ┌──────────────────────────────────────────────┐ │
│  │         supabaseClient.from('tabla')          │ │
│  │         .select() / .insert() / .update()     │ │
│  │         .delete() / .eq() / .order()          │ │
│  └──────────────────────────────────────────────┘ │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│               POSTGRESQL                         │
│                                                   │
│  ┌──────────┐  ┌──────────┐  ┌────────────────┐ │
│  │ 9 tablas │  │ Triggers │  │   Índices       │ │
│  │          │  │updated_at│  │  de búsqueda    │ │
│  └──────────┘  └──────────┘  └────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Componentes

### Frontend (SPA)
- `index.html`: Punto de entrada único. Contiene la estructura DOM de todos los módulos (secciones ocultas/mostradas según navegación).
- `style.css`: Design System con variables CSS (Design Tokens). Tipografía: Inter. Paleta de colores andina.
- `app.js`: Controlador principal (~1433 líneas). Maneja:
  - Inicialización de Supabase.
  - Navegación SPA (mostrar/ocultar secciones).
  - CRUD de todas las entidades.
  - Lógica de ventas e inventario.
  - Renderizado de reportes.
  - Notificaciones al usuario.
- `config.js`: Configuración de Supabase (URL y anonKey).

### Backend (Supabase)
- PostgreSQL con 9 tablas: usuarios, categorias, proveedores, productos, clientes, ventas, detalle_ventas, movimientos_inventario, alertas_stock.
- Triggers para actualización automática de `updated_at`.
- Función `actualizar_stock()` para descontar/aumentar stock en movimientos.
- Índices en columnas de búsqueda frecuente.

### Despliegue (Vercel)
- Configuración SPA: todas las rutas redirigen a `index.html`.
- Sin servidor Node.js — estático puro.
- Output directory en la raíz del proyecto.

## Flujo de datos

1. El usuario interactúa con la UI (click, formularios, etc.).
2. `app.js` construye consultas a la API REST de Supabase.
3. Supabase procesa la consulta contra PostgreSQL.
4. La respuesta se renderiza en el DOM mediante manipulación directa.
5. Las operaciones de escritura (INSERT/UPDATE/DELETE) se ejecutan contra Supabase y actualizan el estado local en memoria.
6. En modo offline, las operaciones solo afectan los arrays locales y no persisten.
