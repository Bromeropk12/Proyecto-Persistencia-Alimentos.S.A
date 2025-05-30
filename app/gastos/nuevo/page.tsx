"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { supabase, type Ruta } from "@/lib/supabase"
import { ArrowLeft, DollarSign } from "lucide-react"
import Link from "next/link"

export default function NuevoGastoPage() {
  const [formData, setFormData] = useState({
    id_ruta: "",
    fecha_gasto: new Date().toISOString().split("T")[0],
    monto: "",
    descripcion: "",
  })
  const [rutas, setRutas] = useState<Ruta[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchRutas() {
      const { data } = await supabase.from("ruta").select("*").eq("estado", "ACTIVA").order("nombre")

      if (data) {
        setRutas(data)
      }
    }
    fetchRutas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from("gasto").insert([
        {
          ...formData,
          id_ruta: Number.parseInt(formData.id_ruta),
          monto: Number.parseFloat(formData.monto),
        },
      ])

      if (error) throw error

      toast({
        title: "Gasto registrado",
        description: "El gasto se ha registrado exitosamente.",
      })

      router.push("/gastos")
    } catch (error: any) {
      console.error("Error creating gasto:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar el gasto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/gastos">Gastos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Nuevo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/gastos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <DollarSign className="h-8 w-8" />
              Nuevo Gasto
            </h1>
            <p className="text-muted-foreground">Registra un nuevo gasto operacional</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del Gasto</CardTitle>
            <CardDescription>Completa todos los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id_ruta">Ruta *</Label>
                  <Select
                    value={formData.id_ruta}
                    onValueChange={(value) => handleInputChange("id_ruta", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una ruta" />
                    </SelectTrigger>
                    <SelectContent>
                      {rutas.map((ruta) => (
                        <SelectItem key={ruta.id_ruta} value={ruta.id_ruta.toString()}>
                          {ruta.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fecha_gasto">Fecha del Gasto *</Label>
                  <Input
                    id="fecha_gasto"
                    type="date"
                    value={formData.fecha_gasto}
                    onChange={(e) => handleInputChange("fecha_gasto", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monto">Monto *</Label>
                <Input
                  id="monto"
                  type="number"
                  step="0.01"
                  value={formData.monto}
                  onChange={(e) => handleInputChange("monto", e.target.value)}
                  placeholder="50000.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Combustible, peajes, mantenimiento, etc."
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Registrando..." : "Registrar Gasto"}
                </Button>
                <Link href="/gastos">
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
