"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { supabase, conductorService } from "@/lib/supabase"
import { Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Conductor {
  id_conductor: number
  identificacion: string
  nombres: string
  apellidos: string
  telefono: string
  fecha_ingreso: string
  id_ruta: number | null
  ruta?: {
    nombre: string
    estado: string
  }
}

export default function ConductoresPage() {
  const [conductores, setConductores] = useState<Conductor[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadConductores()
  }, [])

  async function loadConductores() {
    try {
      const conductores = await conductorService.getAll()
      setConductores(conductores)
    } catch (error: any) {
      console.error("Error loading conductores:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los conductores",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await conductorService.delete(id)
      toast({
        title: "Conductor eliminado",
        description: "El conductor se ha eliminado exitosamente",
      })
      setConductores(conductores.filter((c) => c.id_conductor !== id))
    } catch (error: any) {
      console.error("Error deleting conductor:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el conductor",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="p-4">Cargando conductores...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Gestión de Conductores</h1>
            <Link href="/conductores/nuevo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Conductor
              </Button>
            </Link>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Conductores Registrados ({conductores.length})</CardTitle>
              <CardDescription>Gestiona los conductores y sus asignaciones de rutas</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Fecha Ingreso</TableHead>
                    <TableHead>Ruta Asignada</TableHead>
                    <TableHead>Estado Ruta</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conductores.map((conductor) => (
                    <TableRow key={conductor.id_conductor}>
                      <TableCell className="font-medium">{conductor.identificacion}</TableCell>
                      <TableCell>{`${conductor.nombres} ${conductor.apellidos}`}</TableCell>
                      <TableCell>{conductor.telefono}</TableCell>
                      <TableCell>{new Date(conductor.fecha_ingreso).toLocaleDateString()}</TableCell>
                      <TableCell>{conductor.ruta?.nombre || "Sin asignar"}</TableCell>
                      <TableCell>
                        {conductor.ruta ? (
                          <Badge variant={conductor.ruta.estado === "ACTIVA" ? "default" : "secondary"}>
                            {conductor.ruta.estado}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Sin ruta</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/conductores/${conductor.id_conductor}/editar`}>
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
                                <AlertDialogTitle>¿Eliminar conductor?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El conductor será eliminado permanentemente del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(conductor.id_conductor)}>
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
        </main>
      </div>
    </div>
  )
}
