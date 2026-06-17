# Verificación

## Pruebas post-cambio

Después de cualquier modificación en el código, ejecutar estas verificaciones:

### 1. Login
- [ ] La página de login carga correctamente.
- [ ] Se puede iniciar sesión con admin / 123456.
- [ ] Tras iniciar sesión, redirige al dashboard.
- [ ] Si las credenciales son incorrectas, muestra error.

### 2. Dashboard
- [ ] Las estadísticas se cargan (productos, clientes, proveedores, valor inventario).
- [ ] Los movimientos recientes se muestran.
- [ ] Las ventas del día aparecen (si existen).

### 3. Productos
- [ ] La lista de productos se renderiza.
- [ ] La búsqueda por nombre/SKU funciona.
- [ ] Los filtros por categoría y estado funcionan.
- [ ] Se puede crear, editar y eliminar un producto.
- [ ] La paginación funciona correctamente.

### 4. Ventas
- [ ] Se puede registrar una venta nueva.
- [ ] El comprobante se genera correctamente.
- [ ] El stock del producto se descuenta.

### 5. Inventario
- [ ] Se puede registrar una entrada/salida.
- [ ] El historial de movimientos se muestra.
- [ ] El stock se actualiza correctamente.

### 6. Reportes
- [ ] Stock bajo muestra productos correctos.
- [ ] Agotados muestra productos con stock = 0.
- [ ] Valor total muestra cálculo correcto.
- [ ] Gráfico de distribución se renderiza.

### 7. Consola del navegador
- [ ] No hay errores en la consola (F12 → Console).
- [ ] No hay warnings de Supabase o red.
- [ ] Las peticiones a Supabase responden OK (200).

### 8. Git
- [ ] `git diff --stat` muestra solo los archivos esperados.
- [ ] No hay cambios accidentales en archivos no relacionados.
- [ ] No hay secretos o credenciales expuestas en el diff.

## Criterios para considerar un cambio exitoso

1. La aplicación funcional no se ha roto (todos los módulos principales operan).
2. No hay errores nuevos en consola del navegador.
3. Los datos se guardan y recuperan correctamente desde Supabase.
4. El `git status` muestra solo los archivos intencionalmente modificados.
5. No se modificaron archivos de configuración ni credenciales accidentalmente.
