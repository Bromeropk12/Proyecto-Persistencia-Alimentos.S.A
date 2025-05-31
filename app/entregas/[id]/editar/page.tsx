"use client"

export const dynamic = "force-dynamic";

import type React from "react"

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
import { ArrowLeft, PackageCheck } from "lucide-react"
import Link from "next/link"

export default function EditarEntregaPage() {
  const [formData, setFormData] = useState({
    fecha_entrega: "",
    estado_entrega: "",
  })
  const [entregaInfo, setEntregaInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchEntrega() {
      try {
        const { data, error } = await supabase
          .from("entrega")
          .select(`
            *,
            venta:venta(
              valor_total,
              cliente:cliente(nombre, identificacion),
              ruta:ruta(nombre)
            )
          `)
          .eq("id_entrega", params.id)
          .single()

        if (error) throw error

        setEntregaInfo(data)
        setFormData({
          fecha_entrega: data.fecha_entrega,
          estado_entrega: data.estado_entrega,
        })
      } catch (error) {
        console.error("Error fetching entrega:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información de la entrega.",
          variant: "destructive",
        })
      } finally {
        setLoadingData(false)
      }
    }

    if (params.id) {
      fetchEntrega()
    }
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("entrega")
        .update({
          fecha_entrega: formData.fecha_entrega,
          estado_entrega: formData.estado_entrega,
        })
        .eq("id_entrega", params.id)

      if (error) throw error

      toast({
        title: "Entrega actualizada",
        description: "La entrega se ha actualizado exitosamente.",
      })

      router.push("/entregas")
    } catch (error: any) {
      console.error("Error updating entrega:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la entrega.",
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando información de la entrega...</p>
        </div>
      </div>
    )
  }

  if (!entregaInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">No se encontró la entrega.</p>
          <Link href="/entregas">
            <Button className="mt-4">Volver a Entregas</Button>
          </Link>
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
              <BreadcrumbLink href="/entregas">Entregas</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar #{entregaInfo.id_entrega}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/entregas">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <PackageCheck className="h-8 w-8" />
              Editar Entrega #{entregaInfo.id_entrega}
            </h1>
            <p className="text-muted-foreground">Actualiza el estado y fecha de la entrega</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Información de la entrega */}
          <Card>
            <CardHeader>
              <CardTitle>Información de la Venta</CardTitle>
              <CardDescription>Datos relacionados con esta entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-muted-foreground">Cliente:</span>
                  <p className="font-medium">{entregaInfo.venta?.cliente?.nombre}</p>
                  <p className="text-muted-foreground">{entregaInfo.venta?.cliente?.identificacion}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Ruta:</span>
                  <p className="font-medium">{entregaInfo.venta?.ruta?.nombre}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">Valor Total:</span>
                  <p className="font-medium">${entregaInfo.venta?.valor_total?.toLocaleString("es-CO")}</p>
                </div>
                <div>
                  <span className="font-medium text-muted-foreground">ID Venta:</span>
                  <p className="font-medium">#{entregaInfo.id_venta}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulario de edición */}
          <Card>
            <CardHeader>
              <CardTitle>Actualizar Entrega</CardTitle>
              <CardDescription>Modifica la fecha y estado de la entrega</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fecha_entrega">Fecha de Entrega *</Label>
                  <Input
                    id="fecha_entrega"
                    type="date"
                    value={formData.fecha_entrega}
                    onChange={(e) => handleInputChange("fecha_entrega", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado_entrega">Estado de la Entrega *</Label>
                  <Select
                    value={formData.estado_entrega}
                    onValueChange={(value) => handleInputChange("estado_entrega", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                      <SelectItem value="ENTREGADO">Entregado</SelectItem>
                      <SelectItem value="DEVUELTO">Devuelto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Actualizando..." : "Actualizar Entrega"}
                  </Button>
                  <Link href="/entregas">
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
