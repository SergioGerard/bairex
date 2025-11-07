"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/toggle-mode"
import { useScroll } from "@/hooks/use-scroll"

export default function Navbar() {
  const pathname = usePathname()
  const scrolled = useScroll(50)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled 
        ? "bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm" 
        : "bg-transparent border-b border-transparent"
    )}>
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">I</span>
          </div>
          <span className="font-bold text-xl">Bairex</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 mx-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Inicio
          </Link>
          <button
            onClick={() => scrollToSection('proyectos')}
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Proyectos
          </button>
          <Link
            href="/nosotros"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/nosotros" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Nosotros
          </Link>
          <button
            onClick={() => scrollToSection('contacto')}
            className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
          >
            Contacto
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <ModeToggle /> 
        </div>
      </div>
    </header>
  )
}

