-- Insertar ciudades
INSERT INTO public.ciudad (nombre) VALUES
('Bogotá'),
('Medellín'),
('Cali'),
('Barranquilla'),
('Cartagena'),
('Bucaramanga'),
('Santa Marta');

-- Insertar rutas
INSERT INTO public.ruta (nombre, id_ciudad_origen, id_ciudad_destino, fecha_apertura, costo_actual, estado) VALUES
('Ruta BOG-MED', 1, 2, '2024-01-01', 250000, 'ACTIVA'),
('Ruta BOG-CAL', 1, 3, '2024-01-01', 280000, 'ACTIVA'),
('Ruta MED-BAR', 2, 4, '2024-01-01', 320000, 'ACTIVA'),
('Ruta CAL-CAR', 3, 5, '2024-01-01', 300000, 'ACTIVA'),
('Ruta BOG-BUC', 1, 6, '2024-01-01', 220000, 'ACTIVA');

-- Insertar conductores
INSERT INTO public.conductor (identificacion, nombres, apellidos, telefono, direccion, fecha_ingreso, fecha_asignacion, id_ruta) VALUES
('1001234567', 'Juan Carlos', 'Pérez Gómez', '3101234567', 'Calle 123 #45-67', '2024-01-01', '2024-01-02', 1),
('1002345678', 'Pedro Antonio', 'García López', '3112345678', 'Carrera 45 #12-34', '2024-01-01', '2024-01-02', 2),
('1003456789', 'Luis Miguel', 'Rodríguez Díaz', '3123456789', 'Avenida 67 #89-12', '2024-01-01', '2024-01-02', 3),
('1004567890', 'Carlos Alberto', 'Martínez Ruiz', '3134567890', 'Calle 89 #23-45', '2024-01-01', '2024-01-02', 4),
('1005678901', 'José Manuel', 'López Castro', '3145678901', 'Carrera 12 #34-56', '2024-01-01', '2024-01-02', 5);

-- Insertar proveedores
INSERT INTO public.proveedor (nit, nombre, persona_contacto, telefono, direccion, activo) VALUES
('900123456-1', 'Distribuidora Nacional S.A.S', 'Ana María González', '6011234567', 'Calle Industrial 45-67', true),
('900234567-2', 'Alimentos del Valle S.A', 'Carlos Ramírez', '6022345678', 'Avenida Comercial 89-12', true),
('900345678-3', 'Productos Alimenticios S.A', 'Diana Torres', '6033456789', 'Carrera Empresarial 23-45', true),
('900456789-4', 'Distribuidora Central Ltda', 'Eduardo Sánchez', '6044567890', 'Calle Principal 78-90', true);

-- Insertar productos
INSERT INTO public.producto (nombre, descripcion, precio_unitario, id_proveedor) VALUES
('Arroz Premium 500g', 'Arroz de primera calidad', 3500, 1),
('Aceite Vegetal 1L', 'Aceite vegetal refinado', 8500, 1),
('Frijol Rojo 500g', 'Frijol rojo seleccionado', 4500, 2),
('Azúcar Blanca 1kg', 'Azúcar refinada', 5000, 2),
('Pasta Espagueti 500g', 'Pasta de trigo', 3000, 3),
('Atún en Agua 170g', 'Atún en lata', 4500, 3),
('Leche en Polvo 400g', 'Leche entera en polvo', 12000, 4),
('Café Molido 500g', 'Café premium', 15000, 4);

-- Insertar clientes
INSERT INTO public.cliente (identificacion, nombre, telefono, direccion, id_ciudad) VALUES
('800123456-1', 'Supermercado El Ahorro', '3201234567', 'Calle Comercial 45-67', 1),
('800234567-2', 'Tienda La Economía', '3212345678', 'Avenida Principal 89-12', 2),
('800345678-3', 'Minimercado La Esquina', '3223456789', 'Carrera Central 23-45', 3),
('800456789-4', 'Autoservicio El Vecino', '3234567890', 'Calle Mayor 78-90', 4),
('800567890-5', 'Mercado Express', '3245678901', 'Avenida Central 12-34', 5);

-- Insertar ventas
INSERT INTO public.venta (id_cliente, id_ruta, fecha_venta, valor_total) VALUES
(1, 1, '2024-03-01', 500000),
(2, 2, '2024-03-01', 750000),
(3, 3, '2024-03-01', 620000),
(4, 4, '2024-03-01', 480000),
(5, 5, '2024-03-01', 930000);

-- Insertar detalles de venta
INSERT INTO public.detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 50, 3500, 175000),
(1, 2, 30, 8500, 255000),
(1, 3, 20, 4500, 90000),
(2, 4, 60, 5000, 300000),
(2, 5, 100, 3000, 300000),
(2, 6, 40, 4500, 180000),
(3, 7, 25, 12000, 300000),
(3, 8, 20, 15000, 300000),
(4, 1, 80, 3500, 280000),
(4, 2, 25, 8500, 212500),
(5, 3, 100, 4500, 450000),
(5, 4, 95, 5000, 475000);

-- Insertar entregas
INSERT INTO public.entrega (id_venta, fecha_entrega, estado_entrega) VALUES
(1, '2024-03-02', 'ENTREGADO'),
(2, '2024-03-02', 'ENTREGADO'),
(3, '2024-03-03', 'PENDIENTE'),
(4, '2024-03-03', 'PENDIENTE'),
(5, '2024-03-02', 'ENTREGADO');

-- Insertar gastos
INSERT INTO public.gasto (id_ruta, fecha_gasto, monto, descripcion) VALUES
(1, '2024-03-01', 150000, 'Combustible'),
(1, '2024-03-01', 50000, 'Peajes'),
(2, '2024-03-01', 180000, 'Combustible'),
(2, '2024-03-01', 45000, 'Peajes'),
(3, '2024-03-01', 200000, 'Combustible'),
(3, '2024-03-01', 60000, 'Peajes'),
(4, '2024-03-01', 170000, 'Combustible'),
(4, '2024-03-01', 55000, 'Peajes'),
(5, '2024-03-01', 140000, 'Combustible'),
(5, '2024-03-01', 40000, 'Peajes');

-- Insertar cambios de costo
INSERT INTO public.cambio_costo (id_ruta, fecha_cambio, monto) VALUES
(1, '2024-01-01', 250000),
(2, '2024-01-01', 280000),
(3, '2024-01-01', 320000),
(4, '2024-01-01', 300000),
(5, '2024-01-01', 220000); 