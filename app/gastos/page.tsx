import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { supabase } from "@/lib/supabase"
import { Plus, Edit, Trash2, DollarSign, TrendingDown } from "lucide-react"
import Link from "next/link"

async function getGastos() {
  const { data, error } = await supabase
    .from("gasto")
    .select(`
      *,
      ruta:ruta(nombre)
    `)
    .order("fecha_gasto", { ascending: false })

  if (error) {
    console.error("Error fetching gastos:", error)
    return []
  }
  return data || []
}

export default async function GastosPage() {
  const gastos = await getGastos()
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)
  const gastosMesActual = gastos.filter((gasto) => new Date(gasto.fecha_gasto).getMonth() === new Date().getMonth())
  const totalMesActual = gastosMesActual.reduce((sum, gasto) => sum + gasto.monto, 0)

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Gastos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Link href="/gastos/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Gasto
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="h-8 w-8" />
            Gestión de Gastos
          </h1>
          <p className="text-muted-foreground">Administra los gastos operacionales por ruta</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{gastos.length}</div>
              <p className="text-xs text-muted-foreground">Gastos registrados</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${totalGastos.toLocaleString("es-CO")}</div>
              <p className="text-xs text-muted-foreground">En gastos totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">${totalMesActual.toLocaleString("es-CO")}</div>
              <p className="text-xs text-muted-foreground">{gastosMesActual.length} gastos</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gastos Registrados ({gastos.length})</CardTitle>
            <CardDescription>Lista completa de gastos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastos.map((gasto) => (
                  <TableRow key={gasto.id_gasto}>
                    <TableCell className="font-medium">#{gasto.id_gasto}</TableCell>
                    <TableCell>{new Date(gasto.fecha_gasto).toLocaleDateString("es-CO")}</TableCell>
                    <TableCell>{gasto.ruta?.nombre}</TableCell>
                    <TableCell className="max-w-xs truncate">{gasto.descripcion}</TableCell>
                    <TableCell className="font-medium text-red-600">${gasto.monto.toLocaleString("es-CO")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/gastos/${gasto.id_gasto}/editar`}>
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
