"use client"

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Edit, Plus, Trash2, Package } from "lucide-react"
import Link from "next/link"

interface Producto {
  id_producto: number
  nombre: string
  descripcion: string
  precio_unitario: number
  proveedor: {
    nombre: string
  } | null
}

async function getProductos() {
  const { data, error } = await supabase
    .from("producto")
    .select(`
      *,
      proveedor:proveedor(nombre, activo)
    `)
    .order("nombre")

  if (error) {
    console.error("Error fetching productos:", error)
    return []
  }
  return data || []
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadProductos() {
      const { data, error } = await supabase
        .from("producto")
        .select(`
          *,
          proveedor:proveedor(nombre)
        `)
        .order("nombre")

      if (error) {
        console.error("Error fetching productos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
        return
      }
      setProductos(data || [])
      setLoading(false)
    }

    loadProductos()
  }, [toast])

  const handleDelete = async (id: number) => {
    try {
      // Verificar si el producto tiene detalles de venta asociados
      const { data: detalles, error: detallesError } = await supabase
        .from("detalle_venta")
        .select("id_detalle")
        .eq("id_producto", id)
        .limit(1)

      if (detallesError) throw detallesError

      if (detalles && detalles.length > 0) {
        toast({
          title: "No se puede eliminar",
          description: "El producto ha sido vendido anteriormente y no puede ser eliminado",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("producto")
        .delete()
        .eq("id_producto", id)

      if (error) throw error

      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado exitosamente",
      })

      // Actualizar la lista de productos
      setProductos(productos.filter(producto => producto.id_producto !== id))
    } catch (error: any) {
      console.error("Error deleting producto:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el producto",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="p-4">Cargando productos...</div>
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Productos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Link href="/productos/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gestión de Productos
          </h1>
          <p className="text-muted-foreground">Administra el catálogo de productos disponibles</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Productos Registrados ({productos.length})</CardTitle>
            <CardDescription>Catálogo completo de productos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id_producto}>
                    <TableCell className="font-medium">{producto.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate">{producto.descripcion || "Sin descripción"}</TableCell>
                    <TableCell>${producto.precio_unitario.toLocaleString("es-CO")}</TableCell>
                    <TableCell>{producto.proveedor?.nombre}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/productos/${producto.id_producto}/editar`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El producto será eliminado permanentemente del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(producto.id_producto)}>
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
