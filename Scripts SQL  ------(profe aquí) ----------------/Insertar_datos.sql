-- Insertar ciudades
INSERT INTO public.ciudad (nombre) VALUES
('Bogotá'),
('Medellín'),
('Cali'),
('Barranquilla'),
('Cartagena'),
('Bucaramanga'),
('Santa Marta'),
('Pereira'),
('Manizales'),
('Ibagué'),
('Villavicencio'),
('Pasto'),
('Neiva');

-- Insertar rutas
INSERT INTO public.ruta (nombre, id_ciudad_origen, id_ciudad_destino, fecha_apertura, costo_actual, estado) VALUES
('Ruta BOG-MED', 1, 2, '2025-02-05', 380000, 'ACTIVA'),
('Ruta BOG-CAL', 1, 3, '2025-02-05', 420000, 'ACTIVA'),
('Ruta MED-BAR', 2, 4, '2025-02-05', 450000, 'ACTIVA'),
('Ruta CAL-CAR', 3, 5, '2025-02-05', 480000, 'ACTIVA'),
('Ruta BOG-BUC', 1, 6, '2025-02-05', 320000, 'ACTIVA'),
('Ruta MED-PER', 2, 8, '2025-02-15', 280000, 'ACTIVA'),
('Ruta BOG-VLL', 1, 11, '2025-02-20', 290000, 'ACTIVA'),
('Ruta CAL-PAS', 3, 12, '2025-02-25', 350000, 'ACTIVA'),
('Ruta BOG-NEI', 1, 13, '2025-03-01', 270000, 'ACTIVA'),
('Ruta MED-MAN', 2, 9, '2025-03-05', 260000, 'ACTIVA');

-- Insertar conductores
INSERT INTO public.conductor (identificacion, nombres, apellidos, telefono, direccion, fecha_ingreso, fecha_asignacion, id_ruta) VALUES
('1001234567', 'Juan Carlos', 'Pérez Gómez', '3101234567', 'Calle 123 #45-67, Bogotá', '2025-02-05', '2025-02-06', 1),
('1002345678', 'Pedro Antonio', 'García López', '3112345678', 'Carrera 45 #12-34, Medellín', '2025-02-05', '2025-02-06', 2),
('1003456789', 'Luis Miguel', 'Rodríguez Díaz', '3123456789', 'Avenida 67 #89-12, Cali', '2025-02-05', '2025-02-06', 3),
('1004567890', 'Carlos Alberto', 'Martínez Ruiz', '3134567890', 'Calle 89 #23-45, Barranquilla', '2025-02-05', '2025-02-06', 4),
('1005678901', 'José Manuel', 'López Castro', '3145678901', 'Carrera 12 #34-56, Cartagena', '2025-02-05', '2025-02-06', 5),
('1006789012', 'Miguel Ángel', 'Ramírez Torres', '3156789012', 'Avenida 34 #56-78, Bogotá', '2025-02-15', '2025-02-16', 6),
('1007890123', 'Diego Fernando', 'Sánchez Mora', '3167890123', 'Calle 56 #78-90, Medellín', '2025-02-20', '2025-02-21', 7),
('1008901234', 'Andrés Felipe', 'Torres Vargas', '3178901234', 'Carrera 78 #90-12, Cali', '2025-02-25', '2025-02-26', 8),
('1009012345', 'Ricardo José', 'Vargas Ruiz', '3189012345', 'Avenida 90 #12-34, Bogotá', '2025-03-01', '2025-03-02', 9),
('1010123456', 'Fernando David', 'Mora Silva', '3190123456', 'Calle 12 #34-56, Medellín', '2025-03-05', '2025-03-06', 10);

-- Insertar proveedores
INSERT INTO public.proveedor (nit, nombre, persona_contacto, telefono, direccion, activo) VALUES
('900123456-1', 'Distribuidora Nacional S.A.S', 'Ana María González', '6011234567', 'Zona Industrial Bogotá, Calle 13 #54-67', true),
('900234567-2', 'Alimentos del Valle S.A', 'Carlos Ramírez', '6022345678', 'Zona Industrial Yumbo, Km 6', true),
('900345678-3', 'Productos Alimenticios S.A', 'Diana Torres', '6033456789', 'Zona Industrial Medellín, Carrera 50 #23-45', true),
('900456789-4', 'Distribuidora Central Ltda', 'Eduardo Sánchez', '6044567890', 'Parque Industrial Barranquilla, Bodega 78', true),
('900567890-5', 'Importadora de Alimentos S.A.S', 'María Fernanda López', '6055678901', 'Centro Empresarial Bogotá, Torre Norte', true),
('900678901-6', 'Comercializadora del Caribe Ltda', 'Roberto Carlos Pérez', '6066789012', 'Zona Franca Cartagena, Bodega 12', true);

-- Insertar productos
INSERT INTO public.producto (nombre, descripcion, precio_unitario, id_proveedor) VALUES
('Arroz Premium 500g', 'Arroz de primera calidad', 4200, 1),
('Aceite Vegetal 1L', 'Aceite vegetal refinado', 12500, 1),
('Frijol Rojo 500g', 'Frijol rojo seleccionado', 6800, 2),
('Azúcar Blanca 1kg', 'Azúcar refinada', 7200, 2),
('Pasta Espagueti 500g', 'Pasta de trigo', 4500, 3),
('Atún en Agua 170g', 'Atún en lata', 6800, 3),
('Leche en Polvo 400g', 'Leche entera en polvo', 15800, 4),
('Café Molido 500g', 'Café premium', 18500, 4),
('Chocolate en Barra 500g', 'Chocolate para mesa', 8900, 5),
('Galletas Pack 12u', 'Galletas surtidas', 5600, 5),
('Sal Refinada 1kg', 'Sal de mesa', 2800, 6),
('Panela 1kg', 'Panela tradicional', 4500, 6);

