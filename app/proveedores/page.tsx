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
import { supabase } from "@/lib/supabase"
import { Building2, Plus, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface Proveedor {
  id_proveedor: number
  identificacion: string
  nombre: string
  telefono: string
  direccion: string
  activo: boolean
}

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    loadProveedores()
  }, [])

  async function loadProveedores() {
    try {
      const { data, error } = await supabase.from("proveedor").select("*").order("nombre")
      if (error) throw error
      setProveedores(data)
    } catch (error: any) {
      console.error("Error loading proveedores:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los proveedores",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      // Verificar si el proveedor tiene productos
      const { data: productos, error: checkError } = await supabase
        .from("producto")
        .select("id_producto")
        .eq("id_proveedor", id)
        .limit(1)

      if (checkError) throw checkError

      if (productos && productos.length > 0) {
        throw new Error("El proveedor tiene productos asociados y no puede ser eliminado")
      }

      const { error } = await supabase.from("proveedor").delete().eq("id_proveedor", id)

      if (error) throw error

      toast({
        title: "Proveedor eliminado",
        description: "El proveedor se ha eliminado exitosamente",
      })

      setProveedores(proveedores.filter((p) => p.id_proveedor !== id))
    } catch (error: any) {
      console.error("Error deleting proveedor:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el proveedor",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="p-4">Cargando proveedores...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Gestión de Proveedores</h1>
            <Link href="/proveedores/nuevo">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Proveedor
              </Button>
            </Link>
          </div>
        </header>

        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Proveedores Registrados ({proveedores.length})</CardTitle>
              <CardDescription>Administra los proveedores del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proveedores.map((proveedor) => (
                    <TableRow key={proveedor.id_proveedor}>
                      <TableCell className="font-medium">{proveedor.identificacion}</TableCell>
                      <TableCell>{proveedor.nombre}</TableCell>
                      <TableCell>{proveedor.telefono}</TableCell>
                      <TableCell className="max-w-xs truncate">{proveedor.direccion}</TableCell>
                      <TableCell>
                        <Badge variant={proveedor.activo ? "default" : "secondary"}>
                          {proveedor.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/proveedores/${proveedor.id_proveedor}/editar`}>
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
                                <AlertDialogTitle>¿Eliminar proveedor?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. El proveedor será eliminado permanentemente del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(proveedor.id_proveedor)}>
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
