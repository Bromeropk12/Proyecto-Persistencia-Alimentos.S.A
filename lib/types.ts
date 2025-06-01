import type { Database } from "@/lib/database.types"

export type Tables = Database["public"]["Tables"]

export type Ciudad = Tables["ciudad"]["Row"]
export type Cliente = Tables["cliente"]["Row"] & {
  ciudad?: {
    nombre: string
  }
}
export type Conductor = Tables["conductor"]["Row"] & {
  ruta?: {
    nombre: string
    estado: string
  }
}
export type DetalleVenta = Tables["detalle_venta"]["Row"] & {
  producto?: {
    nombre: string
    descripcion: string | null
  }
}
export type Entrega = Tables["entrega"]["Row"] & {
  venta?: {
    valor_total: number
    cliente?: {
      nombre: string
      identificacion: string
    }
    ruta?: {
      nombre: string
    }
  }
}
export type Gasto = Tables["gasto"]["Row"] & {
  ruta?: {
    nombre: string
  }
}
export type Producto = Tables["producto"]["Row"] & {
  proveedor?: {
    nombre: string
    activo: boolean
  }
}
export type Proveedor = Tables["proveedor"]["Row"]
export type Ruta = Tables["ruta"]["Row"] & {
  conductor?: {
    identificacion: string
    nombres: string
    apellidos: string
  }
}
export type Venta = Tables["venta"]["Row"] & {
  cliente?: {
    nombre: string
    identificacion: string
    telefono: string
    direccion: string
  }
  ruta?: {
    nombre: string
  }
  detalle_venta?: DetalleVenta[]
  entrega?: {
    id_entrega: number
    fecha_entrega: string
    estado_entrega: string
  }
}
