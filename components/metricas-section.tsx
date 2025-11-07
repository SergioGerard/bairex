"use client"

import { Card, CardContent } from "@/components/ui/card"
import { NumberTicker } from "@/components/magicui/number-ticker"
import { BlurFade } from "@/components/magicui/blur-fade"

const metricas = [
  {
    numero: 20,
    sufijo: "+",
    titulo: "años en el rubro",
    descripcion: "Experiencia y trayectoria"
  },
  {
    numero: 40000,
    sufijo: "+ m²",
    titulo: "construidos",
    descripcion: "Metros cuadrados desarrollados"
  },
  {
    numero: 12,
    sufijo: "",
    titulo: "proyectos en construcción",
    descripcion: "Desarrollos activos"
  }
]

export function MetricasSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Fondo con textura sutil */}
      <div className="absolute inset-0 bg-gradient-to-br from-muted/50 via-background to-muted/30" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23000000%22 fill-opacity=%220.02%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Confianza que
              <span className="block text-primary">nos respalda</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Números que demuestran nuestro compromiso y experiencia en el mercado inmobiliario
            </p>
          </div>
        </BlurFade>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metricas.map((metrica, index) => (
            <BlurFade key={index} delay={0.2 + index * 0.1}>
              <Card className="text-center border border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    <NumberTicker value={metrica.numero} />
                    <span className="text-2xl">{metrica.sufijo}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{metrica.titulo}</h3>
                  <p className="text-muted-foreground">{metrica.descripcion}</p>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}