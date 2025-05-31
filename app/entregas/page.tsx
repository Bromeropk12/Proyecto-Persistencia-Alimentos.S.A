export const dynamic = "force-dynamic";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { supabase } from "@/lib/supabase"
import { PackageCheck, Edit, Truck } from "lucide-react"
import Link from "next/link"

async function getEntregas() {
  const { data, error } = await supabase
    .from("entrega")
    .select(`
      *,
      venta:venta(
        valor_total,
        cliente:cliente(nombre, identificacion),
        ruta:ruta(nombre)
      )
    `)
    .order("fecha_entrega", { ascending: false })

  if (error) {
    console.error("Error fetching entregas:", error)
    return []
  }
  return data || []
}

export default async function EntregasPage() {
  const entregas = await getEntregas()

  const entregasPendientes = entregas.filter((e) => e.estado_entrega === "PENDIENTE")
  const entregasEntregadas = entregas.filter((e) => e.estado_entrega === "ENTREGADO")
  const entregasDevueltas = entregas.filter((e) => e.estado_entrega === "DEVUELTO")

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Entregas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <PackageCheck className="h-8 w-8" />
            Gestión de Entregas
          </h1>
          <p className="text-muted-foreground">Administra el estado de las entregas a los clientes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
              <PackageCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{entregas.length}</div>
              <p className="text-xs text-muted-foreground">Entregas registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
              <Truck className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{entregasPendientes.length}</div>
              <p className="text-xs text-muted-foreground">Por entregar</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entregadas</CardTitle>
              <PackageCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{entregasEntregadas.length}</div>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devueltas</CardTitle>
              <PackageCheck className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{entregasDevueltas.length}</div>
              <p className="text-xs text-muted-foreground">Devueltas</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entregas Registradas ({entregas.length})</CardTitle>
            <CardDescription>Lista completa de entregas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Entrega</TableHead>
                  <TableHead>Fecha Entrega</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entregas.map((entrega) => (
                  <TableRow key={entrega.id_entrega}>
                    <TableCell className="font-medium">#{entrega.id_entrega}</TableCell>
                    <TableCell>{new Date(entrega.fecha_entrega).toLocaleDateString("es-CO")}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entrega.venta?.cliente?.nombre}</div>
                        <div className="text-sm text-muted-foreground">{entrega.venta?.cliente?.identificacion}</div>
                      </div>
                    </TableCell>
                    <TableCell>{entrega.venta?.ruta?.nombre}</TableCell>
                    <TableCell>${entrega.venta?.valor_total?.toLocaleString("es-CO")}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entrega.estado_entrega === "ENTREGADO"
                            ? "default"
                            : entrega.estado_entrega === "PENDIENTE"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {entrega.estado_entrega}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/entregas/${entrega.id_entrega}/editar`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
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
