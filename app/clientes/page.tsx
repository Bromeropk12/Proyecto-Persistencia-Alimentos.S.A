"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
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
import { Edit, Plus, Trash2, Users } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id_cliente: number
  identificacion: string
  nombre: string
  telefono: string
  direccion: string
  ciudad: {
    nombre: string
  } | null
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadClientes() {
      const { data, error } = await supabase
        .from("cliente")
        .select(`
          *,
          ciudad:ciudad(nombre)
        `)
        .order("nombre")

      if (error) {
        console.error("Error fetching clientes:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        })
        return
      }
      setClientes(data || [])
      setLoading(false)
    }

    loadClientes()
  }, [toast])

  const handleDelete = async (id: number) => {
    try {
      // Verificar si el cliente tiene ventas asociadas
      const { data: ventas, error: ventasError } = await supabase
        .from("venta")
        .select("id_venta")
        .eq("id_cliente", id)
        .limit(1)

      if (ventasError) throw ventasError

      if (ventas && ventas.length > 0) {
        toast({
          title: "No se puede eliminar",
          description: "El cliente tiene ventas asociadas y no puede ser eliminado",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase
        .from("cliente")
        .delete()
        .eq("id_cliente", id)

      if (error) throw error

      toast({
        title: "Cliente eliminado",
        description: "El cliente se ha eliminado exitosamente",
      })

      // Actualizar la lista de clientes
      setClientes(clientes.filter(cliente => cliente.id_cliente !== id))
    } catch (error: any) {
      console.error("Error deleting cliente:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el cliente",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <div className="p-4">Cargando clientes...</div>
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Clientes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Link href="/clientes/nuevo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Gestión de Clientes
          </h1>
          <p className="text-muted-foreground">Administra la base de datos de clientes</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Registrados ({clientes.length})</CardTitle>
            <CardDescription>Lista completa de clientes en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Identificación</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Ciudad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id_cliente}>
                    <TableCell className="font-medium">{cliente.identificacion}</TableCell>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell className="max-w-xs truncate">{cliente.direccion}</TableCell>
                    <TableCell>{cliente.ciudad?.nombre}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/clientes/${cliente.id_cliente}/editar`}>
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
                              <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El cliente será eliminado permanentemente del sistema.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(cliente.id_cliente)}>
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
