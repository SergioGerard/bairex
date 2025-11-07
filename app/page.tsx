"use client"

import { Metadata } from "next"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { DesarrollosSection } from "@/components/desarrollos-section"
import { MetricasSection } from "@/components/metricas-section"
import { ProyectosDestacadosSection } from "@/components/proyectos-destacados-section"
import { AlianzasSection } from "@/components/alianzas-section"
import { ContactoSection } from "@/components/contacto-section"

// Nota: Los metadatos se manejan desde layout.tsx para páginas client-side
// Para SEO adicional, se pueden agregar meta tags dinámicos con next/head si es necesario

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      {/* Agregar padding-top para compensar el navbar fijo */}
      <main className="pt-16">
        <HeroSection />
        <DesarrollosSection />
        <MetricasSection />
        <ProyectosDestacadosSection />
        <AlianzasSection />
        <ContactoSection />
      </main>

      <Footer />
    </div>
  )
}