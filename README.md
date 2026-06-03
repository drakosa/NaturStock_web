# NaturaStock Cusco

Sistema de gestión e inventario para productos naturales.
Desarrollado con HTML, CSS y JavaScript puro, con base de datos en Supabase.

## Tecnologías

- HTML5
- CSS3 (Design System propio basado en Google Stitch)
- JavaScript (Vanilla JS, SPA)
- Supabase (PostgreSQL)
- Vercel (Deployment)

## Módulos

1. **Inicio de Sesión** - Login local (admin / 123456)
2. **Dashboard** - Estadísticas, gráficos, movimientos recientes
3. **Productos** - CRUD completo con búsqueda y filtros
4. **Inventario** - Entradas/Salidas con historial
5. **Reportes** - Stock bajo, agotados, valor total, categorías
6. **Perfil** - Información del usuario y cierre de sesión

## Instalación y Despliegue

### 1. Crear proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) e inicia sesión
2. Crea un nuevo proyecto
3. Espera a que se cree la base de datos

### 2. Ejecutar el schema SQL

1. En tu proyecto de Supabase, ve al **SQL Editor**
2. Abre el archivo `supabase-schema.sql` de este proyecto
3. Copia todo el contenido y pégalo en el editor
4. Haz clic en **Run** para ejecutar el script
5. Esto creará las tablas `productos` y `movimientos_inventario`, índices, triggers y datos de ejemplo

### 3. Configurar config.js

1. En Supabase, ve a **Project Settings > API**
2. Copia la **Project URL** (se ve como `https://xxx.supabase.co`)
3. Copia la **anon public key**
4. Abre `config.js` y reemplaza los valores:

```javascript
const SUPABASE_CONFIG = {
  url: 'https://tu-proyecto.supabase.co',
  anonKey: 'tu-anon-key-aqui'
};
```

### 4. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit: NaturaStock Cusco"
git remote add origin https://github.com/tu-usuario/naturastock-cusco.git
git branch -M main
git push -u origin main
```

### 5. Desplegar en Vercel

1. Ve a [https://vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **Import Project**
3. Selecciona el repositorio `naturastock-cusco`
4. Vercel detectará automáticamente la configuración `vercel.json`
5. Haz clic en **Deploy**
6. Espera a que termine el despliegue

### 6. Verificar funcionamiento

1. Abre la URL proporcionada por Vercel
2. Inicia sesión con:
   - **Usuario:** `admin`
   - **Contraseña:** `123456`
3. Verifica que los datos de ejemplo se carguen correctamente
4. Prueba las operaciones CRUD en cada módulo
5. Para modo online, configura Supabase en `config.js`

## Estructura del Proyecto

```
/
├── index.html           # Aplicación principal (SPA)
├── style.css            # Sistema de diseño (Design Tokens)
├── app.js               # Lógica de la aplicación
├── config.js            # Configuración de Supabase
├── supabase-schema.sql  # Esquema de base de datos
├── vercel.json          # Configuración de Vercel
└── README.md            # Este archivo
```

## Moneda

Todos los montos se muestran en **Soles Peruanos (S/)**.

## Diseño

Basado en prototipos de Google Stitch, paleta inspirada en paisajes andinos:
- **Verde Bosque (#154212)** - Color principal
- **Verde Salvia (#4a6549)** - Secundario
- **Beige Terroso (#383a37)** - Terciario
- **Superficie (#f8f9ff)** - Fondo
- Tipografía: **Inter**
