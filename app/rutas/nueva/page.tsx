"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase, type Ciudad } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NuevaRutaPage() {
  const [nombre, setNombre] = useState("")
  const [ciudadOrigen, setCiudadOrigen] = useState("")
  const [ciudadDestino, setCiudadDestino] = useState("")
  const [fechaApertura, setFechaApertura] = useState("")
  const [costoActual, setCostoActual] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("ruta").insert([
        {
          nombre,
          id_ciudad_origen: Number.parseInt(ciudadOrigen),
          id_ciudad_destino: Number.parseInt(ciudadDestino),
          fecha_apertura: fechaApertura,
          costo_actual: Number.parseFloat(costoActual),
          estado: "ACTIVA",
        },
      ])

      if (error) {
        throw error
      }

      toast({
        title: "Ruta creada",
        description: "La ruta se ha creado exitosamente.",
      })

      router.push("/rutas")
    } catch (error) {
      console.error("Error creating ruta:", error)
      toast({
        title: "Error",
        description: "No se pudo crear la ruta. Inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sidebar />
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
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: Ruta Bogotá-Medellín"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ciudadOrigen">Ciudad de Origen</Label>
                  <Select value={ciudadOrigen} onValueChange={setCiudadOrigen} required>
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
                  <Select value={ciudadDestino} onValueChange={setCiudadDestino} required>
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
                    value={fechaApertura}
                    onChange={(e) => setFechaApertura(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="costoActual">Costo Actual</Label>
                  <Input
                    id="costoActual"
                    type="number"
                    step="0.01"
                    value={costoActual}
                    onChange={(e) => setCostoActual(e.target.value)}
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
