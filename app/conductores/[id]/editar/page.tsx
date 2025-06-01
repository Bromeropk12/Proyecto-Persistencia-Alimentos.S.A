"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { supabase, conductorService } from "@/lib/supabase"
import { ArrowLeft, Truck } from "lucide-react"
import Link from "next/link"

interface FormData {
  identificacion: string
  nombres: string
  apellidos: string
  telefono: string
  fecha_ingreso: string
  id_ruta: number | null
}

interface Ruta {
  id_ruta: number
  nombre: string
  estado: string
}

export default function EditarConductorPage() {
  const [formData, setFormData] = useState<FormData>({
    identificacion: "",
    nombres: "",
    apellidos: "",
    telefono: "",
    fecha_ingreso: "",
    id_ruta: null,
  })
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        const [conductorRes, rutasRes] = await Promise.all([
          conductorService.getById(Number(params.id)),
          supabase.from("ruta").select("*").eq("estado", "ACTIVA").order("nombre"),
        ])

        if (rutasRes.error) throw rutasRes.error

        setFormData({
          identificacion: conductorRes.identificacion,
          nombres: conductorRes.nombres,
          apellidos: conductorRes.apellidos,
          telefono: conductorRes.telefono,
          fecha_ingreso: conductorRes.fecha_ingreso,
          id_ruta: conductorRes.id_ruta,
        })

        setRutas(rutasRes.data || [])
      } catch (error: any) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del conductor",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    if (params.id) {
      fetchData()
    }
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await conductorService.update(Number(params.id), {
        identificacion: formData.identificacion,
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        fecha_ingreso: formData.fecha_ingreso,
        id_ruta: formData.id_ruta,
      })

      toast({
        title: "Conductor actualizado",
        description: "El conductor se ha actualizado exitosamente.",
      })

      router.push("/conductores")
    } catch (error: any) {
      console.error("Error updating conductor:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el conductor.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando información del conductor...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/conductores">Conductores</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar Conductor</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/conductores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Truck className="h-8 w-8" />
              Editar Conductor
            </h1>
            <p className="text-muted-foreground">Actualiza la información del conductor</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del Conductor</CardTitle>
            <CardDescription>Actualiza los datos del conductor</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificacion">Identificación</Label>
                  <Input
                    id="identificacion"
                    value={formData.identificacion}
                    onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombres">Nombres</Label>
                  <Input
                    id="nombres"
                    value={formData.nombres}
                    onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha_ingreso">Fecha de Ingreso</Label>
                  <Input
                    id="fecha_ingreso"
                    type="date"
                    value={formData.fecha_ingreso}
                    onChange={(e) => setFormData({ ...formData, fecha_ingreso: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="id_ruta">Ruta Asignada</Label>
                  <Select
                    value={formData.id_ruta?.toString() || ""}
                    onValueChange={(value) =>
                      setFormData({ ...formData, id_ruta: value ? parseInt(value) : null })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una ruta" />
                    </SelectTrigger>                    <SelectContent>
                      <SelectItem value="0">Sin asignar</SelectItem>
                      {rutas.map((ruta) => (
                        <SelectItem key={ruta.id_ruta} value={ruta.id_ruta.toString()}>
                          {ruta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Link href="/conductores">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
