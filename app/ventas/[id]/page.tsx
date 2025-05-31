export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { supabase } from "@/lib/supabase"
import { ArrowLeft, ShoppingCart, User, MapPin, Package, Calendar } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

async function getVentaDetails(id: string) {
  const { data: venta, error } = await supabase
    .from("venta")
    .select(`
      *,
      cliente:cliente(*),
      ruta:ruta(*),
      detalles:detalle_venta(
        *,
        producto:producto(*)
      ),
      entrega:entrega(*)
    `)
    .eq("id_venta", id)
    .single()

  if (error) {
    console.error("Error fetching venta:", error)
    return null
  }

  return venta
}

export default async function VentaDetallesPage({ params }: { params: { id: string } }) {
  const venta = await getVentaDetails(params.id)

  if (!venta) {
    notFound()
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
              <BreadcrumbPage>Venta #{venta.id_venta}</BreadcrumbPage>
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
              Venta #{venta.id_venta}
            </h1>
            <p className="text-muted-foreground">Detalles completos de la venta</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información del Cliente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium">{venta.cliente?.nombre}</p>
                <p className="text-sm text-muted-foreground">ID: {venta.cliente?.identificacion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Teléfono:</p>
                <p className="text-sm">{venta.cliente?.telefono}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Dirección:</p>
                <p className="text-sm">{venta.cliente?.direccion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Información de la Venta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Información de Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Venta:</p>
                <p className="text-sm">{new Date(venta.fecha_venta).toLocaleDateString("es-CO")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Total:</p>
                <p className="text-2xl font-bold text-green-600">${venta.valor_total.toLocaleString("es-CO")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Productos:</p>
                <p className="text-sm">{venta.detalles?.length || 0} artículos</p>
              </div>
            </CardContent>
          </Card>

          {/* Información de Ruta y Entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Ruta y Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ruta:</p>
                <p className="text-sm">{venta.ruta?.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Estado de Entrega:</p>
                <Badge
                  variant={
                    venta.entrega?.estado_entrega === "ENTREGADO"
                      ? "default"
                      : venta.entrega?.estado_entrega === "PENDIENTE"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {venta.entrega?.estado_entrega || "Sin entrega"}
                </Badge>
              </div>
              {venta.entrega && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fecha de Entrega:</p>
                  <p className="text-sm">{new Date(venta.entrega.fecha_entrega).toLocaleDateString("es-CO")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Detalles de Productos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Productos Vendidos
            </CardTitle>
            <CardDescription>Lista detallada de productos en esta venta</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Precio Unitario</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venta.detalles?.map((detalle: any) => (
                  <TableRow key={detalle.id_detalle}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{detalle.producto?.nombre}</p>
                        {detalle.producto?.descripcion && (
                          <p className="text-sm text-muted-foreground">{detalle.producto.descripcion}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{detalle.cantidad}</TableCell>
                    <TableCell>${detalle.precio_unitario.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="font-medium">${detalle.subtotal.toLocaleString("es-CO")}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total de la Venta:</span>
                <span className="text-2xl font-bold text-green-600">${venta.valor_total.toLocaleString("es-CO")}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4">
          <Link href={`/ventas/${venta.id_venta}/editar`}>
            <Button variant="outline">Editar Venta</Button>
          </Link>
          {venta.entrega && (
            <Link href={`/entregas/${venta.entrega.id_entrega}/editar`}>
              <Button variant="outline">Editar Entrega</Button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
