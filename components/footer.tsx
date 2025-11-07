"use client"

import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { MapPin, Mail, Phone, Home, Building, Calendar } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Logo y empresa */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">I</span>
              </div>
              <span className="font-bold text-2xl text-background">Bairex</span>
            </div>
            <p className="text-background/80 mb-6 leading-relaxed">
              Más de 20 años construyendo sueños y creando hogares excepcionales 
              en las mejores ubicaciones de la ciudad.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/80">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Av. Corrientes 1234, CABA</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@bairex.com.ar</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+54 11 1234-5678</span>
              </div>
            </div>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h3 className="font-semibold mb-6 text-background text-lg">Enlaces útiles</h3>
            <div className="space-y-3">
              <button 
                onClick={() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-background/80 hover:text-background transition-colors text-sm"
              >
                Proyectos
              </button>
              <Link href="/nosotros" className="block text-background/80 hover:text-background transition-colors text-sm">
                Nosotros
              </Link>
              <button 
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-background/80 hover:text-background transition-colors text-sm"
              >
                Contacto
              </button>
            </div>

            <h4 className="font-medium mt-8 mb-4 text-background">Información de proyectos</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-background/80">
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">1, 2, 3 y 4 ambientes</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Building className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Lofts y Duplex</span>
              </div>
              <div className="flex items-center gap-3 text-background/80">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Entregas 2025-2026</span>
              </div>
            </div>
          </div>

          {/* Mapa */}
          <div>
            <h3 className="font-semibold mb-6 text-background text-lg">Nuestra ubicación</h3>
            <div className="bg-background/10 rounded-lg p-4 h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3284.0168903618447!2d-58.38375908477033!3d-34.60373998045853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccacb9f8ff113%3A0x22fd08b2b2c2db3a!2sAv.%20Corrientes%2C%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1sen!2sus!4v1635789012345!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <Separator className="my-12 bg-background/20" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © 2024 Bairex. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-sm text-background/60 hover:text-background transition-colors">
              Términos y condiciones
            </Link>
            <Link href="#" className="text-sm text-background/60 hover:text-background transition-colors">
              Política de privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}