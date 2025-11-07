"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  LineChart,
  DollarSign,
  Settings,
  ShoppingCart,
  TrendingUp,
} from "lucide-react"
import { latestVersion } from "@/lib/version"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()
  
  const handleLogoClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  // Definir los datos del menú con la ruta actual
  const data = {
    user: {
      name: "Usuario Demo",
      email: "Ejemplo@demo.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Proyección",
        url: "/dashboard",
        icon: LineChart,
        isActive: pathname === "/dashboard" || pathname.startsWith("/dashboard/panel-general") || pathname.startsWith("/dashboard/movimientos"),
        items: [
          {
            title: "Panel general",
            url: "/dashboard/panel-general",
            isActive: pathname.startsWith("/dashboard/panel-general"),
          },
          {
            title: "Movimientos",
            url: "/dashboard/movimientos",
            isActive: pathname.startsWith("/dashboard/movimientos"),
          },
        ],
      },
      {
        title: "Presupuestos",
        url: "/dashboard/presupuestos",
        icon: DollarSign,
        isActive: pathname.startsWith("/dashboard/presupuestos"),
        items: [],
      },
      {
        title: "Simulación de Compra",
        url: "/dashboard/simulacion-compra",
        icon: ShoppingCart,
        isActive: pathname.startsWith("/dashboard/simulacion-compra"),
        items: [],
      },
      {
        title: "Simulador FCI",
        url: "/dashboard/simulador-fci",
        icon: TrendingUp,
        isActive: pathname.startsWith("/dashboard/simulador-fci"),
        items: [],
      },
      {
        title: "Configuración",
        url: "/dashboard/settings",
        icon: Settings,
        isActive: pathname.startsWith("/dashboard/settings"),
        items: [],
      },
    ],
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      style={{
        backgroundColor: "sidebar-background",
        color: "sidebar-foreground",
      }}
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              style={{
                backgroundColor: "sidebar-background",
                color: "sidebar-foreground",
              }}
            >
              <Link href="/dashboard/panel-general" className="transition-all duration-300 ease-in-out flex items-center px-1 py-2 w-full" onClick={handleLogoClick}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground transition-all duration-300 ease-in-out">
                  <Image 
              src="/logo-finanzar.svg" 
              alt="Finanzar Logo" 
              width={20} 
              height={20} 
              className="mx-auto" 
              loading="lazy"
            />
                </div>
                <span className="ml-2 text-sm font-medium transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden">Finanzar {latestVersion}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="hidden">
        <NavUser user={data.user} />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
