import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

async function getRutas() {
  const { data: rutas, error } = await supabase
    .from("ruta")
    .select(`
      *,
      ciudad_origen:ciudad!ruta_id_ciudad_origen_fkey(nombre),
      ciudad_destino:ciudad!ruta_id_ciudad_destino_fkey(nombre)
    `)
    .order("nombre")

  if (error) {
    console.error("Error fetching rutas:", error)
    return []
  }

  return rutas || []
}

export default async function RutasPage() {
  const rutas = await getRutas()

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sidebar />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Gestión de Rutas</h1>
            <Link href="/rutas/nueva">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Ruta
              </Button>
            </Link>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Rutas de Distribución</CardTitle>
              <CardDescription>Gestiona las rutas de distribución entre ciudades</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Origen</TableHead>
                    <TableHead>Destino</TableHead>
                    <TableHead>Fecha Apertura</TableHead>
                    <TableHead>Costo Actual</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rutas.map((ruta) => (
                    <TableRow key={ruta.id_ruta}>
                      <TableCell className="font-medium">{ruta.nombre}</TableCell>
                      <TableCell>{ruta.ciudad_origen?.nombre}</TableCell>
                      <TableCell>{ruta.ciudad_destino?.nombre}</TableCell>
                      <TableCell>{new Date(ruta.fecha_apertura).toLocaleDateString()}</TableCell>
                      <TableCell>${ruta.costo_actual.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={ruta.estado === "ACTIVA" ? "default" : "secondary"}>{ruta.estado}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/rutas/${ruta.id_ruta}/editar`}>
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
        </main>
      </div>
    </div>
  )
}
