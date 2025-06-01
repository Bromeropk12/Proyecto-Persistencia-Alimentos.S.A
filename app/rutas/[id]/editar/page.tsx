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
import { supabase } from "@/lib/supabase"
import type { Ciudad, Ruta } from "@/lib/types"
import { ArrowLeft, Map } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

interface RutaProps {
  id_ruta: number
  nombre: string
  id_ciudad_origen: number
  id_ciudad_destino: number
  fecha_apertura: string
  costo_actual: number
  estado: "ACTIVA" | "INACTIVA"
}

export default function EditarRutaPage() {
  const [ruta, setRuta] = useState<RutaProps | null>(null)
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { id } = useParams()

  useEffect(() => {
    async function fetchData() {
      const [rutaRes, ciudadesRes] = await Promise.all([
        supabase.from("ruta").select("*").eq("id_ruta", id).single(),
        supabase.from("ciudad").select("*").order("nombre")
      ])

      if (rutaRes.data) {
        setRuta(rutaRes.data)
      }

      if (ciudadesRes.data) {
        setCiudades(ciudadesRes.data)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ruta) return

    setLoading(true)

    try {
      const { error } = await supabase
        .from("ruta")
        .update({
          nombre: ruta.nombre,
          id_ciudad_origen: ruta.id_ciudad_origen,
          id_ciudad_destino: ruta.id_ciudad_destino,
          fecha_apertura: ruta.fecha_apertura,
          costo_actual: ruta.costo_actual,
          estado: ruta.estado,
        })
        .eq("id_ruta", id)

      if (error) throw error

      toast({
        title: "Ruta actualizada",
        description: "La ruta se ha actualizado exitosamente.",
      })

      router.push("/rutas")
    } catch (error: any) {
      console.error("Error updating ruta:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar la ruta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!ruta) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            <div className="flex flex-1 items-center gap-4">
              <Link href="/rutas">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver
                </Button>
              </Link>
              <h1 className="text-lg font-semibold md:text-2xl">Editar Ruta</h1>
            </div>
          </header>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="mx-auto w-full max-w-md">
              <CardContent className="p-6">
                <div className="text-center">Cargando...</div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
          <div className="flex flex-1 items-center gap-4">
            <Link href="/rutas">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-lg font-semibold md:text-2xl">Editar Ruta</h1>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Ruta</CardTitle>
              <CardDescription>Modifica los datos de la ruta de distribución</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Ruta</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={ruta.nombre}
                    onChange={(e) => setRuta({ ...ruta, nombre: e.target.value })}
                    placeholder="Ej: Ruta Bogotá-Medellín"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudadOrigen">Ciudad de Origen</Label>
                  <Select
                    value={ruta.id_ciudad_origen.toString()}
                    onValueChange={(value) => setRuta({ ...ruta, id_ciudad_origen: Number(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad de origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad.id_ciudad} value={ciudad.id_ciudad.toString()}>
                          {ciudad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudadDestino">Ciudad de Destino</Label>
                  <Select
                    value={ruta.id_ciudad_destino.toString()}
                    onValueChange={(value) => setRuta({ ...ruta, id_ciudad_destino: Number(value) })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona ciudad de destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {ciudades.map((ciudad) => (
                        <SelectItem key={ciudad.id_ciudad} value={ciudad.id_ciudad.toString()}>
                          {ciudad.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaApertura">Fecha de Apertura</Label>
                  <Input
                    id="fechaApertura"
                    type="date"
                    value={ruta.fecha_apertura}
                    onChange={(e) => setRuta({ ...ruta, fecha_apertura: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costoActual">Costo Actual</Label>
                  <Input
                    id="costoActual"
                    type="number"
                    step="0.01"
                    value={ruta.costo_actual}
                    onChange={(e) => setRuta({ ...ruta, costo_actual: Number(e.target.value) })}
                    placeholder="150000.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={ruta.estado}
                    onValueChange={(value) => setRuta({ ...ruta, estado: value as "ACTIVA" | "INACTIVA" })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVA">Activa</SelectItem>
                      <SelectItem value="INACTIVA">Inactiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar Ruta"}
                  </Button>
                  <Link href="/rutas">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
