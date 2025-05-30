"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Truck,
  Users,
  MapPin,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  Building2,
  UserCheck,
  Route,
  Home,
  PackageCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Gestión Básica",
    items: [
      {
        title: "Ciudades",
        url: "/ciudades",
        icon: MapPin,
      },
      {
        title: "Rutas",
        url: "/rutas",
        icon: Route,
      },
      {
        title: "Conductores",
        url: "/conductores",
        icon: UserCheck,
      },
    ],
  },
  {
    title: "Inventario",
    items: [
      {
        title: "Proveedores",
        url: "/proveedores",
        icon: Building2,
      },
      {
        title: "Productos",
        url: "/productos",
        icon: Package,
      },
    ],
  },
  {
    title: "Operaciones",
    items: [
      {
        title: "Clientes",
        url: "/clientes",
        icon: Users,
      },
      {
        title: "Ventas",
        url: "/ventas",
        icon: ShoppingCart,
      },
      {
        title: "Entregas",
        url: "/entregas",
        icon: PackageCheck,
      },
      {
        title: "Gastos",
        url: "/gastos",
        icon: DollarSign,
      },
    ],
  },
  {
    title: "Reportes",
    items: [
      {
        title: "Reportes",
        url: "/reportes",
        icon: BarChart3,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Truck className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">ALIMENTAMOS S.A.</span>
                  <span className="truncate text-xs">Sistema de Gestión</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((section) => (
          <SidebarGroup key={section.title}>
            {section.items ? (
              <>
                <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {section.items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link href={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </>
            ) : (
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={pathname === section.url}>
                      <Link href={section.url!}>
                        <section.icon />
                        <span>{section.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                <Building2 className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Empresa</span>
                <span className="truncate text-xs">Distribución Nacional</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
