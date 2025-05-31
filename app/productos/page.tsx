export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { supabase } from "@/lib/supabase"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import Link from "next/link"

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

export default async function ProductosPage() {
  const productos = await getProductos()

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
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
