'use server'

import { revalidatePath } from "next/cache"
import { rutaService } from "@/lib/supabase"

export async function deleteRuta(id: number) {
  try {
    await rutaService.delete(id)
    revalidatePath("/rutas")
    return { success: true }
  } catch (error) {
    console.error("Error deleting ruta:", error)
    return { success: false, error }
  }
}
