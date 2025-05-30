import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para las tablas
export interface Ciudad {
  id_ciudad: number
  nombre: string
}

export interface Ruta {
  id_ruta: number
  nombre: string
  id_ciudad_origen: number
  id_ciudad_destino: number
  fecha_apertura: string
  costo_actual: number
  estado: "ACTIVA" | "CERRADA"
  ciudad_origen?: Ciudad
  ciudad_destino?: Ciudad
}

export interface Conductor {
  id_conductor: number
  identificacion: string
  nombres: string
  apellidos: string
  telefono: string
  direccion: string
  fecha_ingreso: string
  fecha_asignacion?: string
  id_ruta?: number
  ruta?: Ruta
}

export interface Proveedor {
  id_proveedor: number
  nit: string
  nombre: string
  persona_contacto: string
  telefono: string
  direccion: string
  activo: boolean
}

export interface Producto {
  id_producto: number
  nombre: string
  descripcion?: string
  precio_unitario: number
  id_proveedor: number
  proveedor?: Proveedor
}

export interface Cliente {
  id_cliente: number
  identificacion: string
  nombre: string
  telefono: string
  direccion: string
  id_ciudad: number
  ciudad?: Ciudad
}

export interface Venta {
  id_venta: number
  id_cliente: number
  id_ruta: number
  fecha_venta: string
  valor_total: number
  cliente?: Cliente
  ruta?: Ruta
}

export interface DetalleVenta {
  id_detalle: number
  id_venta: number
  id_producto: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto?: Producto
}

export interface Entrega {
  id_entrega: number
  id_venta: number
  fecha_entrega: string
  estado_entrega: "PENDIENTE" | "ENTREGADO" | "DEVUELTO"
  venta?: Venta
}

export interface Gasto {
  id_gasto: number
  id_ruta: number
  fecha_gasto: string
  monto: number
  descripcion: string
  ruta?: Ruta
}

// Funciones utilitarias para consultas
export const ciudadService = {
  getAll: async () => {
    const { data, error } = await supabase.from("ciudad").select("*").order("nombre")

    if (error) throw error
    return data as Ciudad[]
  },

  create: async (ciudad: Omit<Ciudad, "id_ciudad">) => {
    const { data, error } = await supabase.from("ciudad").insert([ciudad]).select().single()

    if (error) throw error
    return data as Ciudad
  },

  update: async (id: number, ciudad: Partial<Ciudad>) => {
    const { data, error } = await supabase.from("ciudad").update(ciudad).eq("id_ciudad", id).select().single()

    if (error) throw error
    return data as Ciudad
  },

  delete: async (id: number) => {
    const { error } = await supabase.from("ciudad").delete().eq("id_ciudad", id)

    if (error) throw error
  },
}

export const rutaService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("ruta")
      .select(`
        *,
        ciudad_origen:ciudad!ruta_id_ciudad_origen_fkey(*),
        ciudad_destino:ciudad!ruta_id_ciudad_destino_fkey(*)
      `)
      .order("nombre")

    if (error) throw error
    return data as Ruta[]
  },

  create: async (ruta: Omit<Ruta, "id_ruta">) => {
    const { data, error } = await supabase.from("ruta").insert([ruta]).select().single()

    if (error) throw error
    return data as Ruta
  },
}

export const conductorService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("conductor")
      .select(`
        *,
        ruta:ruta(*)
      `)
      .order("nombres")

    if (error) throw error
    return data as Conductor[]
  },

  create: async (conductor: Omit<Conductor, "id_conductor">) => {
    const { data, error } = await supabase.from("conductor").insert([conductor]).select().single()

    if (error) throw error
    return data as Conductor
  },
}

export const dashboardService = {
  getStats: async () => {
    try {
      const [
        ciudadesResult,
        rutasResult,
        conductoresResult,
        proveedoresResult,
        productosResult,
        clientesResult,
        ventasResult,
        entregasResult,
        ventasDataResult,
        gastosDataResult,
      ] = await Promise.all([
        supabase.from("ciudad").select("id_ciudad", { count: "exact", head: true }),
        supabase.from("ruta").select("id_ruta", { count: "exact", head: true }),
        supabase.from("conductor").select("id_conductor", { count: "exact", head: true }),
        supabase.from("proveedor").select("id_proveedor", { count: "exact", head: true }),
        supabase.from("producto").select("id_producto", { count: "exact", head: true }),
        supabase.from("cliente").select("id_cliente", { count: "exact", head: true }),
        supabase.from("venta").select("id_venta", { count: "exact", head: true }),
        supabase.from("entrega").select("id_entrega", { count: "exact", head: true }),
        supabase.from("venta").select("valor_total"),
        supabase.from("gasto").select("monto"),
      ])

      const totalVentasValor = ventasDataResult.data?.reduce((sum, venta) => sum + (venta.valor_total || 0), 0) || 0
      const totalGastos = gastosDataResult.data?.reduce((sum, gasto) => sum + (gasto.monto || 0), 0) || 0

      return {
        totalCiudades: ciudadesResult.count || 0,
        totalRutas: rutasResult.count || 0,
        totalConductores: conductoresResult.count || 0,
        totalProveedores: proveedoresResult.count || 0,
        totalProductos: productosResult.count || 0,
        totalClientes: clientesResult.count || 0,
        totalVentas: ventasResult.count || 0,
        totalEntregas: entregasResult.count || 0,
        totalVentasValor,
        totalGastos,
        rentabilidad: totalVentasValor - totalGastos,
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        totalCiudades: 0,
        totalRutas: 0,
        totalConductores: 0,
        totalProveedores: 0,
        totalProductos: 0,
        totalClientes: 0,
        totalVentas: 0,
        totalEntregas: 0,
        totalVentasValor: 0,
        totalGastos: 0,
        rentabilidad: 0,
      }
    }
  },
}
