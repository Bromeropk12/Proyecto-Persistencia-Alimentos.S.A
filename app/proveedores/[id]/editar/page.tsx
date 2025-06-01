"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { Proveedor } from "@/lib/types"
import { ArrowLeft, Building2 } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default function EditarProveedorPage() {
  const params = useParams() as { id: string };
  const [formData, setFormData] = useState<Omit<Proveedor, "id_proveedor">>({
    identificacion: "",
    nombre: "",
    telefono: "",
    direccion: "",
    activo: true,
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("proveedor")
        .select("*")
        .eq("id_proveedor", params.id)
        .single()

      if (error) {
        console.error("Error fetching proveedor:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar la información del proveedor.",
          variant: "destructive",
        })
        return
      }

      if (data) {
        setFormData({
          identificacion: data.identificacion ?? "",
          nombre: data.nombre ?? "",
          telefono: data.telefono ?? "",
          direccion: data.direccion ?? "",
          activo: data.activo ?? true,
        })
      }
    }
    fetchData()
  }, [params.id, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("proveedor")
        .update(formData)
        .eq("id_proveedor", params.id)

      if (error) throw error

      toast({
        title: "Proveedor actualizado",
        description: "El proveedor se ha actualizado exitosamente.",
      })

      router.push("/proveedores")
    } catch (error: any) {
      console.error("Error updating proveedor:", error)
      let errorMessage = "No se pudo actualizar el proveedor."
      
      if (error.code === "23503") {
        errorMessage = "No se puede actualizar el proveedor porque tiene productos asociados."
      } else if (error.code === "23505") {
        errorMessage = "Ya existe un proveedor con ese NIT."
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  const handleInputChange = (field: keyof Omit<Proveedor, "id_proveedor">, value: string | boolean) => {
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
              <BreadcrumbLink href="/proveedores">Proveedores</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/proveedores">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Building2 className="h-8 w-8" />
              Editar Proveedor
            </h1>
            <p className="text-muted-foreground">Modifica los datos del proveedor</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del Proveedor</CardTitle>
            <CardDescription>Actualiza los campos necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">                  <Label htmlFor="identificacion">NIT *</Label>
                  <Input
                    id="identificacion"
                    value={formData.identificacion}                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("identificacion", e.target.value)}
                    placeholder="900123456-1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("nombre", e.target.value)}
                    placeholder="Distribuidora Nacional S.A.S"
                    required
                  />
                </div>
              </div>              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("telefono", e.target.value)}
                  placeholder="3101234567"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange("direccion", e.target.value)}
                    placeholder="Calle 123 #45-67, Zona Industrial"
                    required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="activo"
                  checked={formData.activo}
                  onCheckedChange={(checked) => handleInputChange("activo", checked)}
                />
                <Label htmlFor="activo">Proveedor activo</Label>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Actualizando..." : "Actualizar Proveedor"}
                </Button>
                <Link href="/proveedores">
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
