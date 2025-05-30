import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { dashboardService } from "@/lib/supabase"
import {
  Users,
  Package,
  DollarSign,
  MapPin,
  Route,
  Building2,
  UserCheck,
  ShoppingCart,
  PackageCheck,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const stats = await dashboardService.getStats()

  const mainStats = [
    {
      title: "Ciudades",
      value: stats.totalCiudades,
      icon: MapPin,
      description: "Ciudades registradas",
      href: "/ciudades",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Rutas",
      value: stats.totalRutas,
      icon: Route,
      description: "Rutas de distribución",
      href: "/rutas",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Conductores",
      value: stats.totalConductores,
      icon: UserCheck,
      description: "Conductores activos",
      href: "/conductores",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Clientes",
      value: stats.totalClientes,
      icon: Users,
      description: "Clientes registrados",
      href: "/clientes",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ]

  const operationalStats = [
    {
      title: "Proveedores",
      value: stats.totalProveedores,
      icon: Building2,
      description: "Proveedores activos",
      href: "/proveedores",
    },
    {
      title: "Productos",
      value: stats.totalProductos,
      icon: Package,
      description: "Productos en catálogo",
      href: "/productos",
    },
    {
      title: "Ventas",
      value: stats.totalVentas,
      icon: ShoppingCart,
      description: "Ventas realizadas",
      href: "/ventas",
    },
    {
      title: "Entregas",
      value: stats.totalEntregas,
      icon: PackageCheck,
      description: "Entregas programadas",
      href: "/entregas",
    },
  ]

  const quickActions = [
    {
      title: "Nueva Venta",
      description: "Registrar una nueva venta",
      href: "/ventas/nueva",
      icon: ShoppingCart,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Nuevo Conductor",
      description: "Agregar conductor al sistema",
      href: "/conductores/nuevo",
      icon: UserCheck,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Nueva Ruta",
      description: "Crear nueva ruta de distribución",
      href: "/rutas/nueva",
      icon: Route,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      title: "Ver Reportes",
      description: "Consultar reportes y estadísticas",
      href: "/reportes",
      icon: TrendingUp,
      color: "bg-orange-600 hover:bg-orange-700",
    },
  ]

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Título y descripción */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Resumen general del sistema de gestión de ALIMENTAMOS S.A.</p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mainStats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Resumen Financiero */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumen Financiero
              </CardTitle>
              <CardDescription>Estado financiero actual del período</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Ventas</p>
                  </div>
                  <p className="text-2xl font-bold text-green-600">${stats.totalVentasValor.toLocaleString("es-CO")}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-muted-foreground">Total Gastos</p>
                  </div>
                  <p className="text-2xl font-bold text-red-600">${stats.totalGastos.toLocaleString("es-CO")}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-muted-foreground">Rentabilidad</p>
                  </div>
                  <p className={`text-2xl font-bold ${stats.rentabilidad >= 0 ? "text-green-600" : "text-red-600"}`}>
                    ${stats.rentabilidad.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Operaciones más frecuentes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <Button variant="outline" className="w-full justify-start h-auto p-4 hover:bg-muted/50">
                    <div className={`p-2 rounded-lg text-white mr-3 ${action.color}`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas operacionales */}
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Operacionales</CardTitle>
            <CardDescription>Resumen de las operaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {operationalStats.map((stat) => (
                <Link key={stat.title} href={stat.href}>
                  <div className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="p-2 bg-muted rounded-lg">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
