"use client"

export const dynamic = "force-dynamic";

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { Ciudad } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Ruta {
  id_ruta: number
  nombre: string
  id_ciudad_origen: number
  id_ciudad_destino: number
  fecha_apertura: string
  costo_actual: number
  estado: "ACTIVA" | "INACTIVA"
}

interface FormData {
  nombre: string
  ciudadOrigen: string
  ciudadDestino: string
  fechaApertura: string
  costoActual: string
}

export default function NuevaRutaPage() {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    ciudadOrigen: "",
    ciudadDestino: "",
    fechaApertura: new Date().toISOString().split("T")[0],
    costoActual: ""
  })
  const [ciudades, setCiudades] = useState<Ciudad[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchCiudades() {
      const { data } = await supabase.from("ciudad").select("*").order("nombre")
      if (data) {
        setCiudades(data)
      }
    }
    fetchCiudades()
  }, [])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const rutaData: Omit<Ruta, "id_ruta"> = {
        nombre: formData.nombre,
        id_ciudad_origen: Number.parseInt(formData.ciudadOrigen),
        id_ciudad_destino: Number.parseInt(formData.ciudadDestino),
        fecha_apertura: formData.fechaApertura,
        costo_actual: Number.parseFloat(formData.costoActual),
        estado: "ACTIVA"
      }

      const { error } = await supabase.from("ruta").insert([rutaData])

      if (error) {
        throw error
      }

      toast({
        title: "Ruta creada",
        description: "La ruta se ha creado exitosamente."
      })

      router.push("/rutas")
    } catch (error: any) {
      console.error("Error creating ruta:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la ruta. Inténtalo de nuevo.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">          
          <div className="flex flex-1 items-center gap-4">
            <Link href="/rutas">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-lg font-semibold md:text-2xl">Nueva Ruta</h1>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Crear Nueva Ruta</CardTitle>
              <CardDescription>Ingresa los datos de la nueva ruta de distribución</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Ruta</Label>
                  <Input
                    id="nombre"
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange("nombre", e.target.value)}
                    placeholder="Ej: Ruta Bogotá-Medellín"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudadOrigen">Ciudad de Origen</Label>
                  <Select
                    value={formData.ciudadOrigen}
                    onValueChange={(value) => handleInputChange("ciudadOrigen", value)}
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
                    value={formData.ciudadDestino}
                    onValueChange={(value) => handleInputChange("ciudadDestino", value)}
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
                    value={formData.fechaApertura}
                    onChange={(e) => handleInputChange("fechaApertura", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costoActual">Costo Actual</Label>
                  <Input
                    id="costoActual"
                    type="number"
                    step="0.01"
                    value={formData.costoActual}
                    onChange={(e) => handleInputChange("costoActual", e.target.value)}
                    placeholder="150000.00"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creando..." : "Crear Ruta"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
