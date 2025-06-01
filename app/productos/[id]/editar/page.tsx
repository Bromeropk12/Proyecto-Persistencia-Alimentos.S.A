"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import type { Producto, Proveedor } from "@/lib/types"
import { ArrowLeft, Package } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic";

export default function EditarProductoPage() {
  const params = useParams() as { id: string };
  const [formData, setFormData] = useState<Omit<Producto, "id_producto">>({
    nombre: "",
    descripcion: "",
    precio_unitario: 0,
    id_proveedor: 0,
  })
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      const [productoRes, proveedoresRes] = await Promise.all([
        supabase.from("producto").select("*").eq("id_producto", params.id).single(),
        supabase.from("proveedor").select("*").eq("activo", true).order("nombre"),
      ])

      if (productoRes.data) {
        setFormData(productoRes.data)
      }

      if (proveedoresRes.data) {
        setProveedores(proveedoresRes.data)
      }
    }
    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from("producto")
        .update({
          ...formData,
          id_proveedor: Number.parseInt(formData.id_proveedor.toString()),
          precio_unitario: Number.parseFloat(formData.precio_unitario.toString()),
        })
        .eq("id_producto", params.id)

      if (error) throw error

      toast({
        title: "Producto actualizado",
        description: "El producto se ha actualizado exitosamente.",
      })

      router.push("/productos")
    } catch (error: any) {
      console.error("Error updating producto:", error)
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar el producto.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
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
              <BreadcrumbLink href="/productos">Productos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Editar</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Link href="/productos">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Package className="h-8 w-8" />
              Editar Producto
            </h1>
            <p className="text-muted-foreground">Modifica los datos del producto</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
            <CardDescription>Actualiza los campos necesarios</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del Producto *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                  placeholder="Producto ABC"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion || ""}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                  placeholder="Descripción detallada del producto"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio_unitario">Precio Unitario *</Label>
                  <Input
                    id="precio_unitario"
                    type="number"
                    step="0.01"
                    value={formData.precio_unitario}
                    onChange={(e) => handleInputChange("precio_unitario", e.target.value)}
                    placeholder="10000.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id_proveedor">Proveedor *</Label>
                  <Select
                    value={formData.id_proveedor.toString()}
                    onValueChange={(value) => handleInputChange("id_proveedor", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {proveedores.map((proveedor) => (
                        <SelectItem key={proveedor.id_proveedor} value={proveedor.id_proveedor.toString()}>
                          {proveedor.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Actualizando..." : "Actualizar Producto"}
                </Button>
                <Link href="/productos">
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
