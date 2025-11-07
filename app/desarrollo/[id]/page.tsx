'use client'

import { notFound } from 'next/navigation'
import { BlurFade } from '@/components/magicui/blur-fade'
import ProjectImageCarousel from '@/components/project-image-carousel'
import ProjectHeader from '@/components/project-header'

const BLUR_FADE_DELAY = 0.02

interface DesarrolloPageProps {
  params: {
    id: string
  }
}

// Datos de ejemplo para los desarrollos
const desarrollosData: { [key: string]: any } = {
  '1': {
    name: 'Desarrollo Premium 1',
    logo: '/proyectos/proyecto1/edi1.png',
    images: [
      '/proyectos/proyecto1/edi1.png',
      '/proyectos/proyecto2/edi2.png',
      '/proyectos/proyecto1/edi1.png',
      '/proyectos/proyecto2/edi2.png'
    ],
    descripcion: 'Un desarrollo inmobiliario de alta gama ubicado en una zona privilegiada de la ciudad.',
    estado: 'En construcción',
    entrega: '2025',
    ubicacion: 'Buenos Aires, Argentina',
    superficie: '45-120 m²',
    ambientes: '1, 2 y 3 ambientes',
    amenities: ['Piscina', 'Gimnasio', 'Solarium', 'Parrillas', 'Seguridad 24hs']
  },
  '2': {
    name: 'Desarrollo Premium 2',
    logo: '/proyectos/proyecto2/edi2.png',
    images: [
      '/proyectos/proyecto2/edi2.png',
      '/proyectos/proyecto1/edi1.png',
      '/proyectos/proyecto2/edi2.png',
      '/proyectos/proyecto1/edi1.png'
    ],
    descripcion: 'Moderno complejo residencial con las mejores terminaciones y ubicación estratégica.',
    estado: 'Finalizado',
    entrega: '2024',
    ubicacion: 'Buenos Aires, Argentina',
    superficie: '55-140 m²',
    ambientes: '2, 3 y 4 ambientes',
    amenities: ['Piscina climatizada', 'SUM', 'Terraza', 'Cocheras', 'Portería']
  }
}

// Generar datos para todos los desarrollos (1-30)
for (let i = 3; i <= 30; i++) {
  desarrollosData[i.toString()] = {
    name: `Desarrollo ${i}`,
    logo: i % 2 === 0 ? '/proyectos/proyecto2/edi2.png' : '/proyectos/proyecto1/edi1.png',
    images: [
      i % 2 === 0 ? '/proyectos/proyecto2/edi2.png' : '/proyectos/proyecto1/edi1.png',
      i % 2 === 0 ? '/proyectos/proyecto1/edi1.png' : '/proyectos/proyecto2/edi2.png',
      i % 2 === 0 ? '/proyectos/proyecto2/edi2.png' : '/proyectos/proyecto1/edi1.png',
      i % 2 === 0 ? '/proyectos/proyecto1/edi1.png' : '/proyectos/proyecto2/edi2.png'
    ],
    descripcion: `Desarrollo inmobiliario moderno con excelente ubicación y amenities de primera calidad.`,
    estado: ['En construcción', 'Finalizado', 'Entrega 2025', 'Entrega 2026'][i % 4],
    entrega: ['2025', '2026', '2024', '2025'][i % 4],
    ubicacion: 'Buenos Aires, Argentina',
    superficie: `${40 + (i * 5)}-${100 + (i * 10)} m²`,
    ambientes: '1, 2 y 3 ambientes',
    amenities: ['Piscina', 'Gimnasio', 'Seguridad 24hs', 'Parrillas', 'SUM']
  }
}

export default function DesarrolloPage({ params }: DesarrolloPageProps) {
  const desarrolloId = params.id
  const desarrollo = desarrollosData[desarrolloId]
  
  if (!desarrollo) {
    notFound()
  }

  return (
    <main className="flex flex-col min-h-[100dvh] py-12">
      {/* Header Section */}
      <ProjectHeader project={desarrollo} blurDelay={BLUR_FADE_DELAY} />

      {/* Carousel Section */}
      <section className="mx-auto w-full mb-8 px-8 md:px-0 cursor-grab active:cursor-grabbing select-none">
        <BlurFade delay={BLUR_FADE_DELAY * 2}>
          <ProjectImageCarousel 
            images={desarrollo.images}
            projectName={desarrollo.name}
          />
        </BlurFade>
      </section>

      {/* Content Section */}
      <section className="mx-auto w-full max-w-3xl px-8 mb-24">
        <BlurFade delay={BLUR_FADE_DELAY * 3}>
          <div className="grid md:grid-cols-[2fr_1fr] gap-8">
            {/* Columna Izquierda - Descripción */}
            <div className="space-y-4">
              <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">DESCRIPCIÓN</h3>
              <div className="text-md leading-relaxed">
                <p>{desarrollo.descripcion}</p>
              </div>
            </div>

            {/* Columna Derecha - Detalles */}
            <div className="space-y-8">
              {/* Estado */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">ESTADO</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    {desarrollo.estado}
                  </span>
                </div>
              </div>

              {/* Entrega */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">ENTREGA</h3>
                <div className="text-sm">
                  <span className="text-foreground">{desarrollo.entrega}</span>
                </div>
              </div>

              {/* Ubicación */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">UBICACIÓN</h3>
                <div className="text-sm">
                  <span className="text-foreground">{desarrollo.ubicacion}</span>
                </div>
              </div>

              {/* Superficie */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">SUPERFICIE</h3>
                <div className="text-sm">
                  <span className="text-foreground">{desarrollo.superficie}</span>
                </div>
              </div>

              {/* Ambientes */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">AMBIENTES</h3>
                <div className="text-sm">
                  <span className="text-foreground">{desarrollo.ambientes}</span>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-muted-foreground text-sm font-medium mb-3 tracking-wider">AMENITIES</h3>
                <div className="flex flex-wrap gap-2">
                  {desarrollo.amenities.map((amenity: string, index: number) => (
                    <span 
                      key={index} 
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </BlurFade>
      </section>
    </main>
  )
}