"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlurFade } from "@/components/magicui/blur-fade"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface ProyectoDestacado {
  id: number
  nombre: string
  imagen: string
  superficie: string
  entrega: string
  zona: string
  etapa: string
  descripcion: string
}

const proyectosDestacados: ProyectoDestacado[] = [
  {
    id: 1,
    nombre: "Torres del Río",
    imagen: "/proyectos/proyecto1/edi1.png",
    superficie: "45 m²",
    entrega: "2025",
    zona: "Puerto Madero",
    etapa: "Preventa",
    descripcion: "Moderno complejo residencial con vista al río y amenities de primer nivel."
  },
  {
    id: 2,
    nombre: "Palermo Green",
    imagen: "/proyectos/proyecto2/edi2.png",
    superficie: "65 m²",
    entrega: "2026",
    zona: "Palermo",
    etapa: "Construcción",
    descripcion: "Desarrollo sustentable en el corazón de Palermo con espacios verdes únicos."
  },
  {
    id: 3,
    nombre: "Belgrano Tower",
    imagen: "/proyectos/proyecto1/edi1.png",
    superficie: "80 m²",
    entrega: "2025",
    zona: "Belgrano",
    etapa: "Preventa",
    descripcion: "Torre premium con tecnología inteligente y diseño arquitectónico de vanguardia."
  },
  {
    id: 4,
    nombre: "Recoleta Luxury",
    imagen: "/proyectos/proyecto2/edi2.png",
    superficie: "120 m²",
    entrega: "2026",
    zona: "Recoleta",
    etapa: "Construcción",
    descripcion: "Exclusivo desarrollo boutique en la zona más prestigiosa de la ciudad."
  },
  {
    id: 5,
    nombre: "Villa Crespo Loft",
    imagen: "/proyectos/proyecto1/edi1.png",
    superficie: "55 m²",
    entrega: "2025",
    zona: "Villa Crespo",
    etapa: "Finalizado",
    descripcion: "Lofts de diseño industrial con espacios amplios y luminosos."
  },
  {
    id: 6,
    nombre: "Núñez Residencial",
    imagen: "/proyectos/proyecto2/edi2.png",
    superficie: "90 m²",
    entrega: "2026",
    zona: "Núñez",
    etapa: "Preventa",
    descripcion: "Complejo familiar con amplios departamentos y áreas recreativas."
  }
]

const zonas = ["Todas", "Puerto Madero", "Palermo", "Belgrano", "Recoleta", "Villa Crespo", "Núñez"]
const etapas = ["Todas", "Preventa", "Construcción", "Finalizado"]

export function ProyectosDestacadosSection() {
  const [zonaFiltro, setZonaFiltro] = useState("Todas")
  const [etapaFiltro, setEtapaFiltro] = useState("Todas")

  const proyectosFiltrados = proyectosDestacados.filter(proyecto => {
    const zonaMatch = zonaFiltro === "Todas" || proyecto.zona === zonaFiltro
    const etapaMatch = etapaFiltro === "Todas" || proyecto.etapa === etapaFiltro
    return zonaMatch && etapaMatch
  })

  const getEtapaVariant = (etapa: string) => {
    switch (etapa) {
      case "Finalizado":
        return "default"
      case "Construcción":
        return "secondary"
      case "Preventa":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <section id="proyectos" className="py-24">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Proyectos
              <span className="block text-primary">Destacados</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Descubrí nuestros desarrollos más exclusivos con las mejores ubicaciones y amenities
            </p>
          </div>
        </BlurFade>

        {/* Filtros */}
        <BlurFade delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
            <Select value={zonaFiltro} onValueChange={setZonaFiltro}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por zona" />
              </SelectTrigger>
              <SelectContent>
                {zonas.map(zona => (
                  <SelectItem key={zona} value={zona}>{zona}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={etapaFiltro} onValueChange={setEtapaFiltro}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filtrar por etapa" />
              </SelectTrigger>
              <SelectContent>
                {etapas.map(etapa => (
                  <SelectItem key={etapa} value={etapa}>{etapa}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </BlurFade>

        {/* Grid de proyectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {proyectosFiltrados.map((proyecto, index) => (
            <BlurFade key={proyecto.id} delay={0.3 + index * 0.1}>
              <Card className="group cursor-pointer transition-all duration-300 hover:border-foreground hover:shadow-xl border border-border overflow-hidden">
                <div className="relative overflow-hidden">
                  <div 
                    className="h-64 bg-cover bg-center transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${proyecto.imagen})` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary">{proyecto.superficie}</Badge>
                    <Badge variant={getEtapaVariant(proyecto.etapa)}>
                      {proyecto.etapa === "Construcción" ? "En construcción" : proyecto.etapa} {proyecto.entrega}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="pb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {proyecto.nombre}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                    {proyecto.descripcion}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-primary">{proyecto.zona}</span>
                    <span className="text-sm text-muted-foreground">{proyecto.etapa}</span>
                  </div>
                  <Link href={`/desarrollo/${proyecto.id}`}>
                    <Button className="w-full gap-2 group-hover:bg-primary/90 transition-colors">
                      Ver desarrollo <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>

        {proyectosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron proyectos con los filtros seleccionados.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}