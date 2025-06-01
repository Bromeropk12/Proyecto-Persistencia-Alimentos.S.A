CREATE TABLE public.ciudad (
  id_ciudad integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar(100) NOT NULL UNIQUE
);

CREATE TABLE public.ruta (
  id_ruta integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar(150) NOT NULL UNIQUE,
  id_ciudad_origen integer NOT NULL REFERENCES public.ciudad(id_ciudad),
  id_ciudad_destino integer NOT NULL REFERENCES public.ciudad(id_ciudad),
  fecha_apertura date NOT NULL,
  costo_actual numeric(10,2) NOT NULL CHECK (costo_actual > 0),
  estado varchar(10) NOT NULL DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'CERRADA'))
);

CREATE TABLE public.cambio_costo (
  id_costo_ruta integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_ruta integer NOT NULL REFERENCES public.ruta(id_ruta),
  fecha_cambio date NOT NULL,
  monto numeric(10,2) NOT NULL CHECK (monto > 0)
);

CREATE TABLE public.conductor (
  id_conductor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  identificacion varchar(20) NOT NULL UNIQUE,
  nombres varchar(100) NOT NULL,
  apellidos varchar(100) NOT NULL,
  telefono varchar(15) NOT NULL,
  direccion varchar(200) NOT NULL,
  fecha_ingreso date NOT NULL,
  fecha_asignacion date,
  id_ruta integer REFERENCES public.ruta(id_ruta)
);

CREATE TABLE public.proveedor (
  id_proveedor integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nit varchar(20) NOT NULL UNIQUE,
  nombre varchar(150) NOT NULL,
  persona_contacto varchar(100) NOT NULL,
  telefono varchar(15) NOT NULL,
  direccion varchar(200) NOT NULL,
  activo boolean NOT NULL DEFAULT true
);

CREATE TABLE public.producto (
  id_producto integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nombre varchar(150) NOT NULL,
  descripcion text,
  precio_unitario numeric(10,2) NOT NULL CHECK (precio_unitario >= 0),
  id_proveedor integer NOT NULL REFERENCES public.proveedor(id_proveedor)
);

CREATE TABLE public.cliente (
  id_cliente integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  identificacion varchar(20) NOT NULL UNIQUE,
  nombre varchar(150) NOT NULL,
  telefono varchar(15) NOT NULL,
  direccion varchar(200) NOT NULL,
  id_ciudad integer NOT NULL REFERENCES public.ciudad(id_ciudad)
);

CREATE TABLE public.venta (
  id_venta integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_cliente integer NOT NULL REFERENCES public.cliente(id_cliente),
  id_ruta integer NOT NULL REFERENCES public.ruta(id_ruta),
  fecha_venta date NOT NULL,
  valor_total numeric(12,2) NOT NULL CHECK (valor_total > 0)
);

CREATE TABLE public.detalle_venta (
  id_detalle integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_venta integer NOT NULL REFERENCES public.venta(id_venta),
  id_producto integer NOT NULL REFERENCES public.producto(id_producto),
  cantidad integer NOT NULL CHECK (cantidad > 0),
  precio_unitario numeric(10,2) NOT NULL CHECK (precio_unitario > 0),
  subtotal numeric(12,2) NOT NULL
);

CREATE TABLE public.entrega (
  id_entrega integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_venta integer NOT NULL REFERENCES public.venta(id_venta),
  fecha_entrega date NOT NULL,
  estado_entrega varchar(15) NOT NULL DEFAULT 'PENDIENTE' CHECK (estado_entrega IN ('PENDIENTE', 'ENTREGADO', 'DEVUELTO'))
);

CREATE TABLE public.gasto (
  id_gasto integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  id_ruta integer NOT NULL REFERENCES public.ruta(id_ruta),
  fecha_gasto date NOT NULL,
  monto numeric(10,2) NOT NULL CHECK (monto >= 0),
  descripcion varchar(255) NOT NULL
);
