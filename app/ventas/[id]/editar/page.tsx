"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, ShoppingCart, Plus, Trash2 } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id_cliente: number
  nombre: string
  identificacion: string
}

interface Ruta {
  id_ruta: number
  nombre: string
}

interface Producto {
  id_producto: number
  nombre: string
  precio_unitario: number
}

interface DetalleVenta {
  id_detalle?: number
  id_producto: number
  producto_nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export default function EditarVentaPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_ruta: "",
    fecha_venta: "",
  })
  const [detalles, setDetalles] = useState<DetalleVenta[]>([])
  const [nuevoDetalle, setNuevoDetalle] = useState({
    id_producto: "",
    cantidad: "",
    precio_unitario: "",
  })

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const valorTotal = detalles.reduce((sum, detalle) => sum + detalle.subtotal, 0)

  useEffect(() => {
    async function fetchData() {
      try {
        // Cargar datos de la venta
        const { data: venta, error: ventaError } = await supabase
          .from("venta")
          .select(`
            *,
            detalle_venta(
              id_detalle,
              id_producto,
              cantidad,
              precio_unitario,
              subtotal,
              producto(nombre)
            )
          `)
          .eq("id_venta", params.id)
          .single()

        if (ventaError) throw ventaError

        // Cargar datos maestros
        const [clientesRes, rutasRes, productosRes] = await Promise.all([
          supabase.from("cliente").select("*").order("nombre"),
          supabase.from("ruta").select("*").eq("estado", "ACTIVA").order("nombre"),
          supabase.from("producto").select("*").order("nombre"),
        ])

        if (clientesRes.error) throw clientesRes.error
        if (rutasRes.error) throw rutasRes.error
        if (productosRes.error) throw productosRes.error

        // Actualizar estado
        setFormData({
          id_cliente: venta.id_cliente.toString(),
          id_ruta: venta.id_ruta.toString(),
          fecha_venta: venta.fecha_venta,
        })

        setDetalles(
          venta.detalle_venta.map((detalle: any) => ({
            id_detalle: detalle.id_detalle,
            id_producto: detalle.id_producto,
            producto_nombre: detalle.producto.nombre,
            cantidad: detalle.cantidad,
            precio_unitario: detalle.precio_unitario,
            subtotal: detalle.subtotal,
          }))
        )

        setClientes(clientesRes.data || [])
        setRutas(rutasRes.data || [])
        setProductos(productosRes.data || [])
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la venta",
          variant: "destructive",
        })
      }
    }

    fetchData()
  }, [params.id])

  const agregarDetalle = () => {
    if (!nuevoDetalle.id_producto || !nuevoDetalle.cantidad || !nuevoDetalle.precio_unitario) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos del producto",
        variant: "destructive",
      })
      return
    }

    const producto = productos.find((p: any) => p.id_producto === Number(nuevoDetalle.id_producto))
    if (!producto) return

    const cantidad = Number(nuevoDetalle.cantidad)
    const precio = Number(nuevoDetalle.precio_unitario)
    const subtotal = cantidad * precio

    setDetalles([
      ...detalles,
      {
        id_producto: Number(nuevoDetalle.id_producto),
        producto_nombre: producto.nombre,
        cantidad,
        precio_unitario: precio,
        subtotal,
      },
    ])

    setNuevoDetalle({
      id_producto: "",
      cantidad: "",
      precio_unitario: "",
    })
  }

  const eliminarDetalle = (index: number) => {
    setDetalles(detalles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (detalles.length === 0) {
      toast({
        title: "Error",
        description: "Agrega al menos un producto a la venta",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Actualizar la venta
      const { error: ventaError } = await supabase
        .from("venta")
        .update({
          id_cliente: Number(formData.id_cliente),
          id_ruta: Number(formData.id_ruta),
          fecha_venta: formData.fecha_venta,
          valor_total: valorTotal,
        })
        .eq("id_venta", params.id)

      if (ventaError) throw ventaError

      // Eliminar detalles anteriores
      const { error: deleteError } = await supabase
        .from("detalle_venta")
        .delete()
        .eq("id_venta", params.id)

      if (deleteError) throw deleteError

      // Crear nuevos detalles
      const detallesData = detalles.map((detalle) => ({
        id_venta: Number(params.id),
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: detalle.precio_unitario,
        subtotal: detalle.subtotal,
      }))

      const { error: detallesError } = await supabase.from("detalle_venta").insert(detallesData)

      if (detallesError) throw detallesError

      toast({
        title: "Venta actualizada",
        description: "La venta se ha actualizado exitosamente.",
      })

      router.push("/ventas")
    } catch (error: any) {
      console.error("Error updating venta:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la venta.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProductoChange = (productoId: string) => {
    const producto = productos.find((p: any) => p.id_producto === Number(productoId))
    if (producto) {
      setNuevoDetalle({
        ...nuevoDetalle,
        id_producto: productoId,
        precio_unitario: producto.precio_unitario.toString(),
      })
    }
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/ventas">Ventas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar Venta #{params.id}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/ventas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShoppingCart className="h-8 w-8" />
              Editar Venta #{params.id}
            </h1>
            <p className="text-muted-foreground">Modifica los detalles de la venta</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Información de la venta */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Venta</CardTitle>
                <CardDescription>Datos básicos de la venta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="id_cliente">Cliente *</Label>
                  <Select
                    value={formData.id_cliente}
                    onValueChange={(value) => setFormData({ ...formData, id_cliente: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientes.map((cliente: any) => (
                        <SelectItem key={cliente.id_cliente} value={cliente.id_cliente.toString()}>
                          {cliente.nombre} - {cliente.identificacion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_ruta">Ruta *</Label>
                  <Select
                    value={formData.id_ruta}
                    onValueChange={(value) => setFormData({ ...formData, id_ruta: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {rutas.map((ruta: any) => (
                        <SelectItem key={ruta.id_ruta} value={ruta.id_ruta.toString()}>
                          {ruta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_venta">Fecha de Venta *</Label>
                  <Input
                    id="fecha_venta"
                    type="date"
                    value={formData.fecha_venta}
                    onChange={(e) => setFormData({ ...formData, fecha_venta: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="text-2xl font-bold">Total: ${valorTotal.toLocaleString("es-CO")}</div>
                </div>
              </CardContent>
            </Card>

            {/* Agregar productos */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Producto</CardTitle>
                <CardDescription>Selecciona productos para la venta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="producto">Producto</Label>
                  <Select value={nuevoDetalle.id_producto} onValueChange={handleProductoChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto: any) => (
                        <SelectItem key={producto.id_producto} value={producto.id_producto.toString()}>
                          {producto.nombre} - ${producto.precio_unitario.toLocaleString("es-CO")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cantidad">Cantidad</Label>
                    <Input
                      id="cantidad"
                      type="number"
                      value={nuevoDetalle.cantidad}
                      onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, cantidad: e.target.value })}
                      placeholder="1"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="precio">Precio Unitario</Label>
                    <Input
                      id="precio"
                      type="number"
                      step="0.01"
                      value={nuevoDetalle.precio_unitario}
                      onChange={(e) => setNuevoDetalle({ ...nuevoDetalle, precio_unitario: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Button type="button" onClick={agregarDetalle} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Producto
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Lista de productos */}
          {detalles.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Productos en la Venta ({detalles.length})</CardTitle>
                <CardDescription>Lista de productos agregados</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Precio Unitario</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {detalles.map((detalle, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{detalle.producto_nombre}</TableCell>
                        <TableCell>{detalle.cantidad}</TableCell>
                        <TableCell>${detalle.precio_unitario.toLocaleString("es-CO")}</TableCell>
                        <TableCell>${detalle.subtotal.toLocaleString("es-CO")}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => eliminarDetalle(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4">
            <Button type="submit" disabled={loading || detalles.length === 0} className="flex-1">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
            <Link href="/ventas">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
} 