"use client"

import { Button } from "@/components/ui/button"
import { HeroCarousel } from "@/components/hero-carousel"
import { ArrowRight } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"

const heroImages = [
  "/hero-section-images/slider1.webp",
  "/hero-section-images/slider1.webp",
  "/hero-section-images/slider1.webp",
  "/hero-section-images/slider1.webp"
]

export function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Carousel */}
      <div className="absolute inset-0">
        <HeroCarousel images={heroImages} autoplayDelay={6000} />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <BlurFade delay={0.2}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Tu próximo hogar
              <span className="block">empieza acá</span>
            </h1>
          </BlurFade>
          
          <BlurFade delay={0.4}>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
              Descubrí los mejores desarrollos inmobiliarios con la calidad y confianza que merecés.
            </p>
          </BlurFade>
          
          <BlurFade delay={0.6}>
            <Button 
              size="lg" 
              className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
              onClick={() => scrollToSection('proyectos')}
            >
              Ver Proyectos <ArrowRight className="h-5 w-5" />
            </Button>
          </BlurFade>
        </div>
      </div>
    </section>
  )
}