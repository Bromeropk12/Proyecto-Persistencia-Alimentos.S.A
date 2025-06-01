'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Ciudad {
  id_ciudad: number;
  nombre: string;
}

export default function CiudadesPage() {
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCiudades()
  }, [])

  async function fetchCiudades() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("vista_ciudades_registradas")
        .select("*")

      if (error) throw error
      setCiudades(data || [])
    } catch (error) {
      console.error("Error fetching ciudades:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar las ciudades"
      })
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteCiudad(id: number) {
    try {
      const { error } = await supabase
        .from("ciudad")
        .delete()
        .eq("id_ciudad", id)

      if (error) throw error

      toast({
        title: "Ciudad eliminada",
        description: "La ciudad ha sido eliminada exitosamente"
      })

      // Actualizar la lista de ciudades
      await fetchCiudades()
    } catch (error) {
      console.error("Error deleting ciudad:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar la ciudad"
      })
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Gestión de Ciudades</h1>
            <Link href="/ciudades/nueva">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nueva Ciudad
              </Button>
            </Link>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Ciudades Registradas</CardTitle>
              <CardDescription>Gestiona las ciudades disponibles para las rutas de distribución</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ciudades.map((ciudad) => (
                      <TableRow key={ciudad.id_ciudad}>
                        <TableCell className="font-medium">{ciudad.id_ciudad}</TableCell>
                        <TableCell>{ciudad.nombre}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/ciudades/${ciudad.id_ciudad}/editar`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteCiudad(ciudad.id_ciudad)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
