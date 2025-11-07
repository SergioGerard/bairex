import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import UpdateList from "@/components/update-list"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Newspaper, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  GitBranch,
  Target,
  Sparkles
} from "lucide-react"
import Link from "next/link"
import { actualizaciones } from "./data"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Novedades - Finanzar | Últimas Actualizaciones y Mejoras",
  description: "Mantente al día con las últimas novedades de Finanzar. Descubre nuevas funciones, mejoras y actualizaciones de nuestra plataforma de proyecciones financieras.",
  keywords: ["novedades finanzar", "actualizaciones financieras", "nuevas funciones", "mejoras plataforma", "changelog finanzar"],
  openGraph: {
    title: "Novedades - Finanzar | Últimas Actualizaciones",
    description: "Mantente al día con las últimas novedades de Finanzar. Descubre nuevas funciones, mejoras y actualizaciones.",
    url: "https://finanzar.app/novedades",
  },
  twitter: {
    title: "Novedades - Finanzar | Últimas Actualizaciones",
    description: "Mantente al día con las últimas novedades de Finanzar. Descubre nuevas funciones, mejoras y actualizaciones.",
  },
}

export default function NovedadesPage() {
  // Calcular estadísticas dinámicas
  const totalVersions = actualizaciones.length
  const latestVersion = actualizaciones[0]?.version || "1.0.0"
  const totalFeatures = actualizaciones.reduce((acc, update) => acc + update.descripcion.length, 0)
  const monthsSinceStart = Math.ceil((new Date().getTime() - new Date('2025-03-06').getTime()) / (1000 * 60 * 60 * 24 * 30))

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            <BlurFade delay={0.1}>
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                En constante evolución
              </Badge>
            </BlurFade>
            <BlurFade delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Novedades y
                <span className="block text-primary">Actualizaciones</span>
              </h1>
            </BlurFade>
            <BlurFade delay={0.3}>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mb-12 leading-relaxed">
                Mantente al día con las últimas mejoras, nuevas funcionalidades y actualizaciones de FinanzAR. 
                Cada versión está diseñada para mejorar tu experiencia financiera.
              </p>
            </BlurFade>
            <BlurFade delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/dashboard">
                  <Button size="lg" className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                    Probar última versión <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/ayuda">
                  <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-lg font-semibold border border-border">
                    Ver documentación <Newspaper className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </BlurFade>
            <BlurFade delay={0.5}>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-foreground" />
                  <span>Actualizaciones gratuitas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-foreground" />
                  <span>Mejoras continuas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent-foreground" />
                  <span>Nuevas funcionalidades</span>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.6}>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <TrendingUp className="w-4 h-4 mr-2" />
                Estadísticas de desarrollo
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Progreso y evolución
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Números que reflejan nuestro compromiso con la mejora continua
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.7}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-border">
                  <GitBranch className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">{totalVersions}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    Versiones lanzadas
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-border">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">v{latestVersion}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    Versión actual
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-border">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">{totalFeatures}+</CardTitle>
                  <CardDescription className="text-base font-medium">
                    Mejoras implementadas
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 hover:shadow-lg text-center">
                <CardHeader className="pb-4">
                  <div className="rounded-xl bg-primary/10 w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-border">
                  <Calendar className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-primary">{monthsSinceStart}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    Meses de desarrollo
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* Updates Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <BlurFade delay={0.8}>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 px-4 py-2">
                <Calendar className="w-4 h-4 mr-2" />
                Historial completo
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Registro de cambios
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Cronología detallada de todas las actualizaciones, mejoras y nuevas funcionalidades
              </p>
            </div>
          </BlurFade>
          
          <BlurFade delay={0.9}>
            <div className="max-w-5xl mx-auto">
              <Card className="border-2 border-border hover:border-primary/20 transition-all duration-300 shadow-lg">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl">Actualizaciones de FinanzAR</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Desde el lanzamiento inicial hasta la versión más reciente, cada actualización representa nuestro compromiso con la excelencia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpdateList actualizaciones={actualizaciones} />
                </CardContent>
              </Card>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
        <div className="relative container mx-auto px-4 text-center">
          <BlurFade delay={1.0}>
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Users className="w-4 h-4 mr-2" />
              Únete a la evolución
            </Badge>
          </BlurFade>
          <BlurFade delay={1.1}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para experimentar
              <span className="block">las últimas mejoras?</span>
            </h2>
          </BlurFade>
          <BlurFade delay={1.2}>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Cada actualización está diseñada para hacer tu experiencia financiera más intuitiva, 
              precisa y poderosa. Descubre las nuevas funcionalidades hoy mismo.
            </p>
          </BlurFade>
          <BlurFade delay={1.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/dashboard">
                <Button size="lg" variant="secondary" className="gap-2 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Explorar dashboard <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      <Footer />
    </div>
  )
}

