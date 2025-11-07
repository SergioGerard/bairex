"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BlurFade } from "@/components/magicui/blur-fade"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface Desarrollo {
  id: number
  nombre: string
  imagen: string
  estado: "Entrega 2025" | "Entrega 2026" | "Finalizado" | "En construcción"
}

// Datos de ejemplo - 30 desarrollos
const desarrollos: Desarrollo[] = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  nombre: `Desarrollo ${i + 1}`,
  imagen: i % 2 === 0 ? "/proyectos/proyecto1/edi1.png" : "/proyectos/proyecto2/edi2.png",
  estado: ["Entrega 2025", "Entrega 2026", "Finalizado", "En construcción"][i % 4] as Desarrollo["estado"]
}))

const ITEMS_PER_PAGE = 6 // 2 filas x 3 columnas

export function DesarrollosSection() {
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE)
  const [isLoading, setIsLoading] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const loadMore = async () => {
    setIsLoading(true)
    
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newVisibleItems = Math.min(visibleItems + ITEMS_PER_PAGE, desarrollos.length)
    setVisibleItems(newVisibleItems)
    setIsLoading(false)

    // Auto scroll hacia abajo
    setTimeout(() => {
      if (sectionRef.current) {
        const newItemsStart = sectionRef.current.querySelector(`[data-index="${visibleItems}"]`)
        if (newItemsStart) {
          newItemsStart.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }, 100)
  }

  const getEstadoVariant = (estado: Desarrollo["estado"]) => {
    switch (estado) {
      case "Finalizado":
        return "default"
      case "En construcción":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <section className="py-24 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Nuestros
              <span className="block text-primary">Desarrollos</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explorá nuestra amplia cartera de proyectos inmobiliarios en las mejores ubicaciones
            </p>
          </div>
        </BlurFade>

        <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
            {desarrollos.slice(0, visibleItems).map((desarrollo, index) => (
              <BlurFade key={desarrollo.id} delay={0.1 + (index % 6) * 0.1}>
                <Link href={`/desarrollo/${desarrollo.id}`}>
                  <Card 
                    data-index={index}
                    className={cn(
                      "group cursor-pointer transition-all duration-300 hover:border-foreground hover:shadow-xl",
                      "border border-border overflow-hidden"
                    )}
                  >
                    <div className="relative overflow-hidden">
                      <div 
                        className="h-48 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                        style={{ 
                          backgroundImage: `url(${desarrollo.imagen})`,
                          filter: "group-hover:brightness(0.8)"
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/40" />
                      </div>
                      <Badge 
                        variant={getEstadoVariant(desarrollo.estado)}
                        className="absolute top-3 right-3 z-10"
                      >
                        {desarrollo.estado}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {desarrollo.nombre}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              </BlurFade>
            ))}
          </div>

          {visibleItems < desarrollos.length && (
            <div className="text-center mt-8">
              <Button 
                onClick={loadMore}
                disabled={isLoading}
                variant="outline"
                size="lg"
                className="px-8"
              >
                {isLoading ? "Cargando..." : "Ver más proyectos"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}