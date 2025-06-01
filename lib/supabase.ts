import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import type { Tables } from "@/lib/types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

type CiudadRow = Tables["ciudad"]["Row"]
type ClienteRow = Tables["cliente"]["Row"]
type ConductorRow = Tables["conductor"]["Row"]
type ProductoRow = Tables["producto"]["Row"]
type ProveedorRow = Tables["proveedor"]["Row"]
type RutaRow = Tables["ruta"]["Row"]
type VentaRow = Tables["venta"]["Row"]
type DetalleVentaRow = Tables["detalle_venta"]["Row"]
type EntregaRow = Tables["entrega"]["Row"]
type GastoRow = Tables["gasto"]["Row"]

export const productoService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("producto")
      .select(`
        *,
        proveedor:proveedor(*)
      `)
      .order("nombre")

    if (error) throw error
    return data as ProductoRow[]
  },

  create: async (producto: Omit<ProductoRow, "id_producto">) => {
    const { data, error } = await supabase.from("producto").insert([producto]).select().single()

    if (error) throw error
    return data as ProductoRow
  },

  update: async (id: number, producto: Partial<ProductoRow>) => {
    const { data, error } = await supabase.from("producto").update(producto).eq("id_producto", id).select().single()

    if (error) throw error
    return data as ProductoRow
  },

  delete: async (id: number) => {
    const { error } = await supabase.from("producto").delete().eq("id_producto", id)

    if (error) throw error
  },

  getById: async (id: number) => {
    const { data, error } = await supabase
      .from("producto")
      .select(`
        *,
        proveedor:proveedor(*)
      `)
      .eq("id_producto", id)
      .single()

    if (error) throw error
    return data as ProductoRow
  },
}

export const clienteService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("cliente")
      .select(`
        *,
        ciudad:ciudad(*)
      `)
      .order("nombre")

    if (error) throw error
    return data as ClienteRow[]
  },

  create: async (cliente: Omit<ClienteRow, "id_cliente">) => {
    const { data, error } = await supabase.from("cliente").insert([cliente]).select().single()

    if (error) throw error
    return data as ClienteRow
  },

  update: async (id: number, cliente: Partial<ClienteRow>) => {
    const { data, error } = await supabase.from("cliente").update(cliente).eq("id_cliente", id).select().single()

    if (error) throw error
    return data as ClienteRow
  },

  delete: async (id: number) => {
    const { error } = await supabase.from("cliente").delete().eq("id_cliente", id)

    if (error) throw error
  },

  getById: async (id: number) => {
    const { data, error } = await supabase
      .from("cliente")
      .select(`
        *,
        ciudad:ciudad(*)
      `)
      .eq("id_cliente", id)
      .single()

    if (error) throw error
    return data as ClienteRow
  },
}

export const proveedorService = {
  getAll: async () => {
    const { data, error } = await supabase.from("proveedor").select("*").order("nombre")

    if (error) throw error
    return data as ProveedorRow[]
  },

  create: async (proveedor: Omit<ProveedorRow, "id_proveedor">) => {
    const { data, error } = await supabase.from("proveedor").insert([proveedor]).select().single()

    if (error) throw error
    return data as ProveedorRow
  },

  update: async (id: number, proveedor: Partial<ProveedorRow>) => {
    const { data, error } = await supabase.from("proveedor").update(proveedor).eq("id_proveedor", id).select().single()

    if (error) throw error
    return data as ProveedorRow
  },

  delete: async (id: number) => {
    const { error } = await supabase.from("proveedor").delete().eq("id_proveedor", id)

    if (error) throw error
  },

  getById: async (id: number) => {
    const { data, error } = await supabase.from("proveedor").select("*").eq("id_proveedor", id).single()

    if (error) throw error
    return data as ProveedorRow
  },
}

// Funciones utilitarias para consultas
export const ciudadService = {
  getAll: async () => {
    const { data, error } = await supabase.from("ciudad").select("*").order("nombre")

    if (error) throw error
    return data as CiudadRow[]
  },

  create: async (ciudad: Omit<CiudadRow, "id_ciudad">) => {
    const { data, error } = await supabase.from("ciudad").insert([ciudad]).select().single()

    if (error) throw error
    return data as CiudadRow
  },

  update: async (id: number, ciudad: Partial<CiudadRow>) => {
    const { data, error } = await supabase.from("ciudad").update(ciudad).eq("id_ciudad", id).select().single()

    if (error) throw error
    return data as CiudadRow
  },

  delete: async (id: number) => {
    const { error } = await supabase.from("ciudad").delete().eq("id_ciudad", id)

    if (error) throw error
  },
}

export const conductorService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from("conductor")
      .select(`
        *,
        ruta:ruta(nombre, estado)
      `)
      .order("nombres")

    if (error) throw error
    return data
  },

  create: async (conductor: Tables["conductor"]["Insert"]) => {
    const { data, error } = await supabase.from("conductor").insert([conductor]).select().single()

    if (error) throw error
    return data
  },

  delete: async (id: number) => {
    // Verificar si el conductor tiene una ruta asignada
    const { data: conductor, error: checkError } = await supabase
      .from("conductor")
      .select("id_ruta")
      .eq("id_conductor", id)
      .single()

    if (checkError) throw checkError

    if (conductor.id_ruta) {
      throw new Error("El conductor tiene una ruta asignada y no puede ser eliminado")
    }

    const { error } = await supabase.from("conductor").delete().eq("id_conductor", id)

    if (error) throw error
  },

  getById: async (id: number) => {
    const { data, error } = await supabase
      .from("conductor")
      .select(`
        *,
        ruta:ruta(nombre, estado)
      `)
      .eq("id_conductor", id)
      .single()

    if (error) throw error
    return data
  },

  update: async (id: number, conductor: Tables["conductor"]["Update"]) => {
    const { data, error } = await supabase
      .from("conductor")
      .update(conductor)
      .eq("id_conductor", id)
      .select()
      .single()

    if (error) throw error
    return data
  },
}

export const rutaService = {
  getAll: async () => {
    const { data, error } = await supabase.from("ruta").select("*").order("nombre")

    if (error) throw error
    return data
  },

  create: async (ruta: Tables["ruta"]["Insert"]) => {
    const { data, error } = await supabase.from("ruta").insert([ruta]).select().single()

    if (error) throw error
    return data
  },

  update: async (id: number, ruta: Tables["ruta"]["Update"]) => {
    const { data, error } = await supabase
      .from("ruta")
      .update(ruta)
      .eq("id_ruta", id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  delete: async (id: number) => {
    // Verificar si la ruta tiene conductor asignado
    const { data: conductor, error: checkConductor } = await supabase
      .from("conductor")
      .select("id_conductor")
      .eq("id_ruta", id)
      .limit(1)

    if (checkConductor) throw checkConductor

    if (conductor && conductor.length > 0) {
      throw new Error("La ruta tiene un conductor asignado y no puede ser eliminada")
    }

    // Verificar si la ruta tiene ventas
    const { data: ventas, error: checkVentas } = await supabase
      .from("venta")
      .select("id_venta")
      .eq("id_ruta", id)
      .limit(1)

    if (checkVentas) throw checkVentas

    if (ventas && ventas.length > 0) {
      throw new Error("La ruta tiene ventas asociadas y no puede ser eliminada")
    }

    const { error } = await supabase.from("ruta").delete().eq("id_ruta", id)

    if (error) throw error
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
