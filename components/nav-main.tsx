"use client"

import { type LucideIcon } from "lucide-react"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
      isActive?: boolean
    }[]
  }[]
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  
  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }
  
  return (
    <SidebarMenu>
      {items.map((item) => {
        // Si el item tiene subitems, renderizar como collapsible
        if (item.items && item.items.length > 0) {
          return (
            <Collapsible
              key={item.title}
              defaultOpen
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={item.isActive}
                    className="
                      text-sidebar-foreground
                      hover:bg-sidebar-accent
                      hover:text-sidebar-accent-foreground
                      data-[state=open]:bg-sidebar-accent
                      data-[state=open]:text-sidebar-accent-foreground
                      data-[active=true]:bg-sidebar-primary
                      data-[active=true]:text-sidebar-primary-foreground
                      transition-all duration-300 ease-in-out
                      group-data-[collapsible=icon]:!p-2
                    "
                  >
                    <item.icon className="transition-all duration-300 ease-in-out group-data-[collapsible=icon]:ml-[3px]" />
                    <span className="transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:overflow-hidden">{item.title}</span>
                    <ChevronRight className="ml-auto transition-all duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:overflow-hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          <Link href={subItem.url} onClick={handleLinkClick}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          )
        }
        
        // Si no tiene subitems, renderizar como item normal
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={item.isActive}
              className="
                transition-all duration-300 ease-in-out
                group-data-[collapsible=icon]:!p-2
              "
            >
              <Link href={item.url} onClick={handleLinkClick}>
                <item.icon className="transition-all duration-300 ease-in-out group-data-[collapsible=icon]:ml-[3px]" />
                <span className="transition-all duration-300 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:overflow-hidden">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}
