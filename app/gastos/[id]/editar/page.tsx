"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default function EditarGastoPage() {
  const params = useParams() as { id: string }
  const [formData, setFormData] = useState({
    id_ruta: "",
    fecha_gasto: "",
    monto: "",
    descripcion: "",
  })
  const [rutas, setRutas] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      setLoadingData(true)
      const [{ data: gasto, error: gastoError }, { data: rutasData }] = await Promise.all([
        supabase.from("gasto").select("*").eq("id_gasto", params.id).single(),
        supabase.from("ruta").select("*").eq("estado", "ACTIVA").order("nombre"),
      ])
      if (gastoError || !gasto) {
        toast({
          title: "Error",
          description: "No se pudo cargar el gasto.",
          variant: "destructive",
        })
        setLoadingData(false)
        return
      }
      setFormData({
        id_ruta: gasto.id_ruta?.toString() ?? "",
        fecha_gasto: gasto.fecha_gasto ?? "",
        monto: gasto.monto?.toString() ?? "",
        descripcion: gasto.descripcion ?? "",
      })
      setRutas(rutasData || [])
      setLoadingData(false)
    }
    fetchData()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase
        .from("gasto")
        .update({
          id_ruta: Number.parseInt(formData.id_ruta),
          fecha_gasto: formData.fecha_gasto,
          monto: Number.parseFloat(formData.monto),
          descripcion: formData.descripcion,
        })
        .eq("id_gasto", params.id)
      if (error) throw error
      toast({
        title: "Gasto actualizado",
        description: "El gasto se ha actualizado exitosamente.",
      })
      router.push("/gastos")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el gasto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (loadingData) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Card className="mx-auto w-full max-w-md">
              <CardContent className="p-6 text-center">Cargando gasto...</CardContent>
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
          <div className="flex flex-1 items-center gap-4">
            <Link href="/gastos">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <h1 className="text-lg font-semibold md:text-2xl">Editar Gasto</h1>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Card className="mx-auto w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Gasto</CardTitle>
              <CardDescription>Modifica los datos del gasto</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar Gasto"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
} 