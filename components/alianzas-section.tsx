"use client"

import { useEffect, useRef } from "react"
import { BlurFade } from "@/components/magicui/blur-fade"

const logos = [
  { name: "Empresa 1", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo1" },
  { name: "Empresa 2", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo2" },
  { name: "Empresa 3", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo3" },
  { name: "Empresa 4", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo4" },
  { name: "Empresa 5", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo5" },
  { name: "Empresa 6", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo6" },
  { name: "Empresa 7", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo7" },
  { name: "Empresa 8", logo: "https://via.placeholder.com/120x60/666666/ffffff?text=Logo8" }
]

export function AlianzasSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const scrollSpeed = 0.5

    const animate = () => {
      scrollPosition += scrollSpeed
      
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationId)
    }

    const handleMouseLeave = () => {
      animationId = requestAnimationFrame(animate)
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <section className="py-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <BlurFade delay={0.1}>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Alianzas
              <span className="block text-primary">Estratégicas</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Trabajamos junto a las mejores empresas del sector para brindarte la máxima calidad
            </p>
          </div>
        </BlurFade>

        <BlurFade delay={0.2}>
          <div className="relative">
            {/* Fade gradients */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling container */}
            <div 
              ref={scrollRef}
              className="flex gap-12 overflow-x-hidden py-8 scrollbar-none"
            >
              {/* Duplicate logos for infinite scroll */}
              {[...logos, ...logos].map((empresa, index) => (
                <div
                  key={`${empresa.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-32 h-16 group cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={empresa.logo}
                    alt={empresa.name}
                    className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}