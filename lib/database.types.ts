export interface Database {
  public: {
    Tables: {
      ciudad: {
        Row: {
          id_ciudad: number
          nombre: string
        }
        Insert: {
          id_ciudad?: number
          nombre: string
        }
        Update: {
          id_ciudad?: number
          nombre?: string
        }
      }
      cliente: {
        Row: {
          id_cliente: number
          identificacion: string
          nombre: string
          telefono: string
          direccion: string
          id_ciudad: number
        }
        Insert: {
          id_cliente?: number
          identificacion: string
          nombre: string
          telefono: string
          direccion: string
          id_ciudad: number
        }
        Update: {
          id_cliente?: number
          identificacion?: string
          nombre?: string
          telefono?: string
          direccion?: string
          id_ciudad?: number
        }
      }
      conductor: {
        Row: {
          id_conductor: number
          identificacion: string
          nombres: string
          apellidos: string
          telefono: string
          fecha_ingreso: string
          id_ruta: number | null
        }
        Insert: {
          id_conductor?: number
          identificacion: string
          nombres: string
          apellidos: string
          telefono: string
          fecha_ingreso: string
          id_ruta?: number | null
        }
        Update: {
          id_conductor?: number
          identificacion?: string
          nombres?: string
          apellidos?: string
          telefono?: string
          fecha_ingreso?: string
          id_ruta?: number | null
        }
      }
      detalle_venta: {
        Row: {
          id_detalle: number
          id_venta: number
          id_producto: number
          cantidad: number
          precio_unitario: number
          subtotal: number
        }
        Insert: {
          id_detalle?: number
          id_venta: number
          id_producto: number
          cantidad: number
          precio_unitario: number
          subtotal: number
        }
        Update: {
          id_detalle?: number
          id_venta?: number
          id_producto?: number
          cantidad?: number
          precio_unitario?: number
          subtotal?: number
        }
      }
      entrega: {
        Row: {
          id_entrega: number
          id_venta: number
          fecha_entrega: string
          estado_entrega: string
        }
        Insert: {
          id_entrega?: number
          id_venta: number
          fecha_entrega: string
          estado_entrega: string
        }
        Update: {
          id_entrega?: number
          id_venta?: number
          fecha_entrega?: string
          estado_entrega?: string
        }
      }
      gasto: {
        Row: {
          id_gasto: number
          fecha_gasto: string
          descripcion: string
          valor: number
          id_ruta: number | null
        }
        Insert: {
          id_gasto?: number
          fecha_gasto: string
          descripcion: string
          valor: number
          id_ruta?: number | null
        }
        Update: {
          id_gasto?: number
          fecha_gasto?: string
          descripcion?: string
          valor?: number
          id_ruta?: number | null
        }
      }
      producto: {
        Row: {
          id_producto: number
          nombre: string
          descripcion: string | null
          precio_unitario: number
          id_proveedor: number
        }
        Insert: {
          id_producto?: number
          nombre: string
          descripcion?: string | null
          precio_unitario: number
          id_proveedor: number
        }
        Update: {
          id_producto?: number
          nombre?: string
          descripcion?: string | null
          precio_unitario?: number
          id_proveedor?: number
        }
      }
      proveedor: {
        Row: {
          id_proveedor: number
          identificacion: string
          nombre: string
          telefono: string
          direccion: string
          activo: boolean
        }
        Insert: {
          id_proveedor?: number
          identificacion: string
          nombre: string
          telefono: string
          direccion: string
          activo?: boolean
        }
        Update: {
          id_proveedor?: number
          identificacion?: string
          nombre?: string
          telefono?: string
          direccion?: string
          activo?: boolean
        }
      }
      ruta: {
        Row: {
          id_ruta: number
          nombre: string
          descripcion: string | null
          estado: string
        }
        Insert: {
          id_ruta?: number
          nombre: string
          descripcion?: string | null
          estado?: string
        }
        Update: {
          id_ruta?: number
          nombre?: string
          descripcion?: string | null
          estado?: string
        }
      }
      venta: {
        Row: {
          id_venta: number
          id_cliente: number
          id_ruta: number
          fecha_venta: string
          valor_total: number
        }
        Insert: {
          id_venta?: number
          id_cliente: number
          id_ruta: number
          fecha_venta: string
          valor_total: number
        }
        Update: {
          id_venta?: number
          id_cliente?: number
          id_ruta?: number
          fecha_venta?: string
          valor_total?: number
        }
      }
    }
  }
}