-- Insertar clientes
INSERT INTO public.cliente (identificacion, nombre, telefono, direccion, id_ciudad) VALUES
('800123456-1', 'Supermercado El Ahorro', '3201234567', 'Calle Comercial 45-67, Bogotá', 1),
('800234567-2', 'Tienda La Economía', '3212345678', 'Avenida Principal 89-12, Medellín', 2),
('800345678-3', 'Minimercado La Esquina', '3223456789', 'Carrera Central 23-45, Cali', 3),
('800456789-4', 'Autoservicio El Vecino', '3234567890', 'Calle Mayor 78-90, Barranquilla', 4),
('800567890-5', 'Mercado Express', '3245678901', 'Avenida Central 12-34, Cartagena', 5),
('800678901-6', 'Tiendas del Barrio', '3256789012', 'Calle 45 #67-89, Bucaramanga', 6),
('800789012-7', 'Mercado Popular', '3267890123', 'Carrera 67 #89-12, Santa Marta', 7),
('800890123-8', 'Supertienda La Mejor', '3278901234', 'Avenida 89 #12-34, Pereira', 8);

-- Insertar ventas (Febrero a Mayo 2025)
INSERT INTO public.venta (id_cliente, id_ruta, fecha_venta, valor_total) VALUES
(1, 1, '2025-02-10', 850000),
(2, 2, '2025-02-15', 920000),
(3, 3, '2025-02-20', 780000),
(4, 4, '2025-03-01', 690000),
(5, 5, '2025-03-05', 1250000),
(6, 6, '2025-03-15', 980000),
(7, 7, '2025-03-20', 845000),
(8, 8, '2025-04-01', 1120000),
(1, 9, '2025-04-10', 930000),
(2, 10, '2025-04-15', 875000),
(3, 1, '2025-04-20', 960000),
(4, 2, '2025-05-01', 1350000),
(5, 3, '2025-05-10', 890000),
(6, 4, '2025-05-15', 920000),
(7, 5, '2025-05-20', 1180000);

-- Insertar detalles de venta
INSERT INTO public.detalle_venta (id_venta, id_producto, cantidad, precio_unitario, subtotal) VALUES
(1, 1, 100, 4200, 420000),
(1, 2, 50, 12500, 625000),
(2, 3, 80, 6800, 544000),
(2, 4, 120, 7200, 864000),
(3, 5, 150, 4500, 675000),
(3, 6, 100, 6800, 680000),
(4, 7, 40, 15800, 632000),
(4, 8, 35, 18500, 647500),
(5, 9, 90, 8900, 801000),
(5, 10, 100, 5600, 560000);

-- Insertar entregas
INSERT INTO public.entrega (id_venta, fecha_entrega, estado_entrega) VALUES
(1, '2025-02-11', 'ENTREGADO'),
(2, '2025-02-16', 'ENTREGADO'),
(3, '2025-02-21', 'ENTREGADO'),
(4, '2025-03-02', 'ENTREGADO'),
(5, '2025-03-06', 'ENTREGADO'),
(6, '2025-03-16', 'ENTREGADO'),
(7, '2025-03-21', 'ENTREGADO'),
(8, '2025-04-02', 'ENTREGADO'),
(9, '2025-04-11', 'ENTREGADO'),
(10, '2025-04-16', 'ENTREGADO'),
(11, '2025-04-21', 'ENTREGADO'),
(12, '2025-05-02', 'ENTREGADO'),
(13, '2025-05-11', 'PENDIENTE'),
(14, '2025-05-16', 'PENDIENTE'),
(15, '2025-05-21', 'PENDIENTE');

-- Insertar gastos
INSERT INTO public.gasto (id_ruta, fecha_gasto, monto, descripcion) VALUES
(1, '2025-02-10', 180000, 'Combustible'),
(1, '2025-02-10', 65000, 'Peajes'),
(2, '2025-02-15', 195000, 'Combustible'),
(2, '2025-02-15', 55000, 'Peajes'),
(3, '2025-03-01', 220000, 'Combustible'),
(3, '2025-03-01', 75000, 'Peajes'),
(4, '2025-03-15', 185000, 'Combustible'),
(4, '2025-03-15', 60000, 'Peajes'),
(5, '2025-04-01', 175000, 'Combustible'),
(5, '2025-04-01', 50000, 'Peajes'),
(6, '2025-04-15', 190000, 'Combustible y mantenimiento'),
(7, '2025-05-01', 205000, 'Combustible'),
(8, '2025-05-10', 195000, 'Combustible y peajes'),
(9, '2025-05-15', 180000, 'Combustible'),
(10, '2025-05-20', 210000, 'Combustible y mantenimiento');

-- Insertar cambios de costo
INSERT INTO public.cambio_costo (id_ruta, fecha_cambio, monto) VALUES
(1, '2025-02-05', 380000),
(2, '2025-02-05', 420000),
(3, '2025-02-05', 450000),
(4, '2025-02-05', 480000),
(5, '2025-02-05', 320000),
(6, '2025-02-15', 280000),
(7, '2025-02-20', 290000),
(8, '2025-02-25', 350000),
(9, '2025-03-01', 270000),
(10, '2025-03-05', 260000); 