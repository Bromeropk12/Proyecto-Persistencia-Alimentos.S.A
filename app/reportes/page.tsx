import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { supabase } from "@/lib/supabase"
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Package, Truck } from "lucide-react"

async function getReportData() {
  try {
    // Obtener datos de ventas por mes
    const { data: ventasPorMes } = await supabase.from("venta").select("fecha_venta, valor_total").order("fecha_venta")

    // Obtener datos de gastos por mes
    const { data: gastosPorMes } = await supabase.from("gasto").select("fecha_gasto, monto").order("fecha_gasto")

    // Obtener productos más vendidos
    const { data: productosVendidos } = await supabase.from("detalle_venta").select(`
        cantidad,
        producto:producto(nombre)
      `)

    // Obtener rutas más activas
    const { data: rutasActivas } = await supabase.from("venta").select(`
        id_ruta,
        ruta:ruta(nombre)
      `)

    // Obtener estado de entregas
    const { data: estadoEntregas } = await supabase.from("entrega").select("estado_entrega")

    // Procesar datos para gráficos
    const ventasMensuales = processMonthlyData(ventasPorMes || [], "fecha_venta", "valor_total")
    const gastosMensuales = processMonthlyData(gastosPorMes || [], "fecha_gasto", "monto")
    const topProductos = processTopProducts(productosVendidos || [])
    const topRutas = processTopRoutes(rutasActivas || [])
    const entregasStats = processDeliveryStats(estadoEntregas || [])

    return {
      ventasMensuales,
      gastosMensuales,
      topProductos,
      topRutas,
      entregasStats,
    }
  } catch (error) {
    console.error("Error fetching report data:", error)
    return {
      ventasMensuales: [],
      gastosMensuales: [],
      topProductos: [],
      topRutas: [],
      entregasStats: { pendientes: 0, entregadas: 0, devueltas: 0 },
    }
  }
}

function processMonthlyData(data: any[], dateField: string, valueField: string) {
  const monthlyData: { [key: string]: number } = {}

  data.forEach((item) => {
    const date = new Date(item[dateField])
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    monthlyData[monthKey] = (monthlyData[monthKey] || 0) + item[valueField]
  })

  return Object.entries(monthlyData)
    .map(([month, value]) => ({ month, value }))
    .sort((a, b) => a.month.localeCompare(b.month))
    .slice(-6) // Últimos 6 meses
}

function processTopProducts(data: any[]) {
  const productCounts: { [key: string]: number } = {}

  data.forEach((item) => {
    const productName = item.producto?.nombre || "Producto desconocido"
    productCounts[productName] = (productCounts[productName] || 0) + item.cantidad
  })

  return Object.entries(productCounts)
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5) // Top 5
}

function processTopRoutes(data: any[]) {
  const routeCounts: { [key: string]: number } = {}

  data.forEach((item) => {
    const routeName = item.ruta?.nombre || "Ruta desconocida"
    routeCounts[routeName] = (routeCounts[routeName] || 0) + 1
  })

  return Object.entries(routeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5) // Top 5
}

function processDeliveryStats(data: any[]) {
  const stats = { pendientes: 0, entregadas: 0, devueltas: 0 }

  data.forEach((item) => {
    switch (item.estado_entrega) {
      case "PENDIENTE":
        stats.pendientes++
        break
      case "ENTREGADO":
        stats.entregadas++
        break
      case "DEVUELTO":
        stats.devueltas++
        break
    }
  })

  return stats
}

export default async function ReportesPage() {
  const reportData = await getReportData()

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Reportes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Reportes y Estadísticas
          </h1>
          <p className="text-muted-foreground">Análisis detallado del rendimiento del negocio</p>
        </div>

        {/* Ventas vs Gastos Mensuales */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Ventas Mensuales
              </CardTitle>
              <CardDescription>Evolución de ventas en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.ventasMensuales.map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-green-500 rounded"
                        style={{
                          width: `${
                            (item.value / Math.max(...reportData.ventasMensuales.map((v) => v.value))) * 100
                          }px`,
                          minWidth: "20px",
                        }}
                      />
                      <span className="text-sm font-bold">${item.value.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                Gastos Mensuales
              </CardTitle>
              <CardDescription>Evolución de gastos en los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.gastosMensuales.map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-red-500 rounded"
                        style={{
                          width: `${
                            (item.value / Math.max(...reportData.gastosMensuales.map((g) => g.value))) * 100
                          }px`,
                          minWidth: "20px",
                        }}
                      />
                      <span className="text-sm font-bold">${item.value.toLocaleString("es-CO")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Productos y Rutas Top */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos Más Vendidos
              </CardTitle>
              <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topProductos.map((producto, index) => (
                  <div key={producto.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                      <span className="text-sm font-medium">{producto.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-blue-500 rounded"
                        style={{
                          width: `${
                            (producto.quantity / Math.max(...reportData.topProductos.map((p) => p.quantity))) * 100
                          }px`,
                          minWidth: "20px",
                        }}
                      />
                      <span className="text-sm font-bold">{producto.quantity} unidades</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Rutas Más Activas
              </CardTitle>
              <CardDescription>Top 5 rutas por número de ventas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {reportData.topRutas.map((ruta, index) => (
                  <div key={ruta.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
                      <span className="text-sm font-medium">{ruta.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-2 bg-purple-500 rounded"
                        style={{
                          width: `${(ruta.count / Math.max(...reportData.topRutas.map((r) => r.count))) * 100}px`,
                          minWidth: "20px",
                        }}
                      />
                      <span className="text-sm font-bold">{ruta.count} ventas</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estado de Entregas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Estado de Entregas
            </CardTitle>
            <CardDescription>Distribución actual del estado de las entregas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{reportData.entregasStats.pendientes}</div>
                <div className="text-sm text-muted-foreground">Pendientes</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{reportData.entregasStats.entregadas}</div>
                <div className="text-sm text-muted-foreground">Entregadas</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">{reportData.entregasStats.devueltas}</div>
                <div className="text-sm text-muted-foreground">Devueltas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen Financiero */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Resumen Financiero
            </CardTitle>
            <CardDescription>Análisis de rentabilidad por período</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData.ventasMensuales.map((venta, index) => {
                const gastoMes = reportData.gastosMensuales.find((g) => g.month === venta.month)
                const gasto = gastoMes?.value || 0
                const rentabilidad = venta.value - gasto
                const margen = venta.value > 0 ? ((rentabilidad / venta.value) * 100).toFixed(1) : "0"

                return (
                  <div key={venta.month} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{venta.month}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-600">Ventas: ${venta.value.toLocaleString("es-CO")}</span>
                      <span className="text-red-600">Gastos: ${gasto.toLocaleString("es-CO")}</span>
                      <span className={`font-bold ${rentabilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
                        Rentabilidad: ${rentabilidad.toLocaleString("es-CO")} ({margen}%)
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
