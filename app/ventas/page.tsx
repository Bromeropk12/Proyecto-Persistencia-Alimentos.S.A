export const dynamic = "force-dynamic";

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
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
import { supabase } from "@/lib/supabase"
import { Plus, Edit, Trash2, ShoppingCart, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function VentasPage() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  async function loadVentas() {
    const { data, error } = await supabase
      .from("venta")
      .select(`
        *,
        cliente:cliente(nombre, identificacion),
        ruta:ruta(nombre)
      `)
      .order("fecha_venta", { ascending: false })

    if (error) {
      console.error("Error fetching ventas:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las ventas",
        variant: "destructive",
      })
      return
    }
    setVentas(data || [])
    setLoading(false)
  }

  useState(() => {
    loadVentas()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      // Primero eliminamos los detalles de la venta
      const { error: detallesError } = await supabase
        .from("detalle_venta")
        .delete()
        .eq("id_venta", id)

      if (detallesError) throw detallesError

      // Luego eliminamos la entrega asociada
      const { error: entregaError } = await supabase
        .from("entrega")
        .delete()
        .eq("id_venta", id)

      if (entregaError) throw entregaError

      // Finalmente eliminamos la venta
      const { error: ventaError } = await supabase
        .from("venta")
        .delete()
        .eq("id_venta", id)

      if (ventaError) throw ventaError

      toast({
        title: "Venta eliminada",
        description: "La venta se ha eliminado exitosamente",
      })

      // Recargar la lista de ventas
      loadVentas()
    } catch (error: any) {
      console.error("Error deleting venta:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la venta",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="p-4">Cargando ventas...</div>
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Ventas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Link href="/ventas/nueva">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Venta
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingCart className="h-8 w-8" />
            Gestión de Ventas
          </h1>
          <p className="text-muted-foreground">Administra las ventas realizadas a los clientes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ventas.length}</div>
              <p className="text-xs text-muted-foreground">Ventas registradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${ventas.reduce((sum, venta: any) => sum + venta.valor_total, 0).toLocaleString("es-CO")}
              </div>
              <p className="text-xs text-muted-foreground">En ventas totales</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $
                {ventas.length > 0
                  ? Math.round(
                      ventas.reduce((sum, venta: any) => sum + venta.valor_total, 0) / ventas.length,
                    ).toLocaleString("es-CO")
                  : 0}
              </div>
              <p className="text-xs text-muted-foreground">Por venta</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ventas Registradas ({ventas.length})</CardTitle>
            <CardDescription>Lista completa de ventas en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Valor Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((venta: any) => (
                  <TableRow key={venta.id_venta}>
                    <TableCell className="font-medium">#{venta.id_venta}</TableCell>
                    <TableCell>{new Date(venta.fecha_venta).toLocaleDateString("es-CO")}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{venta.cliente?.nombre}</div>
                        <div className="text-sm text-muted-foreground">{venta.cliente?.identificacion}</div>
                      </div>
                    </TableCell>
                    <TableCell>{venta.ruta?.nombre}</TableCell>
                    <TableCell>
                      <Badge variant="outline">${venta.valor_total.toLocaleString("es-CO")}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/ventas/${venta.id_venta}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/ventas/${venta.id_venta}/editar`}>
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
                              <AlertDialogTitle>¿Eliminar venta?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Se eliminará la venta y todos sus detalles.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(venta.id_venta)}>
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
